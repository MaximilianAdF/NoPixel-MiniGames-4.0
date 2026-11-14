import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { rateLimit } from '@/lib/rateLimit';
import { isSaneNumber } from '@/lib/gameValidation';
import { calculateChallengeXP } from '@/lib/challengeRewards';

export interface CompleteChallengeRequest {
  challengeId: string;
  score: number;
  timeMs: number;
  mistakes: number;
  won: boolean;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;
    const limited = await rateLimit(`challenge:${userId}`, { maxRequests: 10, windowSeconds: 60 });
    if (limited) return limited;

    const body: CompleteChallengeRequest | null = await request.json().catch(() => null);
    if (!body || typeof body.challengeId !== 'string' || !ObjectId.isValid(body.challengeId)) {
      return NextResponse.json({ error: 'Invalid challengeId' }, { status: 400 });
    }
    if (!isSaneNumber(body.score) || !isSaneNumber(body.timeMs) || !isSaneNumber(body.mistakes) || typeof body.won !== 'boolean') {
      return NextResponse.json({ error: 'Invalid score, timeMs, mistakes, or won' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('nopixel');
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const challenge = await db.collection('dailyChallenges').findOne({ _id: new ObjectId(body.challengeId) });
    if (!challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    if (challenge.date !== today) {
      return NextResponse.json({ error: 'This daily challenge has expired' }, { status: 409 });
    }

    let requiredScore = challenge.targetScore;
    switch (challenge.game) {
      // Lockpick's score is the current ring index, including on a failed unlock.
      // The explicit outcome distinguishes reaching the last ring from winning it.
      case 'lockpick':
      case 'laundromat': requiredScore = (challenge.levels || challenge.targetScore) - 1; break;
      case 'word-memory': requiredScore = challenge.words || challenge.targetScore; break;
      case 'pincracker': requiredScore = challenge.pinLength || challenge.targetScore; break;
      case 'chopping': requiredScore = challenge.numLetters || challenge.targetScore; break;
    }
    const completed = body.won && body.score >= requiredScore && body.timeMs <= challenge.targetTime;
    const progressResult = await db.collection('userChallengeProgress').findOneAndUpdate(
      { userId, challengeId: body.challengeId },
      {
        $inc: { attempts: 1 },
        $max: { 'bestAttempt.score': body.score },
        $min: { 'bestAttempt.time': body.timeMs },
        $set: {
          date: challenge.date, 'bestAttempt.mistakes': body.mistakes, updatedAt: now,
          ...(completed ? { completed: true, completedAt: now } : {}),
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: 'after' },
    );

    let xpEarned = 0;
    let newStreak = 0;
    let newLevel: number | undefined;
    let leveledUp = false;
    if (completed) {
      const reward = calculateChallengeXP(challenge);
      const yesterday = new Date(now);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      // Eligibility, XP, streak and level change in ONE atomic document update.
      // A concurrent request sees today's date and cannot claim the reward again.
      const before = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(userId), lastDailyChallengeDate: { $ne: today } },
        [
          { $set: {
            totalXP: { $add: [{ $ifNull: ['$totalXP', 0] }, reward] },
            currentDailyStreak: { $cond: [
              { $eq: ['$lastDailyChallengeDate', yesterdayStr] },
              { $add: [{ $ifNull: ['$currentDailyStreak', 0] }, 1] }, 1,
            ] },
            lastDailyChallengeDate: today, updatedAt: now,
          } },
          { $set: {
            longestDailyStreak: { $max: [{ $ifNull: ['$longestDailyStreak', 0] }, '$currentDailyStreak'] },
            level: { $add: [{ $floor: { $round: [{ $pow: [{ $divide: ['$totalXP', 25] }, 1 / 3] }, 10] } }, 1] },
          } },
        ],
        { returnDocument: 'before' },
      );
      if (before) {
        xpEarned = reward;
        newStreak = before.lastDailyChallengeDate === yesterdayStr ? (before.currentDailyStreak || 0) + 1 : 1;
        newLevel = Math.floor(Math.cbrt(((before.totalXP || 0) + reward) / 25)) + 1;
        leveledUp = newLevel > (before.level || 1);
        await db.collection('userChallengeProgress').updateOne(
          { userId, challengeId: body.challengeId }, { $set: { xpEarned } },
        );
      }
    }

    return NextResponse.json({
      success: true, completed: progressResult?.completed || false,
      attempts: progressResult?.attempts ?? 1, bestScore: progressResult?.bestAttempt?.score ?? body.score,
      xpEarned, streakUpdated: xpEarned > 0, newStreak, leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    return NextResponse.json({ error: 'Failed to complete challenge' }, { status: 500 });
  }
}

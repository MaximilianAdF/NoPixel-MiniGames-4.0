import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';

/**
 * GET /api/challenges/history
 * Get user's daily challenge history
 */
export async function GET() {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const client = await clientPromise;
    const db = client.db('nopixel');

    // Get all challenge progress for this user
    const history = await db.collection('userChallengeProgress')
      .find({ userId })
      .sort({ date: -1 }) // Most recent first
      .limit(100) // Last 100 challenges
      .toArray();

    // Transform the data for the frontend
    const formattedHistory = await Promise.all(
      history.map(async (item) => {
        // Get challenge details
        const challenge = await db.collection('dailyChallenges').findOne({
          _id: item.challengeId ? require('mongodb').ObjectId.createFromHexString(item.challengeId) : null,
        });

        return {
          challengeId: item.challengeId,
          date: item.date,
          game: challenge?.game || 'unknown',
          completed: item.completed || false,
          attempts: item.attempts || 0,
          bestScore: item.bestAttempt?.score || 0,
          xpEarned: item.xpEarned || 0,
          completedAt: item.completedAt,
          // Include challenge parameters for display
          targetScore: challenge?.targetScore,
          targetTime: challenge?.targetTime,
          rows: challenge?.rows,
          columns: challenge?.columns,
          levels: challenge?.levels,
          words: challenge?.words,
          maxRounds: challenge?.maxRounds,
          pinLength: challenge?.pinLength,
          numLetters: challenge?.numLetters,
          description: challenge?.description,
        };
      })
    );

    return NextResponse.json({
      success: true,
      history: formattedHistory,
    });
  } catch (error) {
    console.error('Challenge history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenge history' },
      { status: 500 }
    );
  }
}

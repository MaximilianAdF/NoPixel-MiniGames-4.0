import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET /api/stats/user/[userId]
 * 
 * Get public profile and stats for any user
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    const client = await clientPromise;
    const db = client.db('nopixel');
    
    // Get user data
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get all game stats for this user
    const gameStats = await db.collection('gameStats').find({ userId }).toArray();
    
    // Get recent challenge history (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const challengeHistory = await db.collection('userChallengeProgress')
      .find({
        userId,
        date: { $gte: thirtyDaysAgo.toISOString().split('T')[0] },
      })
      .sort({ date: -1 })
      .limit(30)
      .toArray();
    
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        level: user.level || 1,
        totalXP: user.totalXP || 0,
        totalGamesPlayed: user.totalGamesPlayed || 0,
        totalTimePlayedMs: user.totalTimePlayedMs || 0,
        currentDailyStreak: user.currentDailyStreak || 0,
        longestDailyStreak: user.longestDailyStreak || 0,
        joinedAt: user.joinedAt || user.createdAt,
      },
      gameStats: gameStats.map(stat => ({
        game: stat.game,
        gamesPlayed: stat.gamesPlayed || 0,
        gamesWon: stat.gamesWon || 0,
        gamesLost: stat.gamesLost || 0,
        // Best stats (leaderboard-eligible, standard preset only)
        bestScore: stat.bestScore || 0,
        bestTime: stat.bestTime || 0,
        // Overall best stats (all plays, any settings)
        bestScoreOverall: stat.bestScoreOverall || 0,
        bestTimeOverall: stat.bestTimeOverall || 0,
        // Averages
        averageScore: stat.averageScore || 0,
        averageTime: stat.averageTime || 0,
        totalTimePlayedMs: stat.totalTimePlayedMs || 0,
        currentStreak: stat.currentStreak || 0,
        longestStreak: stat.longestStreak || 0,
        lastPlayedAt: stat.lastPlayedAt,
      })),
      challengeHistory: challengeHistory.map(challenge => ({
        date: challenge.date,
        completed: challenge.completed || false,
        attempts: challenge.attempts || 0,
        bestScore: challenge.bestAttempt?.score || 0,
        xpEarned: challenge.xpEarned || 0,
      })),
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}

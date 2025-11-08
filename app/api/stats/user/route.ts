import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET /api/stats/user
 * 
 * Get the current user's stats across all games
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
        level: user.level,
        totalXP: user.totalXP,
        totalGamesPlayed: user.totalGamesPlayed,
        totalTimePlayedMs: user.totalTimePlayedMs,
        currentDailyStreak: user.currentDailyStreak,
        longestDailyStreak: user.longestDailyStreak,
        joinedAt: user.joinedAt,
      },
      gameStats: gameStats.map(stat => ({
        game: stat.game,
        gamesPlayed: stat.gamesPlayed,
        gamesWon: stat.gamesWon || 0,
        gamesLost: stat.gamesLost || 0,
        // Leaderboard-eligible stats (standard preset only)
        bestScore: stat.bestScore,
        bestTime: stat.bestTime,
        // Overall stats (all plays)
        bestScoreOverall: stat.bestScoreOverall,
        bestTimeOverall: stat.bestTimeOverall,
        averageScore: stat.averageScore,
        averageTime: stat.averageTime,
        totalTimePlayedMs: stat.totalTimePlayedMs,
        currentStreak: stat.currentStreak,
        longestStreak: stat.longestStreak,
        lastPlayedAt: stat.lastPlayedAt,
      })),
      challengeHistory: challengeHistory.map(challenge => ({
        date: challenge.date,
        completed: challenge.completed,
        attempts: challenge.attempts,
        bestScore: challenge.bestAttempt?.score,
        xpEarned: challenge.xpEarned,
      })),
    });

  } catch (error) {
    console.error('Error getting user stats:', error);
    return NextResponse.json(
      { error: 'Failed to get user stats' },
      { status: 500 }
    );
  }
}

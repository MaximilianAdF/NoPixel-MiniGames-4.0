import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { GameType } from '@/interfaces/user';
import { ObjectId } from 'mongodb';
import { calculateDifficultyMultiplier } from '@/app/utils/difficultyCalculator';
import { rateLimit } from '@/lib/rateLimit';
import { isStandardPreset, TIME_BASED_GAMES, SCORE_BASED_GAMES } from '@/app/utils/gamePresets';

export interface SaveGameStatsRequest {
  game: GameType;
  score: number;
  timePlayedMs: number; // Changed from timeMs to match GameStatsTracker
  mistakes?: number;
  won: boolean; // Changed from completed to match GameStatsTracker
  targetScore?: number;
  gameSettings?: Record<string, any>; // Difficulty settings for XP calculation
}

/**
 * POST /api/stats/save
 * 
 * Save a game completion/attempt to the database
 * Updates user stats and game-specific stats
 * 
 * WHAT GETS SAVED:
 * 1. ALL game attempts (won or lost, any preset):
 *    - gamesPlayed count incremented
 *    - totalTimePlayedMs accumulated
 *    - lastPlayedAt timestamp
 * 
 * 2. ONLY WON games (any preset):
 *    - Added to recentScores, recentTimes arrays (for averaging)
 *    - bestScoreOverall updated (higher is better)
 *    - bestTimeOverall updated (lower is better)
 *    - These are used for PROFILE display
 * 
 * 3. ONLY standard preset + won games:
 *    - isLeaderboardEligible set to true
 *    - bestTime / bestScore updated (if new personal best)
 *    - These are used for LEADERBOARD rankings
 */
export async function POST(request: Request) {
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
    
    // Rate limit: 30 requests per minute per user (prevents rapid spam)
    const rateLimitResult = await rateLimit(userId, {
      maxRequests: 30,
      windowSeconds: 60,
    });
    
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const body: SaveGameStatsRequest = await request.json();
    
    // Validate request
    if (!body.game || body.score === undefined || body.timePlayedMs === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: game, score, timePlayedMs' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('nopixel');
    
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if this run qualifies for leaderboard (standard preset + won)
    const isLeaderboardRun = body.won && body.gameSettings && isStandardPreset(body.game, body.gameSettings);
    
    // For leaderboard runs, check if this is a new personal best
    let shouldUpdateLeaderboard = false;
    if (isLeaderboardRun) {
      const existingLeaderboardEntry = await db.collection('gameStats').findOne({ 
        userId, 
        game: body.game,
        isLeaderboardEligible: true
      });

      if (!existingLeaderboardEntry) {
        // First leaderboard-eligible run
        shouldUpdateLeaderboard = true;
      } else {
        // Check if this beats the existing best
        if (TIME_BASED_GAMES.includes(body.game)) {
          // For time-based: lower time is better
          shouldUpdateLeaderboard = body.timePlayedMs < (existingLeaderboardEntry.bestTime || Infinity);
        } else if (SCORE_BASED_GAMES.includes(body.game)) {
          // For score-based (word-memory): higher score is better
          shouldUpdateLeaderboard = body.score > (existingLeaderboardEntry.bestScore || 0);
        }
      }
    }

    // Update or create game stats
    const gameStatsUpdate: any = {
      $inc: {
        gamesPlayed: 1,
        totalTimePlayedMs: body.timePlayedMs,
        ...(body.won ? { gamesWon: 1 } : { gamesLost: 1 }), // Track won/lost separately
      },
      $set: {
        lastPlayedAt: now,
      },
      $setOnInsert: {
        firstPlayedAt: now,
        currentStreak: 0,
        longestStreak: 0,
      },
    };

    // Only track scores/times for WON games (for averaging and bests)
    if (body.won) {
      gameStatsUpdate.$push = {
        recentScores: {
          $each: [body.score],
          $slice: -10, // Keep last 10 scores from won games
        } as any,
        recentTimes: {
          $each: [body.timePlayedMs],
          $slice: -10, // Keep last 10 times from won games
        } as any,
        recentDates: {
          $each: [now],
          $slice: -10, // Keep last 10 dates
        } as any,
      };
    }

    // If this is a new leaderboard best, update the leaderboard fields
    if (shouldUpdateLeaderboard) {
      gameStatsUpdate.$set.isLeaderboardEligible = true;
      gameStatsUpdate.$set.bestTime = body.timePlayedMs;
      gameStatsUpdate.$set.bestScore = body.score;
      gameStatsUpdate.$set.leaderboardSetAt = now;
    }

    await db.collection('gameStats').updateOne(
      { userId, game: body.game },
      gameStatsUpdate,
      { upsert: true }
    );

    // Calculate new average score and time, and update overall bests
    const gameStats = await db.collection('gameStats').findOne({ userId, game: body.game });
    if (gameStats) {
      const updates: any = {};
      
      if (gameStats.recentScores && gameStats.recentScores.length > 0) {
        const avgScore = gameStats.recentScores.reduce((a: number, b: number) => a + b, 0) / gameStats.recentScores.length;
        updates.averageScore = Math.round(avgScore);
      }
      
      if (gameStats.recentTimes && gameStats.recentTimes.length > 0) {
        const avgTime = gameStats.recentTimes.reduce((a: number, b: number) => a + b, 0) / gameStats.recentTimes.length;
        updates.averageTime = Math.round(avgTime);
      }
      
      // Always track overall best score and time for profile display (regardless of preset)
      // Only track for won games
      if (body.won) {
        // Update best score overall (higher is better)
        if (!gameStats.bestScoreOverall || body.score > gameStats.bestScoreOverall) {
          updates.bestScoreOverall = body.score;
        }
        
        // Update best time overall (lower is better)
        if (!gameStats.bestTimeOverall || body.timePlayedMs < gameStats.bestTimeOverall) {
          updates.bestTimeOverall = body.timePlayedMs;
        }
      }
      
      if (Object.keys(updates).length > 0) {
        await db.collection('gameStats').updateOne(
          { userId, game: body.game },
          { $set: updates }
        );
      }
    }

    // Update user aggregated stats
    const xpEarned = calculateXP(body.score, body.timePlayedMs, body.won, body.game, body.gameSettings);
    const userUpdateResult = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $inc: {
          totalGamesPlayed: 1,
          totalTimePlayedMs: body.timePlayedMs,
          totalXP: xpEarned,
        },
        $set: {
          lastSeenAt: now,
          updatedAt: now,
        },
      },
      { returnDocument: 'after' }
    );

    // Calculate level from XP
    const user = userUpdateResult;
    let leveledUp = false;
    let newLevel = user?.level || 1;
    
    if (user && user.totalXP !== undefined) {
      const calculatedLevel = calculateLevel(user.totalXP);
      if (calculatedLevel !== user.level) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $set: { level: calculatedLevel } }
        );
        leveledUp = true;
        newLevel = calculatedLevel;
      }
    }

    // Get updated game stats for response
    const updatedGameStats = await db.collection('gameStats').findOne({ userId, game: body.game });

    return NextResponse.json({
      success: true,
      xpEarned,
      leveledUp,
      newLevel,
      stats: {
        bestScore: updatedGameStats?.bestScore || body.score,
        averageScore: updatedGameStats?.averageScore || body.score,
        gamesPlayed: updatedGameStats?.gamesPlayed || 1,
      },
    });

  } catch (error) {
    console.error('Error saving game stats:', error);
    return NextResponse.json(
      { error: 'Failed to save game stats' },
      { status: 500 }
    );
  }
}

/**
 * Calculate XP earned from a game based on difficulty settings
 * Returns 0 XP if the player lost
 * Uses difficulty multiplier from game settings to scale XP rewards
 */
function calculateXP(
  score: number, 
  timeMs: number, 
  won: boolean, 
  game: string,
  gameSettings?: Record<string, any>
): number {
  // No XP for losing
  if (!won) {
    return 0;
  }
  
  // Base XP values for each game (completing at normal difficulty)
  const BASE_XP: Record<string, number> = {
    'thermite': 100,
    'roof-running': 90,
    'laundromat': 80,
    'lockpick': 65,
    'repair-kit': 15,
    'word-memory': 60,
    'chopping': 50,
    'pincracker': 45,
  };
  
  // Get base XP for this game (default to 50 if unknown)
  const baseXP = BASE_XP[game] || 50;
  
  // Calculate difficulty multiplier from game settings
  let difficultyMultiplier = 1.0;
  if (gameSettings) {
    difficultyMultiplier = calculateDifficultyMultiplier(game, gameSettings);
  }
  
  // Apply difficulty multiplier to base XP
  // This means harder settings directly increase XP rewards
  const finalXP = Math.floor(baseXP * difficultyMultiplier);
  
  return finalXP;
}

/**
 * Calculate level from total XP using enhanced polynomial formula
 * This provides exponential-like growth for higher levels
 * Formula: floor(cbrt(xp / 25)) + 1 for cubic progression
 * 
 * Level 1: 0-24 XP
 * Level 2: 25-199 XP  (25-175 needed)
 * Level 3: 200-674 XP (175-475 needed)
 * Level 5: 1,600-2,024 XP (~1,350 needed from 4→5)
 * Level 10: 18,225-21,924 XP (~3,700 needed from 9→10)
 * Level 20: 144,525-153,224 XP (~8,700 needed from 19→20)
 * Level 30: 487,225-501,224 XP (~14,000 needed from 29→30)
 * Level 50: 2,940,025-2,970,024 XP (~30,000 needed from 49→50)
 */
function calculateLevel(totalXP: number): number {
  if (totalXP < 25) return 1;
  // Cubic root formula for more exponential growth
  return Math.floor(Math.cbrt(totalXP / 25)) + 1;
}

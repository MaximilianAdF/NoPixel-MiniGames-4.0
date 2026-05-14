import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { GameType } from '@/interfaces/user';
import { ObjectId } from 'mongodb';
import { calculateDifficultyMultiplier } from '@/app/utils/difficultyCalculator';
import { rateLimit } from '@/lib/rateLimit';

export interface RecordGameRequest {
  game: GameType;
  score: number;
  timePlayedMs: number; // Changed from timeMs to match GameStatsTracker
  mistakes?: number;
  won: boolean; // Changed from completed to match GameStatsTracker
  targetScore?: number;
  gameSettings?: Record<string, any>; // Difficulty settings for XP calculation
}

/**
 * POST /api/stats/record-game
 *
 * Records a game completion against the player's account: increments the
 * lifetime games/time totals, awards XP, and recomputes the player's level.
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

    const body: RecordGameRequest = await request.json();

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

    // Update user aggregated stats and award XP
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

    return NextResponse.json({
      success: true,
      xpEarned,
      leveledUp,
      newLevel,
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

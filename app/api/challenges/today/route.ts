import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { GameType } from '@/interfaces/user';

/**
 * GET /api/challenges/today
 * 
 * Get today's daily challenge
 * Creates one if it doesn't exist yet (deterministic based on date)
 */
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const client = await clientPromise;
    const db = client.db('nopixel');
    
    // Try to create unique index (will silently fail if already exists)
    try {
      await db.collection('dailyChallenges').createIndex({ date: 1 }, { unique: true });
    } catch (indexError: any) {
      // Ignore if index already exists or there are duplicates
      if (indexError.code !== 11000 && indexError.code !== 85) {
        console.error('Index creation warning:', indexError.message);
      }
    }
    
    // Check if today's challenge exists (limit 1 in case of duplicates)
    let challenge = await db.collection('dailyChallenges').findOne({ date: today });
    
    // If duplicates exist, clean them up
    if (challenge) {
      const allChallenges = await db.collection('dailyChallenges').find({ date: today }).toArray();
      if (allChallenges.length > 1) {
        const toDelete = allChallenges.slice(1).map(c => c._id);
        await db.collection('dailyChallenges').deleteMany({ _id: { $in: toDelete } });
      }
    }
    
    if (!challenge) {
      // Generate today's challenge (deterministic)
      const newChallenge = generateDailyChallenge(today);
      
      try {
        const result = await db.collection('dailyChallenges').insertOne(newChallenge);
        challenge = { ...newChallenge, _id: result.insertedId };
      } catch (error: any) {
        // If duplicate key error (race condition), fetch the existing challenge
        if (error.code === 11000) {
          challenge = await db.collection('dailyChallenges').findOne({ date: today });
        } else {
          throw error;
        }
      }
    }
    
    // If user is logged in, get their progress
    const session = await getSession();
    let userProgress = null;
    
    if (session && session.user && challenge) {
      userProgress = await db.collection('userChallengeProgress').findOne({
        userId: session.user.id,
        challengeId: challenge._id.toString(),
      });
    }

    if (!challenge) {
      return NextResponse.json(
        { error: 'Failed to generate challenge' },
        { status: 500 }
      );
    }

    // Get stats for this challenge
    const allProgress = await db.collection('userChallengeProgress').find({
      challengeId: challenge._id.toString(),
    }).toArray();

    const stats = {
      totalAttempts: allProgress.reduce((sum, p) => sum + (p.attempts || 0), 0),
      totalCompletions: allProgress.filter(p => p.completed).length,
      uniquePlayers: allProgress.length,
    };
    
    return NextResponse.json({
      id: challenge._id.toString(),
      date: challenge.date,
      game: challenge.game,
      description: challenge.description,
      targetScore: challenge.targetScore,
      targetTime: challenge.targetTime,
      xpReward: challenge.xpReward,
      specialCondition: challenge.specialCondition,
      // Game-specific settings
      rows: challenge.rows,
      columns: challenge.columns,
      levels: challenge.levels,
      words: challenge.words,
      numLetters: challenge.numLetters,
      pinLength: challenge.pinLength,
      stats,
      userProgress: userProgress ? {
        completed: userProgress.completed,
        attempts: userProgress.attempts,
        bestScore: userProgress.bestAttempt?.score,
        bestTime: userProgress.bestAttempt?.time,
      } : null,
    });

  } catch (error) {
    console.error('Error getting daily challenge:', error);
    return NextResponse.json(
      { error: 'Failed to get daily challenge' },
      { status: 500 }
    );
  }
}

/**
 * Generate a deterministic daily challenge based on the date
 * Uses specifications from DAILY_CHALLENGE_GAME_SETTINGS.md
 */
function generateDailyChallenge(date: string) {
  // Use date as seed for deterministic random with better distribution
  const seed = hashCode(date);
  const rng = seededRandom(seed);
  
  // Exclude repair-kit from daily challenges
  const games: GameType[] = [
    'thermite',
    'roof-running',
    'laundromat',
    'word-memory',
    'pincracker',
    'chopping',
    'lockpick',
  ];
  
  // Use multiple RNG calls to get better distribution
  const rng1 = rng();
  const rng2 = rng();
  const combined = (rng1 + rng2) / 2;
  const game = games[Math.floor(combined * games.length)];
  
  let challenge: any = {
    date,
    game,
    createdAt: new Date(),
    specialCondition: null,
  };
  
  // Generate settings based on game type
  switch (game) {
    case 'thermite': {
      const targetScore = Math.floor(24 + rng() * (48 - 24 + 1));
      const timer = Math.floor(50 * (targetScore / 24));
      challenge.targetScore = targetScore;
      challenge.targetTime = timer * 1000; // Convert to ms
      challenge.rows = 6;
      challenge.columns = 6;
      challenge.description = `Complete Thermite (${targetScore} score, ${timer}s)`;
      challenge.xpReward = 1000; // Base XP
      break;
    }
    
    case 'roof-running': {
      const rows = Math.floor(8 + rng() * (10 - 8 + 1));
      const columns = Math.floor(11 + rng() * (15 - 11 + 1));
      const timer = Math.floor((rows * columns) / 3.25);
      challenge.rows = rows;
      challenge.columns = columns;
      challenge.targetTime = timer * 1000;
      challenge.targetScore = rows * columns * 50; // Points per tile
      challenge.description = `Navigate ${rows}x${columns} grid in ${timer}s`;
      challenge.xpReward = 800; // Base XP
      break;
    }
    
    case 'laundromat': {
      const levels = Math.floor(5 + rng() * (10 - 5 + 1)); // 5-8 levels (reasonable range)
      const timer = levels * 8; // 12 seconds per level
      challenge.levels = levels;
      challenge.targetTime = timer * 1000;
      challenge.targetScore = levels * 1000; // 1000 points per level completed
      challenge.description = `Complete ${levels} laundromat levels in ${timer}s`;
      challenge.xpReward = 700; // Base XP
      break;
    }
    
    case 'word-memory': {
      const words = Math.floor(25 + rng() * (50 - 25 + 1));
      const timer = Math.floor(25 * (words / 25));
      challenge.words = words;
      challenge.targetTime = timer * 1000;
      challenge.targetScore = words * 100; // 100 points per word
      challenge.description = `Remember ${words} words in ${timer}s`;
      challenge.xpReward = 600; // Base XP
      break;
    }
    
    case 'pincracker': {
      const pinLength = Math.floor(4 + rng() * (6 - 4 + 1)); // 4-6 digits
      const timer = 20 + (pinLength - 4) * 15; // Base 20s, +15s per extra digit
      challenge.pinLength = pinLength;
      challenge.targetTime = timer * 1000;
      challenge.targetScore = pinLength * 2000; // 2000 points per digit
      challenge.description = `Crack ${pinLength}-digit PIN in ${timer}s`;
      challenge.xpReward = 500; // Base XP
      break;
    }
    
    case 'chopping': {
      const letters = Math.floor(15 + rng() * (20 - 15 + 1)); // 15-20 letters
      const timer = Math.floor(7 + rng() * (10 - 7 + 1)); // 7-10 seconds
      challenge.numLetters = letters;
      challenge.targetTime = timer * 1000;
      challenge.targetScore = letters * 700; // 700 points per letter
      challenge.description = `Chop ${letters} letters in ${timer}s`;
      challenge.xpReward = 400; // Base XP
      break;
    }
    
    case 'lockpick': {
      const levels = Math.floor(4 + rng() * (7 - 4 + 1)); // 4-7 levels (reasonable range)
      const timer = levels * 11; // 20 seconds per level
      challenge.levels = levels;
      challenge.targetTime = timer * 1000;
      challenge.targetScore = levels * 1000; // 1000 points per level completed
      challenge.description = `Pick ${levels} lockpick levels in ${timer}s`;
      challenge.xpReward = 400; // Base XP
      break;
    }
  }
  
  return challenge;
}

/**
 * Simple hash function for string
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator
 */
function seededRandom(seed: number) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

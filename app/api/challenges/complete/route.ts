import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { rateLimit } from '@/lib/rateLimit';

export interface CompleteChallengeRequest {
  challengeId: string;
  score: number;
  timeMs: number;
  mistakes: number;
}

/**
 * POST /api/challenges/complete
 * 
 * Submit a challenge attempt
 * Updates user's challenge progress and streak if successful
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
    
    // Rate limit: 10 requests per minute per user (challenges)
    const rateLimitResult = await rateLimit(userId, {
      maxRequests: 10,
      windowSeconds: 60,
    });
    
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const body: CompleteChallengeRequest = await request.json();
    
    // Validate request
    if (!body.challengeId || body.score === undefined || body.timeMs === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('nopixel');
    
    // Get the challenge
    const challenge = await db.collection('dailyChallenges').findOne({
      _id: new ObjectId(body.challengeId),
    });
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }
    
    // Check if challenge requirements are met
    // Different games have different completion criteria
    let completed = false;
    
    switch (challenge.game) {
      case 'laundromat':
      case 'lockpick':
        // For NPLockpick-based games: score is current level (0-indexed)
        // Completed if score >= levels - 1 (e.g., level 4 means completed 5 levels)
        // AND time is within limit
        completed = body.score >= (challenge.levels || challenge.targetScore) - 1 && body.timeMs <= challenge.targetTime;
        break;
        
      case 'thermite':
        // Thermite: must reach target score within time limit
        completed = body.score >= challenge.targetScore && body.timeMs <= challenge.targetTime;
        break;
        
      case 'roof-running':
      case 'word-memory':
      case 'pincracker':
      case 'chopping':
        // These games: just need to complete within time limit (score is always pass/fail)
        completed = body.timeMs <= challenge.targetTime;
        break;
        
      default:
        // Fallback: check both score and time
        completed = body.score >= challenge.targetScore && body.timeMs <= challenge.targetTime;
        break;
    }
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Build the update object - only set completed to true if this attempt succeeded
    // Never set it back to false (once completed, always completed)
    const updateObj: any = {
      $inc: {
        attempts: 1,
      },
      $max: {
        'bestAttempt.score': body.score,
      },
      $min: {
        'bestAttempt.time': body.timeMs,
      },
      $set: {
        date: challenge.date,
        'bestAttempt.mistakes': body.mistakes,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    };
    
    // Only update completed status if this attempt was successful
    // This ensures completed status never goes from true back to false
    if (completed) {
      updateObj.$set.completed = true;
      updateObj.$set.completedAt = now;
    }
    
    // Update or create user's challenge progress
    const progressResult = await db.collection('userChallengeProgress').findOneAndUpdate(
      {
        userId,
        challengeId: body.challengeId,
      },
      updateObj,
      {
        upsert: true,
        returnDocument: 'after',
      }
    );
    
    let streakUpdated = false;
    let newStreak = 0;
    let xpEarned = 0;
    let leveledUp = false;
    let newLevel = 0;
    
    // If challenge was completed for the first time today
    if (completed) {
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      
      if (user) {
        const lastChallengeDate = user.lastDailyChallengeDate;
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        // Check if user already completed today's challenge
        const alreadyCompletedToday = lastChallengeDate === today;
        
        // Only award XP and update streak if this is the first completion today
        if (!alreadyCompletedToday) {
          let newDailyStreak = 1;
          
          // Check if they completed yesterday's challenge (streak continues)
          if (lastChallengeDate === yesterdayStr) {
            newDailyStreak = (user.currentDailyStreak || 0) + 1;
          }
          
          // Calculate XP with difficulty multiplier
          // Base XP values by game
          const baseXPMap: Record<string, number> = {
            'thermite': 1000,
            'roof-running': 800,
            'laundromat': 700,
            'lockpick': 400,
            'word-memory': 600,
            'pincracker': 500,
            'chopping': 400,
          };
          
          const baseXP = baseXPMap[challenge.game] || challenge.xpReward || 100;
          
          // Calculate difficulty multiplier based on challenge settings vs defaults
          let difficultyMultiplier = 1.0;
          
          switch (challenge.game) {
            case 'thermite': {
              // Default: 24 score, 50s
              const scoreFactor = (challenge.targetScore || 24) / 24;
              const timeFactor = 50 / (challenge.targetTime / 1000);
              difficultyMultiplier = (scoreFactor + timeFactor) / 2;
              break;
            }
            case 'roof-running': {
              // Default: 8x11 = 88 tiles, 27s
              const tileFactor = ((challenge.rows || 8) * (challenge.columns || 11)) / 88;
              const timeFactor = 27 / (challenge.targetTime / 1000);
              difficultyMultiplier = (tileFactor + timeFactor) / 2;
              break;
            }
            case 'laundromat': {
              // Default: 5 levels, 60s
              const levelFactor = (challenge.levels || 5) / 5;
              const timeFactor = 60 / (challenge.targetTime / 1000);
              difficultyMultiplier = (levelFactor + timeFactor) / 2;
              break;
            }
            case 'lockpick': {
              // Default: 4 levels, 80s
              const levelFactor = (challenge.levels || 4) / 4;
              const timeFactor = 80 / (challenge.targetTime / 1000);
              difficultyMultiplier = (levelFactor + timeFactor) / 2;
              break;
            }
            case 'word-memory': {
              // Default: 25 words, 25s
              const wordFactor = (challenge.words || 25) / 25;
              const timeFactor = 25 / (challenge.targetTime / 1000);
              difficultyMultiplier = (wordFactor + timeFactor) / 2;
              break;
            }
            case 'pincracker': {
              // Default: 4 digits, 20s
              const pinFactor = (challenge.pinLength || 4) / 4;
              const timeFactor = 20 / (challenge.targetTime / 1000);
              difficultyMultiplier = (pinFactor + timeFactor) / 2;
              break;
            }
            case 'chopping': {
              // Default: 15 letters, 7s
              const letterFactor = (challenge.numLetters || 15) / 15;
              const timeFactor = 7 / (challenge.targetTime / 1000);
              difficultyMultiplier = (letterFactor + timeFactor) / 2;
              break;
            }
          }
          
          // Apply multiplier and round up to nearest 100, with minimum of base XP
          const rawXP = baseXP * difficultyMultiplier;
          xpEarned = Math.max(baseXP, Math.ceil(rawXP / 100) * 100);
          
          // Calculate old and new level
          const oldXP = user.totalXP || 0;
          const newXP = oldXP + xpEarned;
          
          const calculateLevel = (xp: number): number => {
            if (xp < 25) return 1;
            return Math.floor(Math.cbrt(xp / 25)) + 1;
          };
          
          const oldLevel = calculateLevel(oldXP);
          newLevel = calculateLevel(newXP);
          leveledUp = newLevel > oldLevel;
          
          await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                currentDailyStreak: newDailyStreak,
                lastDailyChallengeDate: today,
                level: newLevel,
                updatedAt: now,
              },
              $max: {
                longestDailyStreak: newDailyStreak,
              },
              $inc: {
                totalXP: xpEarned,
              },
            }
          );
          
          streakUpdated = true;
          newStreak = newDailyStreak;
          
          // Update challenge progress with XP earned
          await db.collection('userChallengeProgress').updateOne(
            {
              userId,
              challengeId: body.challengeId,
            },
            {
              $set: {
                xpEarned,
              },
            }
          );
        }
      }
    }
    
    // Get the actual completed status from the progress document
    // This ensures we return true if the user has ever completed it, even if this attempt failed
    const actualCompletedStatus = progressResult?.completed || false;
    
    return NextResponse.json({
      success: true,
      completed: actualCompletedStatus,
      attempts: progressResult?.attempts || 1,
      bestScore: progressResult?.bestAttempt?.score || body.score,
      xpEarned,
      streakUpdated,
      newStreak,
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
    });

  } catch (error) {
    console.error('Error completing challenge:', error);
    return NextResponse.json(
      { error: 'Failed to complete challenge' },
      { status: 500 }
    );
  }
}

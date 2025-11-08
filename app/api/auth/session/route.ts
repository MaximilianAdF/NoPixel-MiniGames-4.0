import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Session Route
 * GET /api/auth/session
 * Returns current user session with fresh data from database (if authenticated)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Fetch fresh user data from database
    const client = await clientPromise;
    const db = client.db('nopixel');
    
    const user = await db.collection('users').findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Check if streak should be reset (cached per UTC day)
    let currentDailyStreak = user.currentDailyStreak || 0;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Only check streak once per UTC day to avoid unnecessary DB writes
    const lastStreakCheck = user.lastStreakCheck;
    const needsStreakCheck = !lastStreakCheck || lastStreakCheck !== today;
    
    if (needsStreakCheck && currentDailyStreak > 0 && user.lastDailyChallengeDate) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // Reset streak if last challenge was not completed today or yesterday
      if (user.lastDailyChallengeDate !== today && user.lastDailyChallengeDate !== yesterdayStr) {
        currentDailyStreak = 0;
        
        // Update the database to reset the streak and mark today as checked
        await db.collection('users').updateOne(
          { _id: new ObjectId(session.user.id) },
          {
            $set: {
              currentDailyStreak: 0,
              lastStreakCheck: today,
            }
          }
        );
      } else {
        // Streak is still valid, just update the last check date
        await db.collection('users').updateOne(
          { _id: new ObjectId(session.user.id) },
          {
            $set: {
              lastStreakCheck: today,
            }
          }
        );
      }
    }

    // Update session with fresh data
    const updatedUser = {
      id: user._id.toString(),
      discordId: session.user.discordId, // Keep existing Discord ID
      username: user.username,
      discriminator: session.user.discriminator, // Keep existing discriminator
      avatar: user.avatar,
      displayName: user.displayName,
      verified: user.verified || false,
      level: user.level || 1,
      xp: user.totalXP || 0, // Map totalXP to xp for session
      totalXP: user.totalXP || 0,
      currentDailyStreak: currentDailyStreak,
      longestDailyStreak: user.longestDailyStreak || 0,
      preferences: user.preferences,
    };

    // Update the session cookie with fresh data
    await updateSession({ user: updatedUser });

    // Return fresh user data
    return NextResponse.json({
      user: updatedUser,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

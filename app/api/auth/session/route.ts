import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession, createSessionToken, setSessionCookie } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

/**
 * Session Route
 * GET /api/auth/session
 * Returns current user session with fresh data from database (if authenticated)
 * Or creates/retrieves a guest session if x-guest-device-id header is present
 */
export async function GET(request: NextRequest) {
  try {
    let session = await getSession();
    let guestDeviceId = request.headers.get('x-guest-device-id');

    // If no session but we have a guest ID, try to find or create a guest user
    if (!session && guestDeviceId) {
      const client = await clientPromise;
      const db = client.db('nopixel');

      // Try to find existing guest user
      let user = await db.collection('users').findOne({
        guestDeviceId: guestDeviceId,
      });

      // If not found, create new guest user
      if (!user) {
        const now = new Date();
        const guestUser = {
          username: 'Guest',
          discriminator: Math.floor(1000 + Math.random() * 9000).toString(),
          avatar: '', // Default avatar
          guestDeviceId: guestDeviceId,
          verified: false,
          level: 1,
          totalXP: 0,
          totalGamesPlayed: 0,
          totalTimePlayedMs: 0,
          currentDailyStreak: 0,
          longestDailyStreak: 0,
          achievements: [],
          badges: [],
          preferences: {
            volume: 50,
            notifications: true,
            publicProfile: true,
            theme: 'dark',
          },
          createdAt: now,
          updatedAt: now,
          joinedAt: now,
          lastSeenAt: now,
        };

        const result = await db.collection('users').insertOne(guestUser);
        user = { ...guestUser, _id: result.insertedId };
      }

      // Create session for guest
      const sessionPayload = {
        user: {
          id: user._id.toString(),
          username: user.username,
          discriminator: user.discriminator,
          avatar: user.avatar,
          displayName: user.displayName,
          level: user.level || 1,
          xp: user.totalXP || 0,
          currentDailyStreak: user.currentDailyStreak || 0,
          preferences: user.preferences,
        },
        accessToken: 'guest', // Dummy token
        refreshToken: 'guest', // Dummy token
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      };

      const token = await createSessionToken(sessionPayload);
      await setSessionCookie(token);
      
      return NextResponse.json({
        user: {
          ...sessionPayload.user,
          verified: false,
          totalXP: user.totalXP || 0,
          longestDailyStreak: user.longestDailyStreak || 0,
        },
      });
    }

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
      discordId: user.discordId || session.user.discordId, // Handle guest->discord upgrade or existing
      username: user.username,
      discriminator: user.discriminator || session.user.discriminator,
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

import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getDiscordUser, getDiscordAvatarUrl } from '@/lib/auth/discord';
import { createSessionToken, getSession } from '@/lib/auth/session';
import { UserSession } from '@/interfaces/user';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getAuthBaseUrl, safeReturnTo } from '@/lib/auth/config';
import { cookies } from 'next/headers';
import { timingSafeEqual } from 'node:crypto';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

// Redirect base — falls back to the canonical site URL so a missing
// NEXTAUTH_URL env can never turn auth redirects into 500s.
const BASE_URL = getAuthBaseUrl();

/**
 * Discord OAuth Callback Route
 * GET /api/auth/discord/callback
 * Handles the OAuth callback from Discord
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    const expectedState = request.cookies.get('discord_oauth_state')?.value;
    const returnTo = safeReturnTo(request.cookies.get('auth_return_to')?.value);
    cookies().delete('discord_oauth_state');
    cookies().delete('auth_return_to');
    if (!state || !expectedState || !/^[a-f0-9]{64}$/.test(state) || !/^[a-f0-9]{64}$/.test(expectedState) ||
        !timingSafeEqual(Buffer.from(state), Buffer.from(expectedState))) {
      return NextResponse.redirect(`${BASE_URL}/?error=invalid_state`);
    }

    // Check for OAuth errors
    if (error) {
      console.error('Discord OAuth error:', error);
      return NextResponse.redirect(`${BASE_URL}/?error=auth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${BASE_URL}/?error=no_code`);
    }

    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);

    // Get Discord user info
    const discordUser = await getDiscordUser(tokenResponse.access_token);

    // Connect to database
    const client = await clientPromise;
    const db = client.db('nopixel');
    const usersCollection = db.collection('users');

    // Check for existing guest session
    const currentSession = await getSession();
    const isGuest = currentSession && !currentSession.user.discordId &&
      ObjectId.isValid(currentSession.user.id) &&
      await usersCollection.findOne({ _id: new ObjectId(currentSession.user.id), discordId: { $exists: false } });

    // Find existing Discord user
    let user = await usersCollection.findOne({ discordId: discordUser.id });

    const now = new Date();

    if (user) {
      // User with this Discord ID already exists
      
      // If we were logged in as a guest, we could merge stats here
      // For now, we'll just switch to the Discord user, but we could add logic to 
      // transfer XP/Games from the guest account to the main account
      if (isGuest) {
        // Optional: Transfer guest stats to main user
        // await usersCollection.updateOne({ _id: user._id }, { $inc: { totalXP: currentSession.user.xp } });
        // await usersCollection.deleteOne({ _id: new ObjectId(currentSession.user.id) });
      }

      // Update existing user with latest Discord info
      await usersCollection.updateOne(
        { discordId: discordUser.id },
        {
          $set: {
            username: discordUser.username,
            discriminator: discordUser.discriminator,
            avatar: getDiscordAvatarUrl(discordUser.id, discordUser.avatar),
            email: discordUser.email,
            verified: true,
            isGuest: false,
            lastSeenAt: now,
            updatedAt: now,
          },
        }
      );
    } else if (isGuest) {
      // No existing Discord user, but we have a Guest session
      // Upgrade the Guest user to a full User
      const guestUserId = new ObjectId(currentSession!.user.id);
      
      await usersCollection.updateOne(
        { _id: guestUserId },
        {
          $set: {
            discordId: discordUser.id,
            username: discordUser.username, // Overwrite "Guest"
            discriminator: discordUser.discriminator,
            avatar: getDiscordAvatarUrl(discordUser.id, discordUser.avatar),
            email: discordUser.email,
            displayName: discordUser.username, // Set default display name
            verified: true, // Now verified
            isGuest: false,
            updatedAt: now,
            lastSeenAt: now,
          },
          $unset: {
            guestDeviceId: "", // Remove guest ID as they are now registered
          }
        }
      );
      
      // Fetch the updated user
      user = await usersCollection.findOne({ _id: guestUserId });
    } else {
      // No existing Discord user AND no Guest session
      // Create brand new user
      const newUser = {
        discordId: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: getDiscordAvatarUrl(discordUser.id, discordUser.avatar),
        email: discordUser.email,
        
        displayName: discordUser.username,
        verified: true,
        isGuest: false,
        bio: '',
        joinedAt: now,
        lastSeenAt: now,
        
        totalGamesPlayed: 0,
        totalTimePlayedMs: 0,
        totalXP: 0,
        level: 1,
        currentDailyStreak: 0,
        longestDailyStreak: 0,
        
        preferences: {
          volume: 100,
          notifications: true,
          publicProfile: true,
          theme: 'dark',
        },
        
        achievements: [],
        badges: [],
        
        createdAt: now,
        updatedAt: now,
      };

      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    // Use fresh Discord details in the new session, including existing accounts.
    user = await usersCollection.findOne({ discordId: discordUser.id });

    // Ensure user is not null (should satisfy TypeScript)
    if (!user) {
      throw new Error("Failed to find or create user");
    }

    // Create session
    const session: UserSession = {
      user: {
        id: user._id.toString(),
        discordId: user.discordId,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        displayName: user.displayName,
        level: user.level,
        xp: user.totalXP,
        currentDailyStreak: user.currentDailyStreak,
        preferences: user.preferences,
      },
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    // Create and set session cookie
    const token = await createSessionToken(session);
    
    const response = NextResponse.redirect(`${BASE_URL}${returnTo}`);
    
    // Set session cookie manually (since we're in a route handler)
    response.cookies.set('nopixel_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Clear the return URL cookie
    response.cookies.delete('auth_return_to');
    response.cookies.delete('discord_oauth_state');
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Discord callback error:', error);
    return NextResponse.redirect(`${BASE_URL}/?error=callback_failed`);
  }
}

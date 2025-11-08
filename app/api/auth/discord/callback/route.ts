import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getDiscordUser, getDiscordAvatarUrl } from '@/lib/auth/discord';
import { createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { UserSession } from '@/interfaces/user';
import clientPromise from '@/lib/mongodb';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

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

    // Check for OAuth errors
    if (error) {
      console.error('Discord OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=auth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=no_code`);
    }

    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);

    // Get Discord user info
    const discordUser = await getDiscordUser(tokenResponse.access_token);

    // Connect to database
    const client = await clientPromise;
    const db = client.db('nopixel');
    const usersCollection = db.collection('users');

    // Find or create user in database
    let user = await usersCollection.findOne({ discordId: discordUser.id });

    const now = new Date();

    if (!user) {
      // Create new user
      const newUser = {
        discordId: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: getDiscordAvatarUrl(discordUser.id, discordUser.avatar),
        email: discordUser.email,
        
        displayName: discordUser.username,
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
    } else {
      // Update existing user
      await usersCollection.updateOne(
        { discordId: discordUser.id },
        {
          $set: {
            username: discordUser.username,
            discriminator: discordUser.discriminator,
            avatar: getDiscordAvatarUrl(discordUser.id, discordUser.avatar),
            email: discordUser.email,
            lastSeenAt: now,
            updatedAt: now,
          },
        }
      );
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
      expiresAt: Date.now() + tokenResponse.expires_in * 1000,
    };

    // Create and set session cookie
    const token = await createSessionToken(session);
    
    // Get return URL from cookie
    const returnTo = request.cookies.get('auth_return_to')?.value || '/';

    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}${returnTo}`);
    
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

    return response;
  } catch (error) {
    console.error('Discord callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=callback_failed`);
  }
}

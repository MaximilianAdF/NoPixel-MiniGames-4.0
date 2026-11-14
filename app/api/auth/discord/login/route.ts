import { NextRequest, NextResponse } from 'next/server';
import { getDiscordAuthUrl } from '@/lib/auth/discord';
import { getSessionSecret, safeReturnTo } from '@/lib/auth/config';
import { randomBytes } from 'node:crypto';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

/**
 * Discord OAuth Login Route
 * GET /api/auth/discord/login
 * Redirects user to Discord OAuth authorization page
 */
export async function GET(request: NextRequest) {
  try {
    // Get the return URL from query params (where to redirect after login)
    const searchParams = request.nextUrl.searchParams;
    getSessionSecret(); // Fail before leaving the site if sessions cannot be signed.
    const returnTo = safeReturnTo(searchParams.get('returnTo'));
    const state = randomBytes(32).toString('hex');

    // Store return URL in a cookie so we can redirect after callback
    const response = NextResponse.redirect(getDiscordAuthUrl(state));
    response.cookies.set('auth_return_to', returnTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    response.cookies.set('discord_oauth_state', state, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 600, path: '/',
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Discord login error:', error);
    return NextResponse.redirect(new URL('/?error=auth_configuration', request.url));
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDiscordAuthUrl } from '@/lib/auth/discord';

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
    const returnTo = searchParams.get('returnTo') || '/';

    // Store return URL in a cookie so we can redirect after callback
    const response = NextResponse.redirect(getDiscordAuthUrl());
    response.cookies.set('auth_return_to', returnTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Discord login error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Discord login' },
      { status: 500 }
    );
  }
}

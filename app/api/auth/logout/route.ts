import { NextRequest, NextResponse } from 'next/server';
import { clearSession, getSession } from '@/lib/auth/session';
import { revokeDiscordToken } from '@/lib/auth/discord';

/**
 * Logout Route
 * POST /api/auth/logout
 * Clears user session and revokes Discord token
 */
export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getSession();

    if (session) {
      // Revoke Discord token (optional, prevents token reuse)
      try {
        await revokeDiscordToken(session.accessToken);
      } catch (error) {
        console.error('Failed to revoke Discord token:', error);
        // Continue with logout even if revoke fails
      }
    }

    // Clear session cookie
    await clearSession();

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

/**
 * GET variant for convenience (allows <a> tag logout links)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get('returnTo') || '/';

  try {
    const session = await getSession();

    if (session) {
      try {
        await revokeDiscordToken(session.accessToken);
      } catch (error) {
        console.error('Failed to revoke Discord token:', error);
      }
    }

    await clearSession();

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}${returnTo}`);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}${returnTo}?error=logout_failed`);
  }
}

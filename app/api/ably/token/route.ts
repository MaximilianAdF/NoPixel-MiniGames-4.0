import { NextResponse } from 'next/server';
import * as Ably from 'ably';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ably/token
 *
 * Mints a capability-scoped Ably token request for the calling session.
 * The client uses this token (not the root API key) to connect to Ably,
 * scoped to the lobby:* channel namespace used by 1v1.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Ably is not configured' }, { status: 500 });
    }

    const rest = new Ably.Rest({ key: apiKey });
    const tokenRequest = await rest.auth.createTokenRequest({
      clientId: session.user.id,
      capability: { 'lobby:*': ['subscribe', 'publish', 'presence'] },
      ttl: 60 * 60 * 1000,
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error('Failed to create Ably token request:', error);
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
  }
}

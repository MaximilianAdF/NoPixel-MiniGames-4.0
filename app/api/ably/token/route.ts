import { NextResponse, type NextRequest } from 'next/server';
import * as Ably from 'ably';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

const GUEST_ID_PATTERN = /^guest-[a-zA-Z0-9-]{4,40}$/;

/**
 * GET /api/ably/token
 *
 * Mints a capability-scoped Ably token request for the calling session.
 * The client uses this token (not the root API key) to connect to Ably,
 * scoped to the lobby:* channel namespace used by 1v1.
 *
 * Logged-in users get their session.user.id as clientId. Anonymous
 * visitors send their own browser-generated guest id (?clientId=guest-…)
 * which we validate before signing — that prevents anonymous tokens from
 * impersonating real users (whose ids never carry the `guest-` prefix).
 */
export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Ably is not configured' }, { status: 500 });
    }

    const session = await getSession();
    let clientId: string;
    if (session?.user?.id) {
      clientId = session.user.id;
    } else {
      const requested = req.nextUrl.searchParams.get('clientId');
      clientId = requested && GUEST_ID_PATTERN.test(requested)
        ? requested
        : `guest-${crypto.randomUUID().slice(0, 8)}`;
    }

    const rest = new Ably.Rest({ key: apiKey });
    const tokenRequest = await rest.auth.createTokenRequest({
      clientId,
      capability: { 'lobby:*': ['subscribe', 'publish', 'presence'] },
      ttl: 60 * 60 * 1000,
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error('Failed to create Ably token request:', error);
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
  }
}

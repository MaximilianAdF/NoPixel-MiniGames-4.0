import { NextResponse, type NextRequest } from 'next/server';
import * as Ably from 'ably';
import { SignJWT, jwtVerify } from 'jose';
import { getSession } from '@/lib/auth/session';
import { getSessionSecret } from '@/lib/auth/config';
import { isValidLobbyCode } from '@/lib/lobby/code';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';
const GUEST_COOKIE = 'nphacks_lobby_guest';

export async function GET(req: NextRequest) {
  try {
    const channel = req.nextUrl.searchParams.get('channel') || '';
    if (!channel.startsWith('lobby:') || !isValidLobbyCode(channel.slice(6))) {
      return NextResponse.json({ error: 'Invalid lobby channel' }, { status: 400 });
    }
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(`ably:${ip}`, { maxRequests: 60, windowSeconds: 60 }).success) {
      return NextResponse.json({ error: 'Too many connection attempts' }, { status: 429 });
    }
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Multiplayer is not configured on the server' }, { status: 503 });

    const session = await getSession();
    let clientId = session?.user?.id;
    let guestToken: string | undefined;
    if (!clientId) {
      const secret = getSessionSecret();
      const cookie = req.cookies.get(GUEST_COOKIE)?.value;
      if (cookie) {
        try {
          const { payload } = await jwtVerify(cookie, secret, { audience: 'lobby-guest', algorithms: ['HS256'] });
          if (typeof payload.sub === 'string' && /^guest-[a-f0-9-]{36}$/.test(payload.sub)) clientId = payload.sub;
        } catch { /* Issue a new server-authenticated guest identity. */ }
      }
      if (!clientId) {
        clientId = `guest-${crypto.randomUUID()}`;
        guestToken = await new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject(clientId)
          .setAudience('lobby-guest').setIssuedAt().setExpirationTime('7d').sign(secret);
      }
    }
    const rest = new Ably.Rest({ key: apiKey });
    const tokenRequest = await rest.auth.createTokenRequest({
      clientId, capability: { [channel]: ['subscribe', 'publish', 'presence'] }, ttl: 60 * 60 * 1000,
    });
    const response = NextResponse.json(tokenRequest, { headers: { 'Cache-Control': 'private, no-store' } });
    if (guestToken) response.cookies.set(GUEST_COOKIE, guestToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 86400, path: '/',
    });
    return response;
  } catch (error) {
    console.error('Failed to create Ably token request:', error);
    return NextResponse.json({ error: 'Unable to authenticate the multiplayer connection' }, { status: 503 });
  }
}

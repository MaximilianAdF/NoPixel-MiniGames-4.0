import { NextResponse, type NextRequest } from 'next/server';
import { listRecentMatches, recordRecentMatch } from '@/lib/lobby/recentMatches';
import { checkRateLimit } from '@/lib/rateLimit';
import { edgeCache } from '@/lib/cacheHeaders';
import type { GameType } from '@/interfaces/user';

export const dynamic = 'force-dynamic';

const ALLOWED_GAMES: GameType[] = [
  'thermite', 'lockpick', 'laundromat', 'pincracker',
  'roof-running', 'word-memory', 'chopping',
];

const MAX_NAME_LEN = 40;
const MAX_DURATION_MS = 10 * 60 * 1000; // sanity clamp — matches cap at 3min

/**
 * GET /api/lobby/recent-matches
 *
 * Public feed of recently finished 1v1 matches, newest first. Open to
 * anyone — drives the "live activity" strip on /lobby.
 */
export async function GET() {
  try {
    const matches = await listRecentMatches();
    return NextResponse.json({ matches }, { headers: edgeCache(20) });
  } catch (error) {
    console.error('Failed to list recent matches:', error);
    return NextResponse.json({ error: 'Failed to list matches' }, { status: 500 });
  }
}

/**
 * POST /api/lobby/recent-matches
 *
 * Record one finished match. Posted by the match host once the canonical
 * outcome is known. Hosts can be guests, so this isn't auth-gated; instead
 * we validate the shape, clamp the fields, rate-limit by IP, and lean on
 * the collection's 24h TTL. (Full anti-spoofing would require verifying
 * the match against Ably server-side, which isn't worth it here.)
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(`recordMatch:${ip}`, { maxRequests: 20, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json().catch(() => null) as
      | {
          game?: GameType;
          winnerName?: string | null;
          winnerDiscordId?: string;
          winnerAvatarHash?: string;
          opponentName?: string | null;
          durationMs?: number;
        }
      | null;
    if (!body) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    if (!body.game || !ALLOWED_GAMES.includes(body.game)) {
      return NextResponse.json({ error: 'Invalid game' }, { status: 400 });
    }

    const clampName = (n: unknown): string | null =>
      typeof n === 'string' && n.trim() ? n.trim().slice(0, MAX_NAME_LEN) : null;

    const durationMs = Number.isFinite(body.durationMs)
      ? Math.max(0, Math.min(MAX_DURATION_MS, body.durationMs as number))
      : 0;

    await recordRecentMatch({
      game: body.game,
      winnerName: clampName(body.winnerName),
      winnerDiscordId: typeof body.winnerDiscordId === 'string' ? body.winnerDiscordId : undefined,
      winnerAvatarHash: typeof body.winnerAvatarHash === 'string' ? body.winnerAvatarHash : undefined,
      opponentName: clampName(body.opponentName),
      durationMs,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to record match:', error);
    return NextResponse.json({ error: 'Failed to record match' }, { status: 500 });
  }
}

import { NextResponse, type NextRequest } from 'next/server';
import { getLobbyStats, incrementLobbyStat, type LobbyStatEvent } from '@/lib/lobby/stats';
import { checkRateLimit } from '@/lib/rateLimit';
import type { GameType } from '@/interfaces/user';

export const dynamic = 'force-dynamic';

const ALLOWED_GAMES: GameType[] = [
  'thermite', 'lockpick', 'laundromat', 'pincracker',
  'roof-running', 'word-memory', 'chopping',
];

const ALLOWED_EVENTS: LobbyStatEvent[] = [
  'match_started', 'match_completed', 'match_forfeited', 'match_timed_out', 'lobby_created',
  'ghost_recorded', 'ghost_race_started', 'ghost_race_won',
];

/**
 * GET /api/lobby/stats
 *
 * Returns the all-time 1v1 counters (durable, never expires). Source of
 * truth for 1v1 usage, independent of GA4/GTM.
 */
export async function GET() {
  try {
    const stats = await getLobbyStats();
    return NextResponse.json({ stats: stats ?? null });
  } catch (error) {
    console.error('Failed to read lobby stats:', error);
    return NextResponse.json({ error: 'Failed to read stats' }, { status: 500 });
  }
}

/**
 * POST /api/lobby/stats
 *
 * Record one 1v1 stat event. Posted by the match host so each match is
 * counted once (started / completed / forfeited / timed_out / lobby_created).
 * Not auth-gated (hosts can be guests); validated + IP rate-limited instead.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(`lobbyStat:${ip}`, { maxRequests: 40, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json().catch(() => null) as
      | { event?: LobbyStatEvent; game?: GameType }
      | null;
    if (!body || !body.event || !ALLOWED_EVENTS.includes(body.event)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    const game = body.game && ALLOWED_GAMES.includes(body.game) ? body.game : undefined;
    await incrementLobbyStat(body.event, game);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to record lobby stat:', error);
    return NextResponse.json({ error: 'Failed to record stat' }, { status: 500 });
  }
}

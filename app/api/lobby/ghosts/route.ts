import { NextResponse, type NextRequest } from 'next/server';
import {
  listGhosts,
  recordGhost,
  MIN_GHOST_INPUTS,
  MAX_GHOST_INPUTS,
  type RecordedInput,
} from '@/lib/lobby/ghosts';
import { checkRateLimit } from '@/lib/rateLimit';
import { incrementLobbyStat } from '@/lib/lobby/stats';
import type { GameType } from '@/interfaces/user';

export const dynamic = 'force-dynamic';

const ALLOWED_GAMES: GameType[] = [
  'thermite', 'lockpick', 'laundromat', 'pincracker',
  'roof-running', 'word-memory', 'chopping',
];

const MAX_NAME_LEN = 40;
const MATCH_MAX_MS = 3 * 60 * 1000;

/**
 * GET /api/lobby/ghosts?game=thermite&sort=fast|new&limit=10&exclude=<clientId>
 *
 * Raceable ghost runs for a game, newest/fastest first. Summary only — never
 * ships the input streams. Open to anyone.
 */
export async function GET(req: NextRequest) {
  try {
    const game = req.nextUrl.searchParams.get('game') as GameType | null;
    if (!game || !ALLOWED_GAMES.includes(game)) {
      return NextResponse.json({ error: 'Invalid game' }, { status: 400 });
    }
    const sortParam = req.nextUrl.searchParams.get('sort');
    const sort = sortParam === 'new' ? 'new' : 'fast';
    const limitRaw = Number(req.nextUrl.searchParams.get('limit'));
    const limit = Number.isFinite(limitRaw) ? limitRaw : 10;
    const excludeClientId = req.nextUrl.searchParams.get('exclude') || undefined;

    const ghosts = await listGhosts(game, { sort, limit, excludeClientId });
    return NextResponse.json({ ghosts });
  } catch (error) {
    console.error('Failed to list ghosts:', error);
    return NextResponse.json({ error: 'Failed to list ghosts' }, { status: 500 });
  }
}

/**
 * POST /api/lobby/ghosts
 *
 * Record a winning run as a ghost. Posted by the WINNER's client (it holds the
 * accurately-timed input stream). Winner-only, completed-only, sane move count
 * — enforced both here and by the caller. Not auth-gated (players can be
 * guests); validated, clamped, IP rate-limited, 30-day TTL.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(`recordGhost:${ip}`, { maxRequests: 20, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json().catch(() => null) as
      | {
          game?: GameType;
          seed?: number;
          inputs?: RecordedInput[];
          result?: { won?: boolean; score?: number; elapsedMs?: number };
          recorderName?: string;
          recorderDiscordId?: string;
          recorderAvatarHash?: string;
          recorderClientId?: string;
        }
      | null;
    if (!body) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    // Game + seed.
    if (!body.game || !ALLOWED_GAMES.includes(body.game)) {
      return NextResponse.json({ error: 'Invalid game' }, { status: 400 });
    }
    if (!Number.isFinite(body.seed)) {
      return NextResponse.json({ error: 'Invalid seed' }, { status: 400 });
    }

    // Result must be a genuine completed win.
    const r = body.result;
    if (!r || r.won !== true) {
      return NextResponse.json({ error: 'Only winning runs are stored' }, { status: 400 });
    }
    if (!Number.isFinite(r.score) || !Number.isFinite(r.elapsedMs)) {
      return NextResponse.json({ error: 'Invalid result' }, { status: 400 });
    }
    const elapsedMs = Math.max(0, Math.min(MATCH_MAX_MS, r.elapsedMs as number));

    // Inputs: array, sane length, each { t finite >= 0, input defined }.
    const inputs = body.inputs;
    if (!Array.isArray(inputs) || inputs.length < MIN_GHOST_INPUTS) {
      return NextResponse.json({ error: 'Too few inputs' }, { status: 400 });
    }
    if (inputs.length > MAX_GHOST_INPUTS) {
      return NextResponse.json({ error: 'Too many inputs' }, { status: 400 });
    }
    for (const it of inputs) {
      if (!it || typeof it !== 'object' || !Number.isFinite(it.t) || (it.t as number) < 0 || it.input === undefined) {
        return NextResponse.json({ error: 'Malformed input' }, { status: 400 });
      }
    }

    const recorderClientId = typeof body.recorderClientId === 'string' ? body.recorderClientId.slice(0, 64) : '';
    if (!recorderClientId) {
      return NextResponse.json({ error: 'Missing recorder' }, { status: 400 });
    }
    const recorderName = typeof body.recorderName === 'string' && body.recorderName.trim()
      ? body.recorderName.trim().slice(0, MAX_NAME_LEN)
      : 'Player';

    await recordGhost({
      game: body.game,
      seed: body.seed as number,
      inputs: inputs.map((it) => ({ t: it.t as number, input: it.input })),
      result: { won: true, score: r.score as number, elapsedMs },
      recorderName,
      recorderDiscordId: typeof body.recorderDiscordId === 'string' ? body.recorderDiscordId : undefined,
      recorderAvatarHash: typeof body.recorderAvatarHash === 'string' ? body.recorderAvatarHash : undefined,
      recorderClientId,
      source: 'match',
    });

    // Durable counter (GA4-independent). Best-effort — a missed tick doesn't
    // affect the ghost itself.
    void incrementLobbyStat('ghost_recorded', body.game).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to record ghost:', error);
    return NextResponse.json({ error: 'Failed to record ghost' }, { status: 500 });
  }
}

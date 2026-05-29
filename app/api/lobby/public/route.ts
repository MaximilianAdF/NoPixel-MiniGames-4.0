import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { isValidLobbyCode } from '@/lib/lobby/code';
import { listJoinablePublicLobbies, upsertPublicLobby } from '@/lib/lobby/publicLobbies';
import { checkRateLimit } from '@/lib/rateLimit';
import type { GameType } from '@/interfaces/user';

export const dynamic = 'force-dynamic';

const ALLOWED_GAMES: GameType[] = [
  'thermite', 'lockpick', 'laundromat', 'pincracker',
  'roof-running', 'word-memory', 'chopping',
];

/**
 * GET /api/lobby/public
 *
 * Returns the current list of joinable public lobbies (playerCount < 2,
 * not expired). Open to anyone — anonymous visitors can browse the list
 * and join a lobby without an account.
 */
export async function GET() {
  try {
    const lobbies = await listJoinablePublicLobbies();
    return NextResponse.json({ lobbies });
  } catch (error) {
    console.error('Failed to list public lobbies:', error);
    return NextResponse.json({ error: 'Failed to list lobbies' }, { status: 500 });
  }
}

/**
 * POST /api/lobby/public
 *
 * Host heartbeat — register or extend a public lobby entry. The TTL is
 * 90s from the latest heartbeat, so a host that's actively pinging keeps
 * the entry alive; once they stop (closed tab, marked private), Mongo
 * sweeps it within the window.
 *
 * Only authenticated users can publish — keeps guests from spamming the
 * listing and gives the host a stable identity for the avatar/name.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required to publish a lobby' }, { status: 401 });
    }

    // Throttle: ~12 heartbeats / minute per user (heartbeat interval is
    // 30s so this allows for retries without spam).
    const rl = checkRateLimit(`publishLobby:${session.user.id}`, { maxRequests: 12, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many heartbeats' }, { status: 429 });
    }

    const body = await req.json().catch(() => null) as
      | { code?: string; playerCount?: number; suggestedGame?: GameType | null }
      | null;
    if (!body) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const code = typeof body.code === 'string' ? body.code.toUpperCase() : '';
    if (!isValidLobbyCode(code)) {
      return NextResponse.json({ error: 'Invalid lobby code' }, { status: 400 });
    }

    const playerCount = Number.isInteger(body.playerCount)
      ? Math.max(0, Math.min(2, body.playerCount as number))
      : 1;

    const suggestedGame = body.suggestedGame && ALLOWED_GAMES.includes(body.suggestedGame)
      ? body.suggestedGame
      : undefined;

    await upsertPublicLobby({
      code,
      hostClientId: session.user.id,
      hostName: session.user.displayName ?? session.user.username ?? 'Player',
      hostDiscordId: session.user.discordId,
      hostAvatarHash: session.user.avatar,
      playerCount,
      suggestedGame,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to publish lobby:', error);
    return NextResponse.json({ error: 'Failed to publish lobby' }, { status: 500 });
  }
}

import { Collection, Db } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import type { GameType } from '@/interfaces/user';

// Recent finished 1v1 matches, surfaced as a live "feed" on /lobby so the
// page feels active even before you've joined anything. Entries self-expire
// via a TTL index so the feed always reflects the last day of activity and
// never needs manual pruning.
export const RECENT_MATCH_TTL_MS = 24 * 60 * 60 * 1000; // 24h

// Cap how many we ever hand back to the client — the feed only cycles a
// handful at a time, no need to ship more.
export const RECENT_MATCH_LIMIT = 20;

export interface RecentMatchDoc {
  game: GameType;
  // Winner is null for a draw / mutual timeout.
  winnerName: string | null;
  winnerDiscordId?: string;
  winnerAvatarHash?: string;
  opponentName: string | null;
  durationMs: number;
  endedAt: Date;
  expiresAt: Date;
}

let indexEnsured = false;

async function getCollection(): Promise<Collection<RecentMatchDoc>> {
  const client = await clientPromise;
  const db: Db = client.db();
  const col = db.collection<RecentMatchDoc>('recentMatches');
  if (!indexEnsured) {
    // TTL reaper drops entries once expiresAt passes.
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    // Newest-first reads.
    await col.createIndex({ endedAt: -1 });
    indexEnsured = true;
  }
  return col;
}

export async function recordRecentMatch(input: {
  game: GameType;
  winnerName: string | null;
  winnerDiscordId?: string;
  winnerAvatarHash?: string;
  opponentName: string | null;
  durationMs: number;
}): Promise<void> {
  const col = await getCollection();
  const now = new Date();
  await col.insertOne({
    game: input.game,
    winnerName: input.winnerName,
    winnerDiscordId: input.winnerDiscordId,
    winnerAvatarHash: input.winnerAvatarHash,
    opponentName: input.opponentName,
    durationMs: input.durationMs,
    endedAt: now,
    expiresAt: new Date(now.getTime() + RECENT_MATCH_TTL_MS),
  });
}

export async function listRecentMatches(
  limit = RECENT_MATCH_LIMIT,
): Promise<RecentMatchDoc[]> {
  const col = await getCollection();
  return col
    .find({ expiresAt: { $gt: new Date() } })
    .sort({ endedAt: -1 })
    .limit(limit)
    .project<RecentMatchDoc>({ _id: 0 })
    .toArray();
}

import { Collection, Db } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import type { GameType } from '@/interfaces/user';

// Durable, all-time 1v1 counters — the source of truth for "is anyone
// playing 1v1", independent of GA4/GTM (which currently doesn't forward
// our custom events). Mirrors the `gamePopularity` pattern the single-
// player games use: one aggregate doc, atomic $inc, never expires.
//
// Counters live in a single document so a read is one findOne and an
// increment is one updateOne. Per-game breakdown is nested under `byGame`.

export type LobbyStatEvent =
  | 'match_started'
  | 'match_completed'
  | 'match_forfeited'
  | 'match_timed_out'
  | 'lobby_created'
  // Async ghost mode (see docs/async-ghost-spec.md).
  | 'ghost_recorded'
  | 'ghost_race_started'
  | 'ghost_race_won';

const STAT_DOC_ID = 'global';

export interface LobbyStatsDoc {
  _id: string;
  matchesStarted: number;
  matchesCompleted: number;
  matchesForfeited: number;
  matchesTimedOut: number;
  lobbiesCreated: number;
  // Async ghost counters.
  ghostsRecorded: number;
  ghostRacesStarted: number;
  ghostRacesWon: number;
  // Per-game start/complete tallies, keyed by GameType.
  byGame: Record<string, { started: number; completed: number }>;
  firstEventAt: Date;
  lastEventAt: Date;
}

// Maps an event to the top-level counter field it bumps.
const FIELD_FOR_EVENT: Record<LobbyStatEvent, keyof LobbyStatsDoc> = {
  match_started: 'matchesStarted',
  match_completed: 'matchesCompleted',
  match_forfeited: 'matchesForfeited',
  match_timed_out: 'matchesTimedOut',
  lobby_created: 'lobbiesCreated',
  ghost_recorded: 'ghostsRecorded',
  ghost_race_started: 'ghostRacesStarted',
  ghost_race_won: 'ghostRacesWon',
};

let indexEnsured = false;

async function getCollection(): Promise<Collection<LobbyStatsDoc>> {
  const client = await clientPromise;
  const db: Db = client.db('nopixel');
  const col = db.collection<LobbyStatsDoc>('lobbyStats');
  if (!indexEnsured) {
    await col.createIndex({ _id: 1 });
    indexEnsured = true;
  }
  return col;
}

export async function incrementLobbyStat(
  event: LobbyStatEvent,
  game?: GameType,
): Promise<void> {
  const col = await getCollection();
  const now = new Date();

  const inc: Record<string, number> = { [FIELD_FOR_EVENT[event]]: 1 };
  // Track per-game starts/completes so we can see which games people
  // actually fight on (not just the global totals).
  if (game && event === 'match_started') inc[`byGame.${game}.started`] = 1;
  if (game && event === 'match_completed') inc[`byGame.${game}.completed`] = 1;

  await col.updateOne(
    { _id: STAT_DOC_ID },
    {
      $inc: inc,
      $set: { lastEventAt: now },
      $setOnInsert: { firstEventAt: now },
    },
    { upsert: true },
  );
}

export async function getLobbyStats(): Promise<LobbyStatsDoc | null> {
  const col = await getCollection();
  return col.findOne({ _id: STAT_DOC_ID });
}

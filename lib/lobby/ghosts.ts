import { Collection, Db, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import type { GameType } from '@/interfaces/user';

// Async "ghost" runs — recorded winning runs that solo players can race
// against so 1v1 is never empty. See docs/async-ghost-spec.md.
//
// A ghost is the winner's own input stream, timestamped per input so it can
// be replayed at its original cadence (Phase 2). Only genuine completed wins
// with a sane move count are harvested (see recordGhost callers / the API
// route validation).

export const GHOST_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Bounds on a recorded run's input count. Floor rejects degenerate/instant
// "wins"; ceiling caps payload size. Per-game tuning is a later refinement.
export const MIN_GHOST_INPUTS = 2;
export const MAX_GHOST_INPUTS = 5000;

// One timestamped engine input. `t` is ms since match start; `input` is the
// opaque per-game engine input (same shape streamed over match:input).
export interface RecordedInput {
  t: number;
  input: unknown;
}

export interface GhostResult {
  won: boolean;
  score: number;
  elapsedMs: number;
}

export interface GhostDoc {
  _id: ObjectId;
  game: GameType;
  seed: number;
  inputs: RecordedInput[];
  result: GhostResult;
  recorderName: string;
  recorderDiscordId?: string;
  recorderAvatarHash?: string;
  recorderClientId: string;
  source: 'match' | 'solo';
  createdAt: Date;
  expiresAt: Date;
  timesRaced: number;
  timesBeaten: number;
}

// Summary shape returned by list endpoints — never ships `inputs` (heavy).
export type GhostSummary = Omit<GhostDoc, 'inputs' | '_id'> & { id: string };

let indexEnsured = false;

async function getCollection(): Promise<Collection<GhostDoc>> {
  const client = await clientPromise;
  const db: Db = client.db('nopixel');
  const col = db.collection<GhostDoc>('ghosts');
  if (!indexEnsured) {
    // TTL reaper drops ghosts after GHOST_TTL_MS.
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    // "Fastest ghost per game" and "newest ghost per game".
    await col.createIndex({ game: 1, 'result.elapsedMs': 1 });
    await col.createIndex({ game: 1, createdAt: -1 });
    indexEnsured = true;
  }
  return col;
}

export async function recordGhost(input: {
  game: GameType;
  seed: number;
  inputs: RecordedInput[];
  result: GhostResult;
  recorderName: string;
  recorderDiscordId?: string;
  recorderAvatarHash?: string;
  recorderClientId: string;
  source: 'match' | 'solo';
}): Promise<void> {
  const col = await getCollection();
  const now = new Date();
  await col.insertOne({
    _id: new ObjectId(),
    game: input.game,
    seed: input.seed,
    inputs: input.inputs,
    result: input.result,
    recorderName: input.recorderName,
    recorderDiscordId: input.recorderDiscordId,
    recorderAvatarHash: input.recorderAvatarHash,
    recorderClientId: input.recorderClientId,
    source: input.source,
    createdAt: now,
    expiresAt: new Date(now.getTime() + GHOST_TTL_MS),
    timesRaced: 0,
    timesBeaten: 0,
  });
}

function toSummary(doc: GhostDoc): GhostSummary {
  const { _id, inputs, ...rest } = doc;
  void inputs;
  return { id: _id.toString(), ...rest };
}

// List raceable ghosts for a game, summary only (no inputs).
// `excludeClientId` filters out the caller's own ghosts (don't race yourself).
export async function listGhosts(
  game: GameType,
  opts: { sort?: 'fast' | 'new'; limit?: number; excludeClientId?: string } = {},
): Promise<GhostSummary[]> {
  const col = await getCollection();
  const { sort = 'fast', limit = 10, excludeClientId } = opts;
  const query: Record<string, unknown> = {
    game,
    expiresAt: { $gt: new Date() },
  };
  if (excludeClientId) query.recorderClientId = { $ne: excludeClientId };
  const docs = await col
    .find(query)
    .sort(sort === 'fast' ? { 'result.elapsedMs': 1 } : { createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 50))
    .toArray();
  return docs.map(toSummary);
}

// Full ghost incl. inputs — fetched only when a race actually starts.
export async function getGhost(id: string): Promise<GhostDoc | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await getCollection();
  return col.findOne({ _id: new ObjectId(id) });
}

export async function incrementGhostRaced(id: string, beaten: boolean): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await getCollection();
  await col.updateOne(
    { _id: new ObjectId(id) },
    { $inc: { timesRaced: 1, ...(beaten ? { timesBeaten: 1 } : {}) } },
  );
}

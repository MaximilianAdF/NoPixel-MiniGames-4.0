import { Collection, Db } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import type { GameType } from '@/interfaces/user';

// How long a lobby stays listed after the host's last heartbeat. The host
// pings on a shorter interval (see HEARTBEAT_MS in LobbyClient), so as long
// as the host's tab is open and the lobby is public the entry stays alive;
// once the heartbeats stop (host closes tab, marks private), Mongo's TTL
// reaper drops the entry within this window.
export const PUBLIC_LOBBY_TTL_MS = 90_000;

export interface PublicLobbyDoc {
  code: string;
  hostClientId: string;
  hostName: string;
  hostDiscordId?: string;
  hostAvatarHash?: string;
  playerCount: number;
  suggestedGame?: GameType;
  createdAt: Date;
  expiresAt: Date;
}

let indexEnsured = false;

async function getCollection(): Promise<Collection<PublicLobbyDoc>> {
  const client = await clientPromise;
  const db: Db = client.db();
  const col = db.collection<PublicLobbyDoc>('publicLobbies');
  if (!indexEnsured) {
    // Idempotent: createIndex no-ops if the index already exists with the
    // same options. TTL reaper runs ~once a minute.
    await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await col.createIndex({ code: 1 }, { unique: true });
    indexEnsured = true;
  }
  return col;
}

export async function upsertPublicLobby(input: {
  code: string;
  hostClientId: string;
  hostName: string;
  hostDiscordId?: string;
  hostAvatarHash?: string;
  playerCount: number;
  suggestedGame?: GameType;
}): Promise<void> {
  const col = await getCollection();
  const now = new Date();
  await col.updateOne(
    { code: input.code },
    {
      $set: {
        hostClientId: input.hostClientId,
        hostName: input.hostName,
        hostDiscordId: input.hostDiscordId,
        hostAvatarHash: input.hostAvatarHash,
        playerCount: input.playerCount,
        suggestedGame: input.suggestedGame,
        expiresAt: new Date(now.getTime() + PUBLIC_LOBBY_TTL_MS),
      },
      $setOnInsert: {
        code: input.code,
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export async function deletePublicLobby(code: string, hostClientId: string): Promise<boolean> {
  const col = await getCollection();
  // Only the original host can delete — prevents a malicious join from
  // unlisting someone else's lobby.
  const result = await col.deleteOne({ code, hostClientId });
  return result.deletedCount > 0;
}

export async function listJoinablePublicLobbies(limit = 50): Promise<PublicLobbyDoc[]> {
  const col = await getCollection();
  // Only return lobbies with room for a second player; full ones (2/2) and
  // expired ones (TTL handled by Mongo) shouldn't show up.
  return col
    .find({ playerCount: { $lt: 2 }, expiresAt: { $gt: new Date() } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .project<PublicLobbyDoc>({ _id: 0 })
    .toArray();
}

// One-shot guest cleanup. Mirrors /api/admin/cleanup-guests filter logic exactly.
// Use this for the initial backlog purge; the Vercel Cron handles ongoing daily runs.
//
// Usage:
//   node scripts/one-shot-cleanup-guests.mjs           # live delete
//   node scripts/one-shot-cleanup-guests.mjs --dry     # dry run, prints counts only
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

const isDry = process.argv.includes('--dry');

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const client = new MongoClient(env.MONGODB_URI);
await client.connect();
const users = client.db('nopixel').collection('users');

const now = Date.now();
const neverPlayedCutoff = new Date(now - 30 * 24 * 60 * 60 * 1000);
const playedCutoff = new Date(now - 90 * 24 * 60 * 60 * 1000);

const neverPlayedFilter = {
  isGuest: true,
  $or: [{ discordId: { $exists: false } }, { discordId: null }],
  $and: [{ $or: [{ totalGamesPlayed: 0 }, { totalGamesPlayed: { $exists: false } }] }],
  $expr: { $lt: [{ $ifNull: ['$lastSeenAt', '$createdAt'] }, neverPlayedCutoff] },
};
const inactivePlayedFilter = {
  isGuest: true,
  $or: [{ discordId: { $exists: false } }, { discordId: null }],
  totalGamesPlayed: { $gt: 0 },
  $expr: { $lt: [{ $ifNull: ['$lastSeenAt', '$createdAt'] }, playedCutoff] },
};

// Final safety check: no Discord users in either set
const dGuard1 = await users.countDocuments({ ...neverPlayedFilter, discordId: { $exists: true, $ne: null } });
const dGuard2 = await users.countDocuments({ ...inactivePlayedFilter, discordId: { $exists: true, $ne: null } });
if (dGuard1 !== 0 || dGuard2 !== 0) {
  console.error('ABORT: Discord-linked users matched the filter. Investigate before proceeding.');
  console.error({ neverPlayedWithDiscord: dGuard1, playedWithDiscord: dGuard2 });
  await client.close();
  process.exit(1);
}

const before = await users.countDocuments({});

if (isDry) {
  const neverPlayedCount = await users.countDocuments(neverPlayedFilter);
  const inactiveCount = await users.countDocuments(inactivePlayedFilter);
  console.log(JSON.stringify({
    mode: 'dry_run',
    totalUsersBefore: before,
    wouldDeleteNeverPlayed: neverPlayedCount,
    wouldDeleteInactivePlayed: inactiveCount,
    wouldDeleteTotal: neverPlayedCount + inactiveCount,
  }, null, 2));
} else {
  console.log(`Deleting from ${before} total users...`);
  const t0 = Date.now();
  const [r1, r2] = await Promise.all([
    users.deleteMany(neverPlayedFilter),
    users.deleteMany(inactivePlayedFilter),
  ]);
  const elapsedMs = Date.now() - t0;
  const after = await users.countDocuments({});
  console.log(JSON.stringify({
    mode: 'live',
    elapsedMs,
    deletedNeverPlayed: r1.deletedCount,
    deletedInactivePlayed: r2.deletedCount,
    deletedTotal: r1.deletedCount + r2.deletedCount,
    totalUsersBefore: before,
    totalUsersAfter: after,
    delta: before - after,
  }, null, 2));
}

await client.close();

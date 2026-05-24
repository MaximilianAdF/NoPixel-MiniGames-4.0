// One-off verification script. Reads MONGODB_URI from .env.local.
// Run: node scripts/verify-cleanup-safety.mjs
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

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

// Critical check: does the filter accidentally match anything with a discordId?
const anyDiscordInNeverPlayed = await users.countDocuments({
  ...neverPlayedFilter,
  discordId: { $exists: true, $ne: null },
});
const anyDiscordInPlayed = await users.countDocuments({
  ...inactivePlayedFilter,
  discordId: { $exists: true, $ne: null },
});

const neverPlayedTotal = await users.countDocuments(neverPlayedFilter);
const inactivePlayedTotal = await users.countDocuments(inactivePlayedFilter);

console.log('=== Filter safety check ===');
console.log(JSON.stringify({
  neverPlayedTotal,
  inactivePlayedTotal,
  combined: neverPlayedTotal + inactivePlayedTotal,
  anyDiscordInNeverPlayed,
  anyDiscordInPlayed,
  safeToProceed: anyDiscordInNeverPlayed === 0 && anyDiscordInPlayed === 0,
}, null, 2));

console.log('\n=== Sample of what would be deleted (never-played) ===');
console.log(JSON.stringify(
  await users.find(neverPlayedFilter).limit(3)
    .project({ username: 1, isGuest: 1, discordId: 1, lastSeenAt: 1, createdAt: 1, totalGamesPlayed: 1 })
    .toArray(),
  null, 2,
));

console.log('\n=== Sample of what would be deleted (inactive played) ===');
console.log(JSON.stringify(
  await users.find(inactivePlayedFilter).limit(3)
    .project({ username: 1, isGuest: 1, discordId: 1, lastSeenAt: 1, createdAt: 1, totalGamesPlayed: 1, totalXP: 1 })
    .toArray(),
  null, 2,
));

await client.close();

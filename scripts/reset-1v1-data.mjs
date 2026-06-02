/**
 * One-shot: clear all 1v1 runtime data so production launches clean.
 *
 * Wipes the ephemeral 1v1 collections:
 *   - publicLobbies  (the open-lobby browser listings)
 *   - recentMatches  (the /lobby activity feed)
 *   - ghosts         (recorded async-race runs)
 *
 * All are self-expiring (TTL) at runtime, so this is only needed to clear
 * accumulated dev/test rows before a deploy. It does NOT touch users,
 * lobbyStats (the cumulative counter), challenges, or anything persistent.
 *
 * Dry-run by default (just reports counts). Pass --apply to actually delete:
 *   node scripts/reset-1v1-data.mjs            # preview
 *   node scripts/reset-1v1-data.mjs --apply    # delete
 */
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

// Read MONGODB_URI from .env.local (same approach as the other one-shot
// scripts; avoids a dotenv dependency).
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const uri = env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

const DRY_RUN = !process.argv.includes('--apply');
const COLLECTIONS = ['publicLobbies', 'recentMatches', 'ghosts'];

const client = new MongoClient(uri);

async function main() {
  await client.connect();
  // Default DB from the connection string — the same db the 1v1 libs use
  // (lib/lobby/publicLobbies.ts + recentMatches.ts call client.db()).
  const db = client.db();

  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'APPLY (deleting)'}`);
  console.log(`Database: ${db.databaseName}\n`);

  for (const name of COLLECTIONS) {
    const col = db.collection(name);
    const count = await col.countDocuments();
    if (DRY_RUN) {
      console.log(`  ${name}: ${count} document(s) would be deleted`);
    } else {
      const res = await col.deleteMany({});
      console.log(`  ${name}: deleted ${res.deletedCount} document(s)`);
    }
  }

  if (DRY_RUN) {
    console.log('\nNothing changed. Re-run with --apply to delete.');
  } else {
    console.log('\n1v1 runtime data cleared.');
  }
}

main()
  .catch((err) => {
    console.error('Reset failed:', err);
    process.exitCode = 1;
  })
  .finally(() => client.close());

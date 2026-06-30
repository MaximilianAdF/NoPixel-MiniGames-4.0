import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NEVER_PLAYED_THRESHOLD_DAYS = 30;
const PLAYED_THRESHOLD_DAYS = 90;

/**
 * GET /api/admin/cleanup-guests
 *
 * Deletes stale guest users. Mirrors the threshold logic shown in the session
 * route's daysUntilCleanup warning:
 *   - never played a game: removed after 30 days of inactivity
 *   - has played at least 1 game: removed after 90 days of inactivity
 *
 * Auth: the host cron job sends `Authorization: Bearer ${CRON_SECRET}` (set
 * via the CRON_SECRET env var). Manual admin runs use the same header.
 *
 * Query params:
 *   ?dry_run=1  → return counts of what would be deleted without deleting
 */
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET
    ? `Bearer ${process.env.CRON_SECRET}`
    : null;
  const authHeader = request.headers.get('authorization');
  if (!expected || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get('dry_run') === '1';

  try {
    const client = await clientPromise;
    const db = client.db('nopixel');
    const users = db.collection('users');

    const now = Date.now();
    const neverPlayedCutoff = new Date(now - NEVER_PLAYED_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);
    const playedCutoff = new Date(now - PLAYED_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);

    // SAFETY: never touch a doc that has a linked discordId, even if it's mis-tagged
    // isGuest:true (177 such records exist due to a stale-flag bug in the OAuth upgrade flow).
    // Fall back to createdAt if lastSeenAt isn't present (legacy guests).
    // $expr lets us use $ifNull inside a query.
    const neverPlayedFilter = {
      isGuest: true,
      $or: [{ discordId: { $exists: false } }, { discordId: null }],
      $and: [
        {
          $or: [{ totalGamesPlayed: 0 }, { totalGamesPlayed: { $exists: false } }],
        },
      ],
      $expr: {
        $lt: [{ $ifNull: ['$lastSeenAt', '$createdAt'] }, neverPlayedCutoff],
      },
    };

    const inactivePlayedFilter = {
      isGuest: true,
      $or: [{ discordId: { $exists: false } }, { discordId: null }],
      totalGamesPlayed: { $gt: 0 },
      $expr: {
        $lt: [{ $ifNull: ['$lastSeenAt', '$createdAt'] }, playedCutoff],
      },
    };

    if (dryRun) {
      const [neverPlayedCount, inactiveCount] = await Promise.all([
        users.countDocuments(neverPlayedFilter),
        users.countDocuments(inactivePlayedFilter),
      ]);
      return NextResponse.json({
        ok: true,
        dryRun: true,
        wouldDeleteNeverPlayed: neverPlayedCount,
        wouldDeleteInactivePlayed: inactiveCount,
        neverPlayedCutoff: neverPlayedCutoff.toISOString(),
        playedCutoff: playedCutoff.toISOString(),
      });
    }

    const [neverPlayedResult, inactiveResult] = await Promise.all([
      users.deleteMany(neverPlayedFilter),
      users.deleteMany(inactivePlayedFilter),
    ]);

    return NextResponse.json({
      ok: true,
      deletedNeverPlayed: neverPlayedResult.deletedCount,
      deletedInactivePlayed: inactiveResult.deletedCount,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Guest cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}

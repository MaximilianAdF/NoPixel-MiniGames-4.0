import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 * Uptime-monitor endpoint: 200 when the app and database are reachable,
 * 503 when the database ping fails (so monitors catch partial outages like
 * a dead DB or broken env, not just a downed server).
 */
export async function GET() {
  try {
    const client = await Promise.race([
      clientPromise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('db timeout')), 5000)),
    ]);
    await client.db('nopixel').command({ ping: 1 });
    return NextResponse.json({ ok: true, db: 'up' });
  } catch {
    return NextResponse.json({ ok: false, db: 'down' }, { status: 503 });
  }
}

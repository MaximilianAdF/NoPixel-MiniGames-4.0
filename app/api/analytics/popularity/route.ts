import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

/**
 * GET /api/analytics/popularity
 * Get game popularity statistics
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('nopixel');

    // Get all game popularity data
    const popularityData = await db.collection('gamePopularity')
      .find({})
      .sort({ 'events.start': -1 })
      .toArray();

    // Transform to simple format
    const popularity: Record<string, any> = {};
    
    for (const item of popularityData) {
      popularity[item.game] = {
        starts: item.events?.start || 0,
        completions: item.events?.complete || 0,
        failures: item.events?.fail || 0,
        quits: item.events?.quit || 0,
        totalEvents: item.totalEvents || 0,
        lastEventAt: item.lastEventAt,
        completionRate: item.events?.start > 0 
          ? Math.round((item.events?.complete || 0) / item.events.start * 100) 
          : 0,
      };
    }

    return NextResponse.json(popularity);
  } catch (error) {
    console.error('Analytics popularity error:', error);
    return NextResponse.json(
      { error: 'Failed to get popularity data' },
      { status: 500 }
    );
  }
}

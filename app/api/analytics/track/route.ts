import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

/**
 * POST /api/analytics/track
 * Track game events (start, complete, fail, quit)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { game, event, score, timeMs, difficulty, userId, timestamp, userAgent, viewport } = body;

    // Validate required fields
    if (!game || !event || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: game, event, timestamp' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('nopixel');

    // Store the event
    await db.collection('analyticsEvents').insertOne({
      game,
      event,
      score,
      timeMs,
      difficulty,
      userId,
      timestamp: new Date(timestamp),
      userAgent,
      viewport,
      createdAt: new Date(),
    });

    // Update game popularity counter
    await db.collection('gamePopularity').updateOne(
      { game },
      {
        $inc: {
          [`events.${event}`]: 1,
          totalEvents: 1,
        },
        $set: {
          lastEventAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

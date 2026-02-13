import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/cleanup-guests
 * 
 * Deletes stale guest accounts based on inactivity thresholds:
 * - 0 games played: deleted after 30 days of inactivity
 * - Has game history: deleted after 90 days of inactivity
 * 
 * Protected by CLEANUP_SECRET environment variable.
 */
export async function POST(request: NextRequest) {
    try {
        // Verify secret key
        const { secret } = await request.json();
        const expectedSecret = process.env.CLEANUP_SECRET;

        if (!expectedSecret || secret !== expectedSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('nopixel');
        const now = new Date();

        // Threshold 1: Guests with 0 games, inactive > 30 days
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const inactiveNoGames = await db.collection('users').find({
            discordId: { $exists: false },
            totalGamesPlayed: { $in: [0, null] },
            lastSeenAt: { $lt: thirtyDaysAgo },
        }).toArray();

        // Threshold 2: Guests with games, inactive > 90 days
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const inactiveWithGames = await db.collection('users').find({
            discordId: { $exists: false },
            totalGamesPlayed: { $gt: 0 },
            lastSeenAt: { $lt: ninetyDaysAgo },
        }).toArray();

        const allStaleGuests = [...inactiveNoGames, ...inactiveWithGames];
        const staleUserIds = allStaleGuests.map(u => u._id.toString());

        if (staleUserIds.length === 0) {
            return NextResponse.json({
                message: 'No stale guest accounts found',
                deleted: 0,
            });
        }

        // Delete associated game stats
        const statsResult = await db.collection('gameStats').deleteMany({
            userId: { $in: staleUserIds },
        });

        // Delete the guest user documents
        const { ObjectId } = await import('mongodb');
        const userResult = await db.collection('users').deleteMany({
            _id: { $in: allStaleGuests.map(u => u._id) },
        });

        return NextResponse.json({
            message: `Cleaned up ${userResult.deletedCount} stale guest accounts`,
            deleted: userResult.deletedCount,
            deletedNoGames: inactiveNoGames.length,
            deletedWithGames: inactiveWithGames.length,
            deletedStats: statsResult.deletedCount,
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json(
            { error: 'Cleanup failed' },
            { status: 500 }
        );
    }
}

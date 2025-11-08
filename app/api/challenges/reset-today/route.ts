import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';

/**
 * DELETE /api/challenges/reset-today
 * 
 * Admin endpoint to delete today's challenge
 * Requires authentication
 */
export async function DELETE() {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const client = await clientPromise;
    const db = client.db('nopixel');
    
    const result = await db.collection('dailyChallenges').deleteOne({ date: today });
    
    if (result.deletedCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Deleted challenge for ${today}. A new challenge will be generated on next request.`,
        date: today
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `No challenge found for ${today}`,
        date: today
      });
    }
  } catch (error) {
    console.error('Error deleting challenge:', error);
    return NextResponse.json(
      { error: 'Failed to delete challenge' },
      { status: 500 }
    );
  }
}

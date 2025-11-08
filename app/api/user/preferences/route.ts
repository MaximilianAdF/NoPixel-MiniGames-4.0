import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { rateLimit } from '@/lib/rateLimit';

/**
 * PATCH /api/user/preferences
 * 
 * Update user preferences (volume, notifications, theme, etc.)
 */
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Rate limit: 20 requests per minute per user (volume slider adjustments)
    const rateLimitResult = await rateLimit(session.user.id, {
      maxRequests: 20,
      windowSeconds: 60,
    });
    
    if (rateLimitResult) {
      return rateLimitResult;
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { volume, notifications, publicProfile, theme, keyboardShortcuts } = body;

    const client = await clientPromise;
    const db = client.db('nopixel');
    
    // Build update object with only provided fields
    const updates: any = {};
    if (volume !== undefined) updates['preferences.volume'] = volume;
    if (notifications !== undefined) updates['preferences.notifications'] = notifications;
    if (publicProfile !== undefined) updates['preferences.publicProfile'] = publicProfile;
    if (theme !== undefined) updates['preferences.theme'] = theme;
    if (keyboardShortcuts !== undefined) updates['preferences.keyboardShortcuts'] = keyboardShortcuts;
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No preferences to update' },
        { status: 400 }
      );
    }

    updates.updatedAt = new Date();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updates }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

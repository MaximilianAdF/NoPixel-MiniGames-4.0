import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { getSession, clearSession } from '@/lib/auth/session';

// Force dynamic route so deletions are never cached
export const dynamic = 'force-dynamic';

export async function DELETE() {
  const session = await getSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  if (!ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('nopixel');
  const mongoSession = client.startSession();

  try {
    let userDeleted = false;

    await mongoSession.withTransaction(async () => {
      const userObjectId = new ObjectId(userId);

      const deleteUserResult = await db.collection('users').findOneAndDelete(
        { _id: userObjectId },
        { session: mongoSession }
      );

      if (!deleteUserResult || !deleteUserResult.value) {
        throw new Error('USER_NOT_FOUND');
      }

      userDeleted = true;

      await Promise.all([
        db.collection('gameStats').deleteMany({ userId }, { session: mongoSession }),
        db.collection('userChallengeProgress').deleteMany({ userId }, { session: mongoSession }),
        db.collection('analyticsEvents').deleteMany({ userId }, { session: mongoSession }),
      ]);
    });

    if (!userDeleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await clearSession();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === 'USER_NOT_FOUND') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.error('Failed to delete account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  } finally {
    await mongoSession.endSession();
  }
}

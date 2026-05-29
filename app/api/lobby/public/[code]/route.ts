import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { isValidLobbyCode } from '@/lib/lobby/code';
import { deletePublicLobby } from '@/lib/lobby/publicLobbies';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/lobby/public/[code]
 *
 * Unregister a public lobby (host toggled it private, or is closing).
 * The DB delete is scoped by `hostClientId === session.user.id`, so a
 * random joiner can't unlist someone else's lobby.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { code: string } },
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const code = params.code.toUpperCase();
    if (!isValidLobbyCode(code)) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }
    const removed = await deletePublicLobby(code, session.user.id);
    return NextResponse.json({ ok: true, removed });
  } catch (error) {
    console.error('Failed to delete public lobby:', error);
    return NextResponse.json({ error: 'Failed to delete lobby' }, { status: 500 });
  }
}

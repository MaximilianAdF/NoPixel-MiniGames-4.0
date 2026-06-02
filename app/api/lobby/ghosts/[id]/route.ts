import { NextResponse } from 'next/server';
import { getGhost } from '@/lib/lobby/ghosts';

export const dynamic = 'force-dynamic';

/**
 * GET /api/lobby/ghosts/[id]
 *
 * Full ghost including the input stream — fetched only when a race actually
 * starts (the list endpoint omits inputs for payload size).
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const ghost = await getGhost(params.id);
    if (!ghost) {
      return NextResponse.json({ error: 'Ghost not found' }, { status: 404 });
    }
    // Reshape _id -> id for the client.
    const { _id, ...rest } = ghost;
    return NextResponse.json({ ghost: { id: _id.toString(), ...rest } });
  } catch (error) {
    console.error('Failed to fetch ghost:', error);
    return NextResponse.json({ error: 'Failed to fetch ghost' }, { status: 500 });
  }
}

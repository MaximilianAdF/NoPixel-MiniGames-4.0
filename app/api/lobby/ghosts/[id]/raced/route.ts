import { NextResponse, type NextRequest } from 'next/server';
import { incrementGhostRaced } from '@/lib/lobby/ghosts';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

/**
 * POST /api/lobby/ghosts/[id]/raced
 *
 * Fire-and-forget: bump a ghost's timesRaced (and timesBeaten if the racer
 * beat it). Powers "beaten 8 of 23 times" social proof. Best-effort, rate-
 * limited; a missed tick is harmless.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = checkRateLimit(`ghostRaced:${ip}`, { maxRequests: 60, windowSeconds: 60 });
    if (!rl.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const body = await req.json().catch(() => null) as { beaten?: boolean } | null;
    await incrementGhostRaced(params.id, body?.beaten === true);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to mark ghost raced:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

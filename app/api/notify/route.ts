import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/notify
 * Stores a "notify me when NoPixel 5.0 / V trainers launch" email signup.
 * Requires an explicit consent flag; dedupes on email; a filled honeypot
 * (`company`) is silently accepted and dropped to absorb bots.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const consent = body.consent === true;
    const honeypot = typeof body.company === 'string' ? body.company.trim() : '';
    const source = typeof body.source === 'string' ? body.source.slice(0, 40) : 'nopixel-5';

    // Bot filled the hidden field — pretend success, store nothing.
    if (honeypot) return NextResponse.json({ ok: true });

    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ ok: false, error: 'consent_required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('nopixel');
    await db.collection('notifySignups').updateOne(
      { email },
      {
        $setOnInsert: {
          email,
          source,
          consent: true,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 });
  }
}

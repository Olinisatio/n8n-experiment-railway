import { NextResponse } from 'next/server';

/**
 * Stub for the "save your estimates" waitlist. There is no database in this
 * project by design, so for now a signup is only a log line — PostHog's
 * `email_submitted` event is the number we actually read.
 */
export async function POST(request: Request) {
  let email = '';
  let trade = '';

  try {
    const body = (await request.json()) as { email?: unknown; trade?: unknown };
    email = typeof body.email === 'string' ? body.email.trim() : '';
    trade = typeof body.trade === 'string' ? body.trade : '';
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'A valid email address is required' },
      { status: 400 },
    );
  }

  console.log('[subscribe]', JSON.stringify({ email, trade, at: new Date().toISOString() }));

  return NextResponse.json({ ok: true });
}

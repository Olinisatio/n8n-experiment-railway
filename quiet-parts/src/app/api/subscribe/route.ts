import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * Email capture for "The longer read".
 *
 * This route receives an email address and nothing else. It must stay that
 * way: no answers, no total, no band, no sub-pattern, and above all not the
 * name of the person the user was thinking about. Anything read off the
 * request body other than `email` is a privacy bug, not a feature.
 *
 * For now it only sends a confirmation. The three-email sequence comes later.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email = '';

  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'A valid email address is required' },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    // No Resend configured yet — accept the address so the page still works,
    // and leave a log line rather than dropping it silently.
    console.log('[subscribe] no RESEND_API_KEY/RESEND_FROM set; not sending', {
      at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);

    // The Audience is where the address is actually stored — Resend keeps the
    // list, so this project needs no database.
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      await resend.contacts.create({ email, audienceId, unsubscribed: false });
    }

    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: 'The longer read — you’re on the list',
      text: CONFIRMATION_TEXT,
      html: CONFIRMATION_HTML,
    });

    if (error) {
      console.error('[subscribe] resend error', error);
      return NextResponse.json({ ok: false, error: 'Could not send' }, { status: 502 });
    }
  } catch (error) {
    console.error('[subscribe] failed', error);
    return NextResponse.json({ ok: false, error: 'Could not send' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

const CONFIRMATION_TEXT = `You're on the list.

Three emails, then nothing:

1. Where the pattern comes from — why going quiet was once the intelligent option.
2. What actually shifts it, and what only looks like it does.
3. The harder conversations, and how to reopen one you've already had.

Nothing from the tool was sent with your address. Your answers stayed in your browser and are already gone.

If you'd rather not hear from us, ignore this and no more will arrive.

— Quiet Parts`;

const CONFIRMATION_HTML = `<div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.65;color:#3D3229;background:#F5EFE6;padding:32px 24px">
  <div style="max-width:520px;margin:0 auto">
    <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6B5D50;margin:0 0 20px">Quiet Parts</p>
    <p style="font-size:26px;line-height:1.15;margin:0 0 20px">You’re on the list.</p>
    <p style="margin:0 0 16px">Three emails, then nothing:</p>
    <ol style="margin:0 0 20px;padding-left:20px;color:#6B5D50">
      <li style="margin-bottom:8px">Where the pattern comes from — why going quiet was once the intelligent option.</li>
      <li style="margin-bottom:8px">What actually shifts it, and what only looks like it does.</li>
      <li>The harder conversations, and how to reopen one you’ve already had.</li>
    </ol>
    <p style="margin:0 0 16px;font-size:14px;color:#6B5D50">Nothing from the tool was sent with your address. Your answers stayed in your browser and are already gone.</p>
    <p style="margin:0;font-size:14px;color:#6B5D50">If you’d rather not hear from us, ignore this one and no more will arrive.</p>
  </div>
</div>`;

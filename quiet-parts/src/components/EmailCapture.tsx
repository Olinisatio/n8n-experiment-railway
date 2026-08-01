'use client';

import { useState } from 'react';
import { capture } from '@/lib/analytics';

type State = 'idle' | 'sending' | 'done' | 'error';

/**
 * The one place on the page that asks for anything.
 *
 * It sits below the results and below the download, never above them and never
 * as a modal. It sends the email address and nothing else — no answers, no
 * total, no band, no sub-pattern, no name. The request body is literally
 * `{ email }`, and it should stay that way.
 */
export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (state === 'sending' || state === 'done') return;

    setState('sending');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('subscribe failed');
      capture('email_submitted');
      setState('done');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="card drift">
        <h2 className="display-md" style={{ marginBottom: '0.5rem' }}>
          That’s it.
        </h2>
        <p className="ink-soft" style={{ marginBottom: 0 }}>
          Check your inbox — there’s a note confirming it. Three emails, then nothing.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="display-md" style={{ marginBottom: '0.45rem' }}>
        The longer read.
      </h2>
      <p className="ink-soft">
        Where this pattern comes from, and what shifts it. Three emails, then nothing.
      </p>

      <form onSubmit={onSubmit} className="email-form">
        <label className="visually-hidden" htmlFor="qp-email">
          Email address
        </label>
        <input
          id="qp-email"
          className="field"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button className="btn" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send it'}
        </button>
      </form>

      {state === 'error' ? (
        <p className="small ink-soft" role="alert" style={{ marginBottom: 0 }}>
          That didn’t go through. Worth trying once more.
        </p>
      ) : (
        <p className="small ink-soft" style={{ marginBottom: 0 }}>
          Your email address only. Nothing from the tool above is sent with it.
        </p>
      )}
    </div>
  );
}

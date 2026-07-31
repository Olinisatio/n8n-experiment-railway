'use client';

import { useState } from 'react';
import { capture } from '@/lib/analytics';

type Status = 'idle' | 'open' | 'submitting' | 'done' | 'error';

export function CtaBlock({ trade }: { trade: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');

  function openForm() {
    setStatus('open');
    capture('cta_clicked', { trade });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, trade }),
      });
      if (!response.ok) throw new Error('Subscribe failed');
      capture('email_submitted', { trade });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <aside className="rounded-xl border border-brand/30 bg-brand-soft p-5 sm:p-6">
      <h2 className="text-xl font-bold tracking-tight">
        Save this estimate so you don&rsquo;t retype it next time
      </h2>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Keep your line items and pricing saved, and see when your customer opens the
        estimate.
      </p>

      {status === 'idle' ? (
        <button
          type="button"
          onClick={openForm}
          className="mt-4 min-h-12 rounded-md bg-brand px-5 font-bold text-white hover:bg-brand-dark"
        >
          Coming soon — join the list
        </button>
      ) : null}

      {status === 'open' || status === 'submitting' || status === 'error' ? (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="cta-email">
            Email address
          </label>
          <input
            id="cta-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@yourbusiness.com"
            className="min-h-12 w-full rounded-md border border-line bg-surface px-3 py-2 sm:max-w-sm"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="min-h-12 rounded-md bg-brand px-5 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {status === 'submitting' ? 'Adding…' : 'Join the list'}
          </button>
        </form>
      ) : null}

      {status === 'error' ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
          That didn&rsquo;t go through. Please try again.
        </p>
      ) : null}

      {status === 'done' ? (
        <p role="status" className="mt-4 font-semibold">
          You&rsquo;re on the list. We&rsquo;ll email you when it&rsquo;s ready.
        </p>
      ) : null}
    </aside>
  );
}

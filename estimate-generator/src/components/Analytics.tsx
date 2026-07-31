'use client';

import { useEffect, useRef } from 'react';
import { capture } from '@/lib/analytics';

/**
 * Fires the single `page_view` event for this page and warms up PostHog.
 * Rendered once per page with the trade it belongs to ("hub" on the homepage).
 */
export function Analytics({ trade }: { trade: string }) {
  const captured = useRef(false);

  useEffect(() => {
    if (captured.current) return;
    captured.current = true;
    capture('page_view', { trade });
  }, [trade]);

  return null;
}

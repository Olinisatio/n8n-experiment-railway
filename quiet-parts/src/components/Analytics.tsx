'use client';

import { useEffect, useRef } from 'react';
import { capture } from '@/lib/analytics';

/**
 * Fires the single `page_view` event and warms up PostHog. Rendered once, at
 * the top of the page. The ref guard matters in development, where React's
 * strict mode runs effects twice.
 */
export function Analytics() {
  const captured = useRef(false);

  useEffect(() => {
    if (captured.current) return;
    captured.current = true;
    capture('page_view');
  }, []);

  return null;
}

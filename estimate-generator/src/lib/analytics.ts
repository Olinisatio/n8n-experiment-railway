'use client';

import type { PostHog } from 'posthog-js';

/**
 * The complete analytics contract for this site. Nothing else gets captured —
 * a short, exact event list is what makes the pdf_downloaded → email_submitted
 * ratio readable at a glance in PostHog.
 */
export type AnalyticsEvents = {
  page_view: { trade: string };
  estimate_started: { trade: string };
  pdf_downloaded: { trade: string; lineItemCount: number; total: number };
  cta_clicked: { trade: string };
  email_submitted: { trade: string };
};

type QueuedEvent = [string, Record<string, unknown>];

let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
const queue: QueuedEvent[] = [];

/**
 * Loads posthog-js on demand. Keeping it out of the initial bundle costs a
 * few hundred milliseconds on the first event and saves ~75 kB of JS on every
 * page load, which is the trade we want on mobile.
 */
export function loadAnalytics(): Promise<PostHog | null> {
  if (client) return Promise.resolve(client);
  if (loading) return loading;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (typeof window === 'undefined' || !key) {
    // No key configured — analytics stays a permanent no-op.
    loading = Promise.resolve(null);
    return loading;
  }

  loading = import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'always',
        // We send our own `page_view` event carrying the trade, so PostHog's
        // automatic $pageview would only double-count the same visit.
        capture_pageview: false,
        capture_pageleave: true,
        defaults: '2025-05-24',
      });
      client = posthog;
      for (const [event, properties] of queue.splice(0)) {
        posthog.capture(event, properties);
      }
      return posthog;
    })
    .catch(() => null);

  return loading;
}

export function capture<E extends keyof AnalyticsEvents>(
  event: E,
  properties: AnalyticsEvents[E],
): void {
  if (typeof window === 'undefined') return;
  if (client) {
    client.capture(event, properties);
    return;
  }
  queue.push([event, properties as Record<string, unknown>]);
  void loadAnalytics();
}

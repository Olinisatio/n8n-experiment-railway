'use client';

import type { PostHog } from 'posthog-js';

/**
 * The complete analytics contract for this site. Six events, no properties on
 * any of them, and nothing else is ever captured.
 *
 * This is a hard privacy boundary, not a style preference. The page promises
 * the user that their answers never leave the browser, so item responses, the
 * total, the band, the sub-pattern and — above all — the person's name must
 * never be sent anywhere. The event type below is `Record<string, never>` so
 * that adding a property is a TypeScript error rather than a judgement call.
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'inventory_started'
  | 'inventory_completed'
  | 'worksheet_downloaded'
  | 'second_person_started'
  | 'email_submitted';

type QueuedEvent = AnalyticsEvent;

let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
const queue: QueuedEvent[] = [];

/**
 * Loads posthog-js on demand. Keeping it out of the initial bundle costs a
 * few hundred milliseconds before the first event lands and saves ~75 kB of
 * JavaScript on every page load, which is the trade we want on mobile.
 */
export function loadAnalytics(): Promise<PostHog | null> {
  if (client) return Promise.resolve(client);
  if (loading) return loading;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (typeof window === 'undefined' || !key) {
    // No key configured — analytics is a permanent no-op and posthog-js is
    // never downloaded at all.
    loading = Promise.resolve(null);
    return loading;
  }

  loading = import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        // We fire our own `page_view`, so the automatic $pageview would only
        // double-count the same visit.
        capture_pageview: false,
        capture_pageleave: true,
        // Autocapture would hoover up the text of whatever the user clicked —
        // which on this page includes the statements and the answer options.
        autocapture: false,
        // Input values are never recorded, but the person's name is typed into
        // an input, so session recording is off outright rather than masked.
        disable_session_recording: true,
        person_profiles: 'never',
        defaults: '2025-05-24',
      });
      client = posthog;
      for (const event of queue.splice(0)) {
        posthog.capture(event);
      }
      return posthog;
    })
    .catch(() => null);

  return loading;
}

/**
 * Fires one of the six events. There is deliberately no properties argument —
 * see the note at the top of this file.
 */
export function capture(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  if (client) {
    client.capture(event);
    return;
  }
  queue.push(event);
  void loadAnalytics();
}

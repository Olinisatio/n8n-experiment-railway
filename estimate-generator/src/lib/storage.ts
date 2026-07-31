'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const PREFIX = 'estimate-generator:';

export const storageKeys = {
  company: `${PREFIX}company`,
  notes: `${PREFIX}notes`,
  estimateSeq: `${PREFIX}estimate-seq`,
} as const;

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or a full quota — persistence is a nicety, not a
    // requirement, so failing to save must never break the generator.
  }
}

/**
 * State backed by localStorage that is safe to render on the server.
 *
 * The first client render deliberately uses `initial` so the markup matches
 * the server output; the stored value is applied in an effect immediately
 * afterwards. `hydrated` tells callers when that has happened.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (value: T | ((previous: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const stored = read<T>(key);
    if (stored !== null) setValue(stored);
    hydratedRef.current = true;
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(previous) : next;
        // Don't write before hydration, or the initial render would clobber
        // whatever the returning user already saved.
        if (hydratedRef.current) write(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated];
}

const FIRST_ESTIMATE_NUMBER = 1001;

export function peekEstimateSequence(): number {
  if (typeof window === 'undefined') return FIRST_ESTIMATE_NUMBER;
  const stored = read<number>(storageKeys.estimateSeq);
  return typeof stored === 'number' && Number.isFinite(stored)
    ? stored
    : FIRST_ESTIMATE_NUMBER;
}

/** Advances the stored counter so the next estimate gets a fresh number. */
export function bumpEstimateSequence(current: number): void {
  if (typeof window === 'undefined') return;
  const parsed = Number.parseInt(String(current).replace(/\D/g, ''), 10);
  const next = Number.isFinite(parsed) ? parsed + 1 : peekEstimateSequence() + 1;
  write(storageKeys.estimateSeq, next);
}

/**
 * Typed storage layer over the browser's localStorage. The rest of the app
 * talks to this repository, never to localStorage directly, so the storage
 * medium and schema version stay in one place.
 */
import type { AppData } from '../domain/types';
import { emptyData, validateAppData } from './schema';

const STORAGE_KEY = 'inputs.appData.v1';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getStore(): StorageLike | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    // Access to localStorage can throw in some privacy modes.
  }
  return null;
}

/**
 * Load app data. Recovers safely from missing or malformed data by returning a
 * fresh empty dataset (the corrupt payload is preserved under a backup key so
 * nothing is silently destroyed).
 */
export function load(store: StorageLike | null = getStore()): AppData {
  if (!store) return emptyData();
  const raw = store.getItem(STORAGE_KEY);
  if (raw === null) return emptyData();
  try {
    return validateAppData(JSON.parse(raw));
  } catch {
    try {
      store.setItem(`${STORAGE_KEY}.corrupt.${Date.now()}`, raw);
    } catch {
      /* best effort */
    }
    return emptyData();
  }
}

export function save(data: AppData, store: StorageLike | null = getStore()): void {
  if (!store) return;
  store.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearAll(store: StorageLike | null = getStore()): void {
  if (!store) return;
  store.removeItem(STORAGE_KEY);
}

export { STORAGE_KEY };

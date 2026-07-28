/**
 * Typed storage layer over the browser's localStorage. The rest of the app
 * talks to this repository, never to localStorage directly, so the storage
 * medium and schema version stay in one place.
 *
 * Each account's data lives under its own key (`inputs.appData.v1.<accountId>`),
 * so switching accounts shows a separate set of plans/habits/history. Data from
 * before accounts existed lives under the legacy un-namespaced key and is
 * adopted into the first account created.
 */
import type { AppData } from '../domain/types';
import { emptyData, validateAppData } from './schema';

/** Legacy key used before accounts existed. Adopted into the first account. */
const LEGACY_DATA_KEY = 'inputs.appData.v1';

function dataKey(accountId: string): string {
  return `inputs.appData.v1.${accountId}`;
}

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

/** Read + validate the value at `key`, recovering safely from corruption. */
function readAt(key: string, store: StorageLike): AppData {
  const raw = store.getItem(key);
  if (raw === null) return emptyData();
  try {
    return validateAppData(JSON.parse(raw));
  } catch {
    try {
      store.setItem(`${key}.corrupt.${Date.now()}`, raw);
    } catch {
      /* best effort */
    }
    return emptyData();
  }
}

/**
 * Load one account's data. Recovers safely from missing or malformed data by
 * returning a fresh empty dataset (the corrupt payload is preserved under a
 * backup key so nothing is silently destroyed).
 */
export function loadData(accountId: string, store: StorageLike | null = getStore()): AppData {
  if (!store) return emptyData();
  return readAt(dataKey(accountId), store);
}

export function saveData(
  accountId: string,
  data: AppData,
  store: StorageLike | null = getStore(),
): void {
  if (!store) return;
  store.setItem(dataKey(accountId), JSON.stringify(data));
}

export function clearData(accountId: string, store: StorageLike | null = getStore()): void {
  if (!store) return;
  store.removeItem(dataKey(accountId));
}

/** Is there un-namespaced data from before accounts existed? */
export function hasLegacyData(store: StorageLike | null = getStore()): boolean {
  if (!store) return false;
  return store.getItem(LEGACY_DATA_KEY) !== null;
}

/**
 * Move pre-accounts data into `accountId`'s slot and remove the legacy key.
 * Returns the adopted data (empty if there was none). Never overwrites data the
 * account already has.
 */
export function adoptLegacyData(
  accountId: string,
  store: StorageLike | null = getStore(),
): AppData {
  if (!store) return emptyData();
  const legacy = store.getItem(LEGACY_DATA_KEY);
  if (legacy === null) return loadData(accountId, store);
  const data = readAt(LEGACY_DATA_KEY, store);
  // Only adopt into an empty account so we never clobber existing data.
  const existing = store.getItem(dataKey(accountId));
  if (existing === null) saveData(accountId, data, store);
  store.removeItem(LEGACY_DATA_KEY);
  return loadData(accountId, store);
}

export { LEGACY_DATA_KEY, dataKey };

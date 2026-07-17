import { describe, expect, it } from 'vitest';
import { parseBackup, serializeBackup } from '../src/storage/backup';
import { load, save, STORAGE_KEY } from '../src/storage/repository';
import { emptyData, validateAppData, ValidationError } from '../src/storage/schema';
import { buildSeed } from '../src/domain/seed';

class MemStore {
  map = new Map<string, string>();
  getItem(k: string) {
    return this.map.has(k) ? this.map.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, v);
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
}

describe('backup round-trip (rule 17)', () => {
  it('restores exactly what was exported', () => {
    const data = buildSeed('2026-07-13', '2026-08-09');
    // add an entry so the round-trip carries logged history too
    const habitId = data.habits[0]!.id;
    data.entries[`${habitId}|2026-07-13`] = { habitId, date: '2026-07-13', amount: 1500 };

    const text = serializeBackup(data);
    const restored = parseBackup(text);
    expect(restored).toEqual(data);
  });
});

describe('invalid backup safety (rule 18)', () => {
  it('rejects malformed JSON without touching current data', () => {
    const store = new MemStore();
    const current = buildSeed('2026-07-13', '2026-08-09');
    save(current, store);

    expect(() => parseBackup('{ not json')).toThrow(ValidationError);
    // Current data is untouched because we never got as far as replacing it.
    expect(load(store)).toEqual(current);
  });

  it('rejects a structurally invalid backup', () => {
    expect(() => parseBackup(JSON.stringify({ schemaVersion: 1, plans: 'nope' }))).toThrow();
    expect(() =>
      parseBackup(
        JSON.stringify({
          schemaVersion: 1,
          plans: [
            {
              id: 'p',
              name: 'x',
              startDate: 'not-a-date',
              endDate: '2026-01-01',
              createdDate: '2026-01-01',
            },
          ],
          habits: [],
          entries: {},
        }),
      ),
    ).toThrow(ValidationError);
  });

  it('rejects a backup from a newer schema version', () => {
    expect(() =>
      validateAppData({ schemaVersion: 999, plans: [], habits: [], entries: {} }),
    ).toThrow(/newer version/);
  });
});

describe('repository recovery', () => {
  it('returns empty data when storage is empty', () => {
    const store = new MemStore();
    expect(load(store)).toEqual(emptyData());
  });

  it('recovers from corrupt stored data and preserves the corrupt payload', () => {
    const store = new MemStore();
    store.setItem(STORAGE_KEY, '{ broken');
    const result = load(store);
    expect(result).toEqual(emptyData());
    // The corrupt payload is stashed, never silently destroyed.
    const stashed = [...store.map.keys()].some((k) => k.includes('corrupt'));
    expect(stashed).toBe(true);
  });

  it('drops entries that reference a missing habit via validation', () => {
    expect(() =>
      validateAppData({
        schemaVersion: 1,
        plans: [],
        habits: [],
        entries: { 'ghost|2026-01-01': { habitId: 'ghost', date: '2026-01-01', done: true } },
      }),
    ).toThrow(ValidationError);
  });
});

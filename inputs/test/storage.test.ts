import { describe, expect, it } from 'vitest';
import { parseBackup, serializeBackup } from '../src/storage/backup';
import { clearData, dataKey, loadData, saveData } from '../src/storage/repository';
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

const ACC = 'acc-1';

describe('backup round-trip (rule 17)', () => {
  it('restores exactly what was exported', () => {
    const data = buildSeed('2026-07-13', '2026-08-09');
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
    saveData(ACC, current, store);

    expect(() => parseBackup('{ not json')).toThrow(ValidationError);
    // Current data is untouched because we never got as far as replacing it.
    expect(loadData(ACC, store)).toEqual(current);
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
  it('returns empty data when an account has nothing stored', () => {
    const store = new MemStore();
    expect(loadData(ACC, store)).toEqual(emptyData());
  });

  it('recovers from corrupt stored data and preserves the corrupt payload', () => {
    const store = new MemStore();
    store.setItem(dataKey(ACC), '{ broken');
    const result = loadData(ACC, store);
    expect(result).toEqual(emptyData());
    // The corrupt payload is stashed, never silently destroyed.
    const stashed = [...store.map.keys()].some((k) => k.includes('corrupt'));
    expect(stashed).toBe(true);
  });

  it("keeps each account's data separate", () => {
    const store = new MemStore();
    const a = buildSeed('2026-07-13', '2026-08-09');
    saveData('acc-a', a, store);
    expect(loadData('acc-b', store)).toEqual(emptyData());
    clearData('acc-a', store);
    expect(loadData('acc-a', store)).toEqual(emptyData());
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

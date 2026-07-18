import { describe, expect, it } from 'vitest';
import {
  findByEmail,
  hashPassword,
  loadAccounts,
  loadSession,
  normalizeEmail,
  saveAccounts,
  saveSession,
  validateEmail,
  validatePassword,
  verifyPassword,
  type Account,
} from '../src/storage/auth';
import { adoptLegacyData, dataKey, LEGACY_DATA_KEY, loadData } from '../src/storage/repository';
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

async function makeAccount(email: string, password: string): Promise<Account> {
  const { passwordHash, salt, scheme } = await hashPassword(password);
  return {
    id: `id-${email}`,
    email: normalizeEmail(email),
    passwordHash,
    salt,
    scheme,
    createdAt: '2026-07-18T00:00:00.000Z',
  };
}

describe('input validation', () => {
  it('validates email format', () => {
    expect(validateEmail('')).toMatch(/enter your email/i);
    expect(validateEmail('nope')).toMatch(/valid email/i);
    expect(validateEmail('a@b.co')).toBe('');
  });

  it('requires a 6+ character password', () => {
    expect(validatePassword('')).toMatch(/enter a password/i);
    expect(validatePassword('12345')).toMatch(/6 characters/i);
    expect(validatePassword('secret')).toBe('');
  });
});

describe('password hashing', () => {
  it('never stores the plain password and verifies correctly', async () => {
    const acct = await makeAccount('a@b.co', 'hunter2');
    expect(acct.passwordHash).not.toContain('hunter2');
    expect(await verifyPassword('hunter2', acct)).toBe(true);
    expect(await verifyPassword('wrong', acct)).toBe(false);
  });

  it('uses a unique salt per account so equal passwords differ', async () => {
    const a = await makeAccount('a@b.co', 'samepass');
    const b = await makeAccount('c@d.co', 'samepass');
    expect(a.salt).not.toEqual(b.salt);
    expect(a.passwordHash).not.toEqual(b.passwordHash);
  });
});

describe('accounts + session persistence', () => {
  it('round-trips accounts and finds by normalized email', async () => {
    const store = new MemStore();
    const acct = await makeAccount('Person@Example.com', 'secret');
    saveAccounts([acct], store);

    const loaded = loadAccounts(store);
    expect(loaded).toHaveLength(1);
    expect(findByEmail('  PERSON@example.com ', loaded)?.id).toBe(acct.id);
  });

  it('stores and clears the session', () => {
    const store = new MemStore();
    expect(loadSession(store)).toBeNull();
    saveSession('id-1', store);
    expect(loadSession(store)).toBe('id-1');
    saveSession(null, store);
    expect(loadSession(store)).toBeNull();
  });
});

describe('legacy data adoption', () => {
  it('moves pre-accounts data into the first account and clears the legacy key', () => {
    const store = new MemStore();
    const legacy = buildSeed('2026-07-13', '2026-08-09');
    store.setItem(LEGACY_DATA_KEY, JSON.stringify(legacy));

    const adopted = adoptLegacyData('acc-1', store);
    expect(adopted.plans).toHaveLength(1);
    expect(loadData('acc-1', store)).toEqual(legacy);
    expect(store.getItem(LEGACY_DATA_KEY)).toBeNull();
  });

  it('does not overwrite an account that already has data', () => {
    const store = new MemStore();
    const legacy = buildSeed('2026-07-13', '2026-08-09');
    const existing = buildSeed('2026-01-01', '2026-02-01');
    store.setItem(LEGACY_DATA_KEY, JSON.stringify(legacy));
    store.setItem(dataKey('acc-1'), JSON.stringify(existing));

    adoptLegacyData('acc-1', store);
    expect(loadData('acc-1', store)).toEqual(existing);
    expect(store.getItem(LEGACY_DATA_KEY)).toBeNull();
  });

  it('is a no-op when there is no legacy data', () => {
    const store = new MemStore();
    const adopted = adoptLegacyData('acc-1', store);
    expect(adopted.plans).toHaveLength(0);
  });
});

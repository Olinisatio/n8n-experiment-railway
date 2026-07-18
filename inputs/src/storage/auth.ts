/**
 * Browser-only account storage. Accounts and the current session live in
 * localStorage — there is no server. This is a convenience gate and per-browser
 * profile system, NOT real security: anyone with access to the device's
 * developer tools can read this data. Passwords are still stored only as salted
 * hashes so they are never kept in plain text.
 */

export interface Account {
  id: string;
  email: string;
  /** Base64 PBKDF2 (or fallback) hash of the password. */
  passwordHash: string;
  /** Base64 random salt. */
  salt: string;
  /** Hashing scheme, so we can migrate later. */
  scheme: 'pbkdf2' | 'fallback';
  createdAt: string;
}

const ACCOUNTS_KEY = 'inputs.accounts.v1';
const SESSION_KEY = 'inputs.session.v1';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getStore(): StorageLike | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* privacy mode */
  }
  return null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ---------- persistence ----------

export function loadAccounts(store: StorageLike | null = getStore()): Account[] {
  if (!store) return [];
  const raw = store.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is Account =>
        a &&
        typeof a.id === 'string' &&
        typeof a.email === 'string' &&
        typeof a.passwordHash === 'string',
    );
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: Account[], store: StorageLike | null = getStore()): void {
  store?.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function loadSession(store: StorageLike | null = getStore()): string | null {
  if (!store) return null;
  const raw = store.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed?.accountId === 'string' ? parsed.accountId : null;
  } catch {
    return null;
  }
}

export function saveSession(
  accountId: string | null,
  store: StorageLike | null = getStore(),
): void {
  if (!store) return;
  if (accountId === null) store.removeItem(SESSION_KEY);
  else store.setItem(SESSION_KEY, JSON.stringify({ accountId }));
}

export function findByEmail(email: string, accounts: Account[]): Account | undefined {
  const normalized = normalizeEmail(email);
  return accounts.find((a) => a.email === normalized);
}

// ---------- password hashing ----------

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function randomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n);
  const g = globalThis as { crypto?: Crypto };
  if (g.crypto?.getRandomValues) g.crypto.getRandomValues(bytes);
  else for (let i = 0; i < n; i++) bytes[i] = Math.floor(Math.random() * 256);
  return bytes;
}

function subtle(): SubtleCrypto | null {
  const g = globalThis as { crypto?: Crypto };
  return g.crypto?.subtle ?? null;
}

/** A tiny non-cryptographic fallback for environments without SubtleCrypto. */
function fallbackHash(password: string, saltB64: string): string {
  const input = `${saltB64}:${password}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = (h1 ^ c) >>> 0;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 = (h2 + c * (i + 1)) >>> 0;
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return `${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`;
}

export interface HashResult {
  passwordHash: string;
  salt: string;
  scheme: Account['scheme'];
}

export async function hashPassword(password: string, saltB64?: string): Promise<HashResult> {
  const salt = saltB64 ? fromBase64(saltB64) : randomBytes(16);
  const saltStr = toBase64(salt);
  const s = subtle();
  if (s) {
    try {
      const enc = new TextEncoder();
      const keyMaterial = await s.importKey('raw', enc.encode(password), 'PBKDF2', false, [
        'deriveBits',
      ]);
      const bits = await s.deriveBits(
        { name: 'PBKDF2', salt: salt as BufferSource, iterations: 100_000, hash: 'SHA-256' },
        keyMaterial,
        256,
      );
      return { passwordHash: toBase64(new Uint8Array(bits)), salt: saltStr, scheme: 'pbkdf2' };
    } catch {
      /* fall through to fallback */
    }
  }
  return { passwordHash: fallbackHash(password, saltStr), salt: saltStr, scheme: 'fallback' };
}

export async function verifyPassword(password: string, account: Account): Promise<boolean> {
  if (account.scheme === 'fallback') {
    return fallbackHash(password, account.salt) === account.passwordHash;
  }
  const { passwordHash } = await hashPassword(password, account.salt);
  // Constant-ish time compare.
  if (passwordHash.length !== account.passwordHash.length) return false;
  let diff = 0;
  for (let i = 0; i < passwordHash.length; i++) {
    diff |= passwordHash.charCodeAt(i) ^ account.passwordHash.charCodeAt(i);
  }
  return diff === 0;
}

// ---------- validation ----------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string {
  if (!email.trim()) return 'Enter your email.';
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address.';
  return '';
}

export function validatePassword(password: string): string {
  if (!password) return 'Enter a password.';
  if (password.length < 6) return 'Use at least 6 characters.';
  return '';
}

export { ACCOUNTS_KEY, SESSION_KEY };

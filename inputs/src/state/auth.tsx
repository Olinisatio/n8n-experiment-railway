/**
 * Browser-only authentication state. Manages the account list and the current
 * session in localStorage and exposes sign-up / log-in / log-out. No server is
 * involved; see storage/auth.ts for the security caveats.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { newId } from '../domain/format';
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
} from '../storage/auth';
import { adoptLegacyData } from '../storage/repository';

export interface PublicAccount {
  id: string;
  email: string;
}

interface AuthValue {
  account: PublicAccount | null;
  signUp: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function publicOf(a: Account): PublicAccount {
  return { id: a.id, email: a.email };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(() => loadAccounts());
  const [currentId, setCurrentId] = useState<string | null>(() => {
    const sessionId = loadSession();
    if (!sessionId) return null;
    return loadAccounts().some((a) => a.id === sessionId) ? sessionId : null;
  });

  const account = useMemo(() => {
    const found = accounts.find((a) => a.id === currentId);
    return found ? publicOf(found) : null;
  }, [accounts, currentId]);

  const signUp = useCallback(async (email: string, password: string) => {
    const emailError = validateEmail(email);
    if (emailError) return { ok: false as const, error: emailError };
    const passwordError = validatePassword(password);
    if (passwordError) return { ok: false as const, error: passwordError };

    const current = loadAccounts();
    if (findByEmail(email, current)) {
      return { ok: false as const, error: 'An account with that email already exists.' };
    }

    const { passwordHash, salt, scheme } = await hashPassword(password);
    const wasFirstAccount = current.length === 0;
    const acct: Account = {
      id: newId(),
      email: normalizeEmail(email),
      passwordHash,
      salt,
      scheme,
      createdAt: new Date().toISOString(),
    };

    // The very first account adopts any data created before accounts existed.
    if (wasFirstAccount) adoptLegacyData(acct.id);

    const next = [...current, acct];
    saveAccounts(next);
    saveSession(acct.id);
    setAccounts(next);
    setCurrentId(acct.id);
    return { ok: true as const };
  }, []);

  const logIn = useCallback(async (email: string, password: string) => {
    const current = loadAccounts();
    const acct = findByEmail(email, current);
    if (!acct) return { ok: false as const, error: 'No account found for that email.' };
    const valid = await verifyPassword(password, acct);
    if (!valid) return { ok: false as const, error: 'Incorrect password.' };
    saveSession(acct.id);
    setAccounts(current);
    setCurrentId(acct.id);
    return { ok: true as const };
  }, []);

  const logOut = useCallback(() => {
    saveSession(null);
    setCurrentId(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ account, signUp, logIn, logOut }),
    [account, signUp, logIn, logOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook co-located with its provider by design.
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

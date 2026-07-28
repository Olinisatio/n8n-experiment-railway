/**
 * Authentication state. Two interchangeable backends behind one hook:
 *
 * - Supabase (when configured): real email + password accounts, sessions that
 *   persist across reloads, and data that syncs to the cloud.
 * - Local-only (fallback): accounts and sessions live in this browser's
 *   localStorage with no server. Used by the Artifact preview and the tests,
 *   which can't reach the network. See storage/auth.ts for its caveats.
 *
 * Both expose the same {@link AuthValue}, so the rest of the app never cares
 * which one is active.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
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
import { isSupabaseConfigured, supabase } from '../storage/supabase';

export interface PublicAccount {
  id: string;
  email: string;
}

/** Success may carry a notice (e.g. "confirm your email"); failure an error. */
type Outcome = { ok: true; notice?: string } | { ok: false; error: string };

interface AuthValue {
  account: PublicAccount | null;
  /** True while the initial session is being resolved (cloud mode only). */
  loading: boolean;
  /** True when accounts + data are backed by Supabase rather than this browser. */
  synced: boolean;
  signUp: (email: string, password: string) => Promise<Outcome>;
  logIn: (email: string, password: string) => Promise<Outcome>;
  logOut: () => void | Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  return isSupabaseConfigured ? (
    <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
  ) : (
    <LocalAuthProvider>{children}</LocalAuthProvider>
  );
}

/* ------------------------------------------------------------------ *
 * Supabase-backed accounts + sessions.
 * ------------------------------------------------------------------ */

function toPublic(user: { id: string; email?: string } | null | undefined): PublicAccount | null {
  return user ? { id: user.id, email: user.email ?? '' } : null;
}

/** Turn Supabase's terse auth errors into friendlier copy. */
function friendly(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'Incorrect email or password.';
  if (/already registered|already exists/i.test(message))
    return 'An account with that email already exists.';
  return message;
}

function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const client = supabase!;
  const [account, setAccount] = useState<PublicAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      setAccount(toPublic(data.session?.user));
      setLoading(false);
    });
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setAccount(toPublic(session?.user));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [client]);

  const signUp = useCallback(
    async (email: string, password: string): Promise<Outcome> => {
      const emailError = validateEmail(email);
      if (emailError) return { ok: false, error: emailError };
      const passwordError = validatePassword(password);
      if (passwordError) return { ok: false, error: passwordError };

      const { data, error } = await client.auth.signUp({
        email: normalizeEmail(email),
        password,
      });
      if (error) return { ok: false, error: friendly(error.message) };
      // When email confirmation is on there's a user but no session yet.
      if (data.user && !data.session) {
        return { ok: true, notice: 'Check your email to confirm your account, then log in.' };
      }
      return { ok: true };
    },
    [client],
  );

  const logIn = useCallback(
    async (email: string, password: string): Promise<Outcome> => {
      const { error } = await client.auth.signInWithPassword({
        email: normalizeEmail(email),
        password,
      });
      if (error) return { ok: false, error: friendly(error.message) };
      return { ok: true };
    },
    [client],
  );

  const logOut = useCallback(async () => {
    await client.auth.signOut();
  }, [client]);

  const value = useMemo<AuthValue>(
    () => ({ account, loading, synced: true, signUp, logIn, logOut }),
    [account, loading, signUp, logIn, logOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ------------------------------------------------------------------ *
 * Local-only accounts + sessions (no server).
 * ------------------------------------------------------------------ */

function publicOf(a: Account): PublicAccount {
  return { id: a.id, email: a.email };
}

function LocalAuthProvider({ children }: { children: ReactNode }) {
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

  const signUp = useCallback(async (email: string, password: string): Promise<Outcome> => {
    const emailError = validateEmail(email);
    if (emailError) return { ok: false, error: emailError };
    const passwordError = validatePassword(password);
    if (passwordError) return { ok: false, error: passwordError };

    const current = loadAccounts();
    if (findByEmail(email, current)) {
      return { ok: false, error: 'An account with that email already exists.' };
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
    return { ok: true };
  }, []);

  const logIn = useCallback(async (email: string, password: string): Promise<Outcome> => {
    const current = loadAccounts();
    const acct = findByEmail(email, current);
    if (!acct) return { ok: false, error: 'No account found for that email.' };
    const valid = await verifyPassword(password, acct);
    if (!valid) return { ok: false, error: 'Incorrect password.' };
    saveSession(acct.id);
    setAccounts(current);
    setCurrentId(acct.id);
    return { ok: true };
  }, []);

  const logOut = useCallback(() => {
    saveSession(null);
    setCurrentId(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ account, loading: false, synced: false, signUp, logIn, logOut }),
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

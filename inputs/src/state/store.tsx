/**
 * React binding for the app store: wires the pure reducer to localStorage,
 * exposes typed data + dispatch, and provides a single-level undo for the fast
 * logging actions on the Today screen.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppData } from '../domain/types';
import { loadData, saveData } from '../storage/repository';
import { isSupabaseConfigured } from '../storage/supabase';
import { loadRemote, saveRemote } from '../storage/sync';
import { reducer, type Action } from './actions';

interface StoreValue {
  data: AppData;
  dispatch: (action: Action) => void;
  /** Replace all data (restore/seed/delete) — bypasses undo. */
  replaceAll: (data: AppData) => void;
  canUndo: boolean;
  undo: () => void;
  undoLabel: string | null;
}

const StoreContext = createContext<StoreValue | null>(null);

const UNDOABLE = new Set<Action['type']>(['setDone', 'setAmount']);

export function StoreProvider({
  children,
  accountId,
  initial,
}: {
  children: ReactNode;
  /** Whose data to load and persist. Namespaces storage per account. */
  accountId: string;
  initial?: AppData;
}) {
  // Sync when Supabase is configured and we're loading real data (tests pass an
  // explicit `initial`, so they stay local-only).
  const syncEnabled = isSupabaseConfigured && initial === undefined;
  const [data, rawDispatch] = useReducer(reducer, undefined, () => initial ?? loadData(accountId));
  const undoRef = useRef<{ snapshot: AppData; label: string } | null>(null);
  const [undoLabel, setUndoLabel] = useState<string | null>(null);
  // In sync mode we hold the UI until the cloud copy has been fetched.
  const [hydrated, setHydrated] = useState(!syncEnabled);

  // Keep a live ref to the latest data for use inside async effects.
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Hydrate from the cloud on login / account change.
  useEffect(() => {
    if (!syncEnabled) return;
    let cancelled = false;
    setHydrated(false);
    (async () => {
      try {
        const remote = await loadRemote(accountId);
        if (cancelled) return;
        if (remote) {
          rawDispatch({ type: 'replaceAll', data: remote });
        } else {
          // First time on the cloud: seed the row with whatever's cached here.
          await saveRemote(accountId, dataRef.current);
        }
      } catch {
        // Offline or unreachable: keep using the local cache already loaded.
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accountId, syncEnabled]);

  // Persist every change: always to the local cache; to the cloud once hydrated
  // (debounced so rapid edits collapse into one write).
  useEffect(() => {
    saveData(accountId, data);
    if (!syncEnabled || !hydrated) return;
    const timer = setTimeout(() => {
      saveRemote(accountId, data).catch(() => {
        // Best effort: the change is safe in the local cache and will be
        // re-sent on the next edit or reload.
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [accountId, data, syncEnabled, hydrated]);

  const dispatch = useCallback(
    (action: Action) => {
      if (UNDOABLE.has(action.type)) {
        undoRef.current = { snapshot: data, label: 'Change reverted' };
        setUndoLabel('Undo');
      } else {
        undoRef.current = null;
        setUndoLabel(null);
      }
      rawDispatch(action);
    },
    [data],
  );

  const replaceAll = useCallback((next: AppData) => {
    undoRef.current = null;
    setUndoLabel(null);
    rawDispatch({ type: 'replaceAll', data: next });
  }, []);

  const undo = useCallback(() => {
    const held = undoRef.current;
    if (!held) return;
    undoRef.current = null;
    setUndoLabel(null);
    rawDispatch({ type: 'replaceAll', data: held.snapshot });
  }, []);

  const value = useMemo<StoreValue>(
    () => ({ data, dispatch, replaceAll, canUndo: undoLabel !== null, undo, undoLabel }),
    [data, dispatch, replaceAll, undo, undoLabel],
  );

  if (!hydrated) {
    return <div className="app-loading">Syncing your data…</div>;
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook is co-located with its provider by design.
export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}

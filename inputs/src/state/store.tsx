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
  const [data, rawDispatch] = useReducer(reducer, undefined, () => initial ?? loadData(accountId));
  const undoRef = useRef<{ snapshot: AppData; label: string } | null>(null);
  const [undoLabel, setUndoLabel] = useState<string | null>(null);

  // Persist on every change, scoped to the active account.
  useEffect(() => {
    saveData(accountId, data);
  }, [accountId, data]);

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

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook is co-located with its provider by design.
export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}

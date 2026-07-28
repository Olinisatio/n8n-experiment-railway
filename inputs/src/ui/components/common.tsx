/** Small reusable presentational components. */
import { useEffect, type ReactNode } from 'react';
import { PACE_LABELS } from '../../domain/progress';
import type { PaceStatus } from '../../domain/types';

const PACE_SYMBOL: Record<PaceStatus, string> = {
  ahead: '▲',
  behind: '▼',
  'on-track': '＝',
  'no-goal': '–',
};

/** Pace badge — never relies on colour alone (symbol + word). */
export function PaceBadge({ status, prefix }: { status: PaceStatus; prefix?: string }) {
  return (
    <span className={`pace ${status}`}>
      <span className="dot" aria-hidden="true">
        {PACE_SYMBOL[status]}
      </span>
      {prefix ? `${prefix}: ` : ''}
      {PACE_LABELS[status]}
    </span>
  );
}

export function ProgressBar({ actual, goal }: { actual: number; goal: number }) {
  const pct = goal > 0 ? (actual / goal) * 100 : 0;
  const over = pct > 100;
  return (
    <div
      className={`bar ${over ? 'over' : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error ? (
        <div className="faint" style={{ fontSize: 12 }}>
          {hint}
        </div>
      ) : null}
      {error ? <div className="form-error">{error}</div> : null}
    </div>
  );
}

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  danger,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="muted" style={{ marginTop: 0 }}>
        {message}
      </p>
      <div className="btn-row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button className={`btn ${danger ? 'danger' : 'primary'}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

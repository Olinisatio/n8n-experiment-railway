/** Settings and data safety: backup, restore, seed, and delete-all. */
import { useRef, useState } from 'react';
import { todayISO } from '../../domain/dates';
import { buildSeed } from '../../domain/seed';
import type { AppData } from '../../domain/types';
import { addDays } from '../../domain/dates';
import { backupFilename, parseBackup, serializeBackup } from '../../storage/backup';
import { ValidationError } from '../../storage/schema';
import { useAuth } from '../../state/auth';
import { useStore } from '../../state/store';
import { ConfirmDialog } from '../components/common';

export function Settings() {
  const { data, replaceAll } = useStore();
  const { account, logOut, synced } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<AppData | null>(null);
  const [restoreError, setRestoreError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState('');

  function download() {
    const blob = new Blob([serializeBackup(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = backupFilename();
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setNotice('Backup downloaded.');
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setRestoreError('');
    setNotice('');
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        // Validate before touching current data — kept in memory until confirmed.
        const validated = parseBackup(String(reader.result));
        setPending(validated);
      } catch (err) {
        setRestoreError(
          err instanceof ValidationError ? err.message : 'This file could not be read as a backup.',
        );
      }
    };
    reader.onerror = () => setRestoreError('Could not read that file.');
    reader.readAsText(file);
  }

  return (
    <div className="app-main">
      <h1 className="screen-title">Settings</h1>

      {account ? (
        <div className="card stack" style={{ marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 16 }}>Account</h2>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              Signed in as <strong>{account.email}</strong>.{' '}
              {synced
                ? 'Your plans and habits sync securely to the cloud and follow you across devices.'
                : 'Your plans and habits are private to this account, in this browser.'}
            </p>
          </div>
          <div className="btn-row">
            <button className="btn" onClick={logOut}>
              Log out
            </button>
          </div>
        </div>
      ) : null}

      <div className="card stack">
        <div>
          <h2 style={{ fontSize: 16 }}>Backup</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
            Download all your plans, habits, and history as a JSON file you can keep safe or move to
            another browser.
          </p>
        </div>
        <div className="btn-row">
          <button className="btn primary" onClick={download}>
            Download backup
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Restore backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={onFile}
          />
        </div>
        {restoreError ? <div className="form-error">{restoreError}</div> : null}
        {notice ? (
          <div className="faint" style={{ fontSize: 13 }}>
            {notice}
          </div>
        ) : null}
      </div>

      {data.plans.length === 0 ? (
        <div className="card stack" style={{ marginTop: 14 }}>
          <div>
            <h2 style={{ fontSize: 16 }}>Sample data</h2>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              Load an example plan to explore the app. You can delete it any time.
            </p>
          </div>
          <div className="btn-row">
            <button
              className="btn"
              onClick={() => {
                const start = todayISO();
                replaceAll(buildSeed(start, addDays(start, 27)));
                setNotice('Sample plan loaded.');
              }}
            >
              Load sample plan
            </button>
          </div>
        </div>
      ) : null}

      <div className="card stack" style={{ marginTop: 14 }}>
        <div>
          <h2 style={{ fontSize: 16 }}>Danger zone</h2>
          <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
            Permanently delete everything stored in this browser. Download a backup first if you
            might want it back.
          </p>
        </div>
        <div className="btn-row">
          <button className="btn danger" onClick={() => setConfirmDelete(true)}>
            Delete all data
          </button>
        </div>
      </div>

      <p className="tagline" style={{ textAlign: 'center', marginTop: 22 }}>
        Your life reflects your inputs.
      </p>

      {pending ? (
        <ConfirmDialog
          title="Restore this backup?"
          message={
            <>
              This replaces your current data with the backup: {pending.plans.length} plan
              {pending.plans.length === 1 ? '' : 's'}, {pending.habits.length} habit
              {pending.habits.length === 1 ? '' : 's'}, and {Object.keys(pending.entries).length}{' '}
              logged {Object.keys(pending.entries).length === 1 ? 'day' : 'days'}. Your current data
              will be overwritten.
            </>
          }
          confirmLabel="Replace my data"
          onCancel={() => setPending(null)}
          onConfirm={() => {
            replaceAll(pending);
            setPending(null);
            setNotice('Backup restored.');
          }}
        />
      ) : null}

      {confirmDelete ? (
        <ConfirmDialog
          title="Delete all data?"
          message="This permanently erases every plan, habit, and logged day in this browser. This cannot be undone."
          confirmLabel="Delete everything"
          danger
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            replaceAll({ schemaVersion: data.schemaVersion, plans: [], habits: [], entries: {} });
            setConfirmDelete(false);
            setNotice('All data deleted.');
          }}
        />
      ) : null}
    </div>
  );
}

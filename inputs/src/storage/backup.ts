/**
 * Backup export and restore. Export produces a versioned JSON document. Restore
 * validates the whole document before returning it, so a damaged or unsupported
 * file can never overwrite good in-memory data — the caller only swaps data in
 * once this function returns successfully.
 */
import { CURRENT_SCHEMA_VERSION, type AppData } from '../domain/types';
import { validateAppData, ValidationError } from './schema';

const BACKUP_KIND = 'inputs-backup';

export interface BackupFile {
  kind: string;
  schemaVersion: number;
  exportedAt: string;
  data: AppData;
}

export function buildBackup(data: AppData, now: Date = new Date()): BackupFile {
  return {
    kind: BACKUP_KIND,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    data,
  };
}

export function serializeBackup(data: AppData, now?: Date): string {
  return JSON.stringify(buildBackup(data, now), null, 2);
}

export function backupFilename(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `inputs-backup-${y}-${m}-${d}.json`;
}

/**
 * Parse and validate a backup file's text. Throws `ValidationError` with a
 * useful message on any problem. Accepts both a wrapped backup document and a
 * bare `AppData` object for resilience.
 */
export function parseBackup(text: string): AppData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ValidationError('This file is not valid JSON.');
  }
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'kind' in parsed &&
    (parsed as { kind: unknown }).kind === BACKUP_KIND &&
    'data' in parsed
  ) {
    return validateAppData((parsed as { data: unknown }).data);
  }
  // Fall back to treating the file as a bare AppData export.
  return validateAppData(parsed);
}

/**
 * Runtime validation for stored and imported data. We never trust bytes from
 * localStorage or a backup file — everything is validated into a known-good
 * `AppData` before the app uses it.
 */
import { isValidISODate } from '../domain/dates';
import {
  CURRENT_SCHEMA_VERSION,
  type AppData,
  type Entry,
  type EntryMap,
  type GoalVersion,
  type Habit,
  type Plan,
  type TrackingType,
} from '../domain/types';

export class ValidationError extends Error {}

export function emptyData(): AppData {
  return { schemaVersion: CURRENT_SCHEMA_VERSION, plans: [], habits: [], entries: {} };
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function str(v: unknown, field: string): string {
  if (typeof v !== 'string' || v.length === 0) {
    throw new ValidationError(`Expected non-empty string for "${field}".`);
  }
  return v;
}

function isoDate(v: unknown, field: string): string {
  if (!isValidISODate(v)) throw new ValidationError(`Invalid date for "${field}": ${String(v)}`);
  return v;
}

function optNumber(v: unknown, field: string): number | undefined {
  if (v === undefined || v === null) return undefined;
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new ValidationError(`Invalid number for "${field}".`);
  }
  return v;
}

const TRACKING_TYPES: TrackingType[] = ['done', 'number', 'time'];

function validateGoal(v: unknown): GoalVersion {
  if (!isObject(v)) throw new ValidationError('Goal version must be an object.');
  const weeklyFrequency = optNumber(v.weeklyFrequency, 'weeklyFrequency');
  if (weeklyFrequency === undefined || weeklyFrequency < 1 || weeklyFrequency > 7) {
    throw new ValidationError('weeklyFrequency must be between 1 and 7.');
  }
  return {
    effectiveMonday: isoDate(v.effectiveMonday, 'effectiveMonday'),
    weeklyFrequency,
    dailyTarget: optNumber(v.dailyTarget, 'dailyTarget'),
    weeklyTarget: optNumber(v.weeklyTarget, 'weeklyTarget'),
  };
}

function validatePlan(v: unknown): Plan {
  if (!isObject(v)) throw new ValidationError('Plan must be an object.');
  return {
    id: str(v.id, 'plan.id'),
    name: str(v.name, 'plan.name'),
    startDate: isoDate(v.startDate, 'plan.startDate'),
    endDate: isoDate(v.endDate, 'plan.endDate'),
    archived: Boolean(v.archived),
    createdDate: isoDate(v.createdDate, 'plan.createdDate'),
    endHandled: v.endHandled === undefined ? undefined : Boolean(v.endHandled),
  };
}

function validateHabit(v: unknown): Habit {
  if (!isObject(v)) throw new ValidationError('Habit must be an object.');
  const type = v.type;
  if (typeof type !== 'string' || !TRACKING_TYPES.includes(type as TrackingType)) {
    throw new ValidationError(`Invalid habit type: ${String(type)}`);
  }
  const goalHistory = Array.isArray(v.goalHistory) ? v.goalHistory.map(validateGoal) : [];
  if (goalHistory.length === 0) throw new ValidationError('Habit needs at least one goal version.');
  const display = v.weeklyCardDisplay;
  return {
    id: str(v.id, 'habit.id'),
    planId: str(v.planId, 'habit.planId'),
    name: str(v.name, 'habit.name'),
    type: type as TrackingType,
    unit: typeof v.unit === 'string' ? v.unit : undefined,
    weeklyCardDisplay: display === 'days' || display === 'amount' ? display : undefined,
    createdDate: isoDate(v.createdDate, 'habit.createdDate'),
    goalHistory,
    archived: Boolean(v.archived),
  };
}

function validateEntry(v: unknown): Entry {
  if (!isObject(v)) throw new ValidationError('Entry must be an object.');
  return {
    habitId: str(v.habitId, 'entry.habitId'),
    date: isoDate(v.date, 'entry.date'),
    done: v.done === undefined ? undefined : Boolean(v.done),
    amount: optNumber(v.amount, 'entry.amount'),
  };
}

/**
 * Validate an unknown value into `AppData`. Throws `ValidationError` on any
 * problem so callers can keep their existing data. Handles forward-compatible
 * schema migration (only v1 exists today).
 */
export function validateAppData(raw: unknown): AppData {
  if (!isObject(raw)) throw new ValidationError('Data root must be an object.');
  const version = raw.schemaVersion;
  if (typeof version !== 'number') throw new ValidationError('Missing schemaVersion.');
  if (version > CURRENT_SCHEMA_VERSION) {
    throw new ValidationError(
      `Backup is from a newer version (${version}) than this app supports (${CURRENT_SCHEMA_VERSION}).`,
    );
  }

  if (raw.plans !== undefined && !Array.isArray(raw.plans)) {
    throw new ValidationError('"plans" must be an array.');
  }
  if (raw.habits !== undefined && !Array.isArray(raw.habits)) {
    throw new ValidationError('"habits" must be an array.');
  }
  if (raw.entries !== undefined && !isObject(raw.entries)) {
    throw new ValidationError('"entries" must be an object.');
  }
  const plans = Array.isArray(raw.plans) ? raw.plans.map(validatePlan) : [];
  const habits = Array.isArray(raw.habits) ? raw.habits.map(validateHabit) : [];

  const entries: EntryMap = {};
  if (isObject(raw.entries)) {
    for (const [key, value] of Object.entries(raw.entries)) {
      entries[key] = validateEntry(value);
    }
  }

  // Referential sanity: drop entries whose habit no longer exists is unsafe
  // (could hide data loss); instead we keep them but require habits to be valid.
  const habitIds = new Set(habits.map((h) => h.id));
  const planIds = new Set(plans.map((p) => p.id));
  for (const habit of habits) {
    if (!planIds.has(habit.planId)) {
      throw new ValidationError(`Habit "${habit.name}" references a missing plan.`);
    }
  }
  for (const entry of Object.values(entries)) {
    if (!habitIds.has(entry.habitId)) {
      throw new ValidationError('An entry references a missing habit.');
    }
  }

  return { schemaVersion: CURRENT_SCHEMA_VERSION, plans, habits, entries };
}

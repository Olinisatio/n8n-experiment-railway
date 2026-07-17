/**
 * Core domain types for Inputs.
 *
 * Dates are stored as `ISODate` — a local calendar date string `YYYY-MM-DD`.
 * We never store a full timestamp for a habit entry, so a day can never drift
 * into a neighbouring day through UTC conversion.
 */

/** A local calendar date, formatted `YYYY-MM-DD`. */
export type ISODate = string;

export type TrackingType = 'done' | 'number' | 'time';

/** How a number/time habit's weekly card summarises progress. */
export type WeeklyCardDisplay = 'days' | 'amount';

/**
 * A versioned goal. When a user changes a goal we push a new version whose
 * `effectiveMonday` is the Monday of the week the change takes effect. Past
 * weeks keep whichever version applied at that time.
 */
export interface GoalVersion {
  /** Monday (YYYY-MM-DD) from which this goal applies. */
  effectiveMonday: ISODate;
  /** Weekly frequency goal, 1..7 days. */
  weeklyFrequency: number;
  /** Daily amount target for number/time habits. */
  dailyTarget?: number;
  /** Weekly amount target for number/time habits. */
  weeklyTarget?: number;
}

export interface Habit {
  id: string;
  planId: string;
  name: string;
  type: TrackingType;
  /** Unit label for number habits, e.g. "calories", "steps". */
  unit?: string;
  /** Weekly card display choice for number/time habits. */
  weeklyCardDisplay?: WeeklyCardDisplay;
  createdDate: ISODate;
  /** Goal versions, kept sorted ascending by `effectiveMonday`. Never empty. */
  goalHistory: GoalVersion[];
  archived: boolean;
}

export interface Plan {
  id: string;
  name: string;
  /** Inclusive start date. This is Day 1. */
  startDate: ISODate;
  /** Inclusive end date. */
  endDate: ISODate;
  archived: boolean;
  createdDate: ISODate;
  /**
   * True once the user has responded to the "this plan has ended" prompt, so
   * we do not nag them on every launch.
   */
  endHandled?: boolean;
}

/** A single day's total for one habit. Keyed in storage by `habitId|date`. */
export interface Entry {
  habitId: string;
  date: ISODate;
  /** For done/not-done habits. */
  done?: boolean;
  /** Daily total for number/time habits (minutes for time). */
  amount?: number;
}

export type EntryMap = Record<string, Entry>;

export interface AppData {
  schemaVersion: number;
  plans: Plan[];
  habits: Habit[];
  entries: EntryMap;
}

/** Pace status for a single measure. */
export type PaceStatus = 'ahead' | 'on-track' | 'behind' | 'no-goal';

export const CURRENT_SCHEMA_VERSION = 1;

export function entryKey(habitId: string, date: ISODate): string {
  return `${habitId}|${date}`;
}

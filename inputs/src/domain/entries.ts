/**
 * Reading and interpreting daily entries. Entries store one total per habit per
 * day; a missing entry means "not done / amount zero".
 */
import type { EntryMap, Entry, GoalVersion, Habit, ISODate } from './types';
import { entryKey } from './types';

export function getEntry(entries: EntryMap, habitId: string, date: ISODate): Entry | undefined {
  return entries[entryKey(habitId, date)];
}

/** The saved daily amount for a number/time habit (0 when nothing is logged). */
export function dailyAmount(entries: EntryMap, habitId: string, date: ISODate): number {
  return getEntry(entries, habitId, date)?.amount ?? 0;
}

export function isDone(entries: EntryMap, habitId: string, date: ISODate): boolean {
  return getEntry(entries, habitId, date)?.done === true;
}

/**
 * Whether a day counts as "hit" for the given goal version.
 * - done: the box is checked.
 * - number/time: the saved daily total meets or beats the daily target
 *   (a positive target — a zero/blank target never auto-marks empty days).
 */
export function isDayHit(habit: Habit, entry: Entry | undefined, goal: GoalVersion): boolean {
  if (habit.type === 'done') return entry?.done === true;
  const target = goal.dailyTarget ?? 0;
  if (target <= 0) return false;
  return (entry?.amount ?? 0) >= target;
}

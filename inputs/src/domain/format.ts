/** Display formatting for amounts, time, and percentages. */
import type { Habit } from './types';

/** Stable-ish id. Uses crypto.randomUUID when available. */
export function newId(): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  if (g.crypto?.randomUUID) return g.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Minutes → friendly "1h 30m" / "45m" / "2h". */
export function formatMinutes(mins: number): string {
  const total = Math.round(mins);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Round a display amount sensibly by unit (time stays whole minutes). */
function roundDisplay(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Format an amount for a habit, using its unit or time formatting. */
export function formatAmount(habit: Habit, value: number): string {
  if (habit.type === 'time') return formatMinutes(value);
  const rounded = roundDisplay(value);
  const num = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return habit.unit ? `${num} ${habit.unit}` : num;
}

/** Format a progress ratio as a whole-number percent (never capped). */
export function formatPercent(actual: number, goal: number): string {
  if (goal <= 0) return '—';
  return `${Math.round((actual / goal) * 100)}%`;
}

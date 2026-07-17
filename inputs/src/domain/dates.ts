/**
 * Local-date utilities.
 *
 * Every function here operates on `YYYY-MM-DD` strings using integer arithmetic
 * (a proleptic Gregorian ordinal). We never route a calendar date through
 * `Date.parse` / `toISOString`, so a UTC offset can never shift an entry to a
 * neighbouring day. `todayISO()` is the single place we read the wall clock,
 * and it reads local components only.
 */
import type { ISODate } from './types';

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidISODate(value: unknown): value is ISODate {
  if (typeof value !== 'string' || !ISO_RE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number) as [number, number, number];
  if (m < 1 || m > 12 || d < 1) return false;
  return d <= daysInMonth(y, m);
}

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function daysInMonth(y: number, m: number): number {
  return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]!;
}

export function parseISO(iso: ISODate): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return { y, m, d };
}

export function formatISO(y: number, m: number, d: number): ISODate {
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

/**
 * Days since a fixed epoch (proleptic Gregorian). The absolute value is
 * unimportant; only differences and parity are used.
 */
export function toOrdinal(iso: ISODate): number {
  const { y, m, d } = parseISO(iso);
  // Howard Hinnant's days-from-civil algorithm.
  const yr = m <= 2 ? y - 1 : y;
  const era = Math.floor((yr >= 0 ? yr : yr - 399) / 400);
  const yoe = yr - era * 400;
  const doy = Math.floor((153 * (m > 2 ? m - 3 : m + 9) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export function fromOrdinal(n: number): ISODate {
  const z = n + 719468;
  const era = Math.floor((z >= 0 ? z : z - 146096) / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365,
  );
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return formatISO(m <= 2 ? y + 1 : y, m, d);
}

export function addDays(iso: ISODate, days: number): ISODate {
  return fromOrdinal(toOrdinal(iso) + days);
}

/** Number of days from `a` to `b` (b - a). */
export function diffDays(a: ISODate, b: ISODate): number {
  return toOrdinal(b) - toOrdinal(a);
}

/** -1, 0, 1 for a < b, a == b, a > b. */
export function compareDate(a: ISODate, b: ISODate): number {
  const d = toOrdinal(a) - toOrdinal(b);
  return d < 0 ? -1 : d > 0 ? 1 : 0;
}

/** Weekday with Monday = 0 … Sunday = 6. */
export function weekdayMon0(iso: ISODate): number {
  // Ordinal 0 corresponds to 1970-01-01, a Thursday (Mon=0 → Thursday=3).
  return (((toOrdinal(iso) + 3) % 7) + 7) % 7;
}

/** The Monday (YYYY-MM-DD) of the ISO week containing `iso`. */
export function mondayOf(iso: ISODate): ISODate {
  return addDays(iso, -weekdayMon0(iso));
}

/** The Sunday of the ISO week containing `iso`. */
export function sundayOf(iso: ISODate): ISODate {
  return addDays(mondayOf(iso), 6);
}

export function minDate(a: ISODate, b: ISODate): ISODate {
  return compareDate(a, b) <= 0 ? a : b;
}

export function maxDate(a: ISODate, b: ISODate): ISODate {
  return compareDate(a, b) >= 0 ? a : b;
}

/** Inclusive: is `date` within [start, end]? */
export function isWithin(date: ISODate, start: ISODate, end: ISODate): boolean {
  return compareDate(date, start) >= 0 && compareDate(date, end) <= 0;
}

/** Today's local calendar date. The only wall-clock read in the app. */
export function todayISO(now: Date = new Date()): ISODate {
  return formatISO(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** All dates in [start, end] inclusive. */
export function eachDay(start: ISODate, end: ISODate): ISODate[] {
  const out: ISODate[] = [];
  const last = toOrdinal(end);
  for (let o = toOrdinal(start); o <= last; o++) out.push(fromOrdinal(o));
  return out;
}

/** All week-Monday dates from the week of `start` through the week of `end`. */
export function eachWeekMonday(start: ISODate, end: ISODate): ISODate[] {
  const out: ISODate[] = [];
  let m = mondayOf(start);
  const lastM = mondayOf(end);
  while (compareDate(m, lastM) <= 0) {
    out.push(m);
    m = addDays(m, 7);
  }
  return out;
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Human label like "Mon 17 Jul 2026". */
export function formatLong(iso: ISODate): string {
  const { y, m, d } = parseISO(iso);
  return `${WEEKDAY_LABELS[weekdayMon0(iso)]} ${d} ${MONTH_LABELS[m - 1]} ${y}`;
}

/** Short label like "17 Jul". */
export function formatShort(iso: ISODate): string {
  const { m, d } = parseISO(iso);
  return `${d} ${MONTH_LABELS[m - 1]}`;
}

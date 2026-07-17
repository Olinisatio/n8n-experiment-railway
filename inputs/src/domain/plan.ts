/**
 * Plan-relative calendar math: day numbers, week numbers, and how many of a
 * plan's active days fall inside a given Monday-to-Sunday week.
 */
import {
  addDays,
  compareDate,
  diffDays,
  eachWeekMonday,
  isWithin,
  maxDate,
  minDate,
  mondayOf,
} from './dates';
import type { ISODate, Plan } from './types';

/** Day number within the plan. The start date is Day 1. */
export function planDayNumber(plan: Plan, date: ISODate): number {
  return diffDays(plan.startDate, date) + 1;
}

/**
 * Week number within the plan. The partial calendar week containing the start
 * date is Week 1; the next Monday starts Week 2.
 */
export function planWeekNumber(plan: Plan, date: ISODate): number {
  const startMonday = mondayOf(plan.startDate);
  const dateMonday = mondayOf(date);
  return diffDays(startMonday, dateMonday) / 7 + 1;
}

/** Is `date` inside the plan's inclusive [start, end] range? */
export function isDateInPlan(plan: Plan, date: ISODate): boolean {
  return isWithin(date, plan.startDate, plan.endDate);
}

export function isPlanActiveOn(plan: Plan, date: ISODate): boolean {
  return !plan.archived && isDateInPlan(plan, date);
}

export function hasPlanEnded(plan: Plan, today: ISODate): boolean {
  return compareDate(today, plan.endDate) > 0;
}

export function hasPlanStarted(plan: Plan, today: ISODate): boolean {
  return compareDate(today, plan.startDate) >= 0;
}

/**
 * Number of the plan's active days that fall within the Monday-to-Sunday week
 * beginning on `weekMonday`. Clipped to the plan's inclusive date range.
 */
export function activePlanDaysInWeek(plan: Plan, weekMonday: ISODate): number {
  const weekSunday = addDays(weekMonday, 6);
  const from = maxDate(weekMonday, plan.startDate);
  const to = minDate(weekSunday, plan.endDate);
  const count = diffDays(from, to) + 1;
  return count > 0 ? count : 0;
}

/**
 * The plan's week Mondays from its first week through the week of `throughDate`
 * (clamped to the plan's end). Used for full-plan pace accumulation.
 */
export function planWeekMondays(plan: Plan, throughDate: ISODate): ISODate[] {
  const end = minDate(throughDate, plan.endDate);
  if (compareDate(end, plan.startDate) < 0) return [];
  return eachWeekMonday(plan.startDate, end);
}

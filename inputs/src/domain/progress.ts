/**
 * Weekly progress and full-plan pace — the scoring heart of the app.
 *
 * All functions are pure: given a plan, a habit, the entries, and a reference
 * date they return numbers and labels. Progress is never capped at 100%: extra
 * work counts and can put a user ahead.
 */
import {
  addDays,
  compareDate,
  diffDays,
  eachDay,
  eachWeekMonday,
  maxDate,
  minDate,
  mondayOf,
} from './dates';
import { getEntry, isDayHit } from './entries';
import { adjustedFrequencyGoal, adjustedWeeklyAmountGoal, goalForWeek } from './goals';
import { activePlanDaysInWeek, planWeekMondays } from './plan';
import type { EntryMap, Habit, ISODate, PaceStatus, Plan } from './types';

/** Tolerance for comparing decimal amounts (avoids float noise). */
export const EPSILON = 1e-6;

export interface WeeklyProgress {
  weekMonday: ISODate;
  activeDays: number;
  /** Frequency goal for the week (may be 0 → "No goal due"). */
  frequencyGoal: number;
  hitDays: number;
  hasFrequencyGoal: boolean;
  /** Amount fields are present only for number/time habits. */
  amount?: {
    actual: number;
    goal: number;
  };
}

/**
 * Days of the given week that lie inside the plan. Used both for hit counting
 * and amount summing so the two always agree on the window.
 */
function planDaysInWeek(plan: Plan, weekMonday: ISODate): ISODate[] {
  const weekSunday = addDays(weekMonday, 6);
  const from = compareDate(weekMonday, plan.startDate) >= 0 ? weekMonday : plan.startDate;
  const to = compareDate(weekSunday, plan.endDate) <= 0 ? weekSunday : plan.endDate;
  if (compareDate(from, to) > 0) return [];
  return eachDay(from, to);
}

/** Progress for a single habit in the week containing `date`. */
export function weeklyProgress(
  plan: Plan,
  habit: Habit,
  entries: EntryMap,
  date: ISODate,
): WeeklyProgress {
  const weekMonday = mondayOf(date);
  const goal = goalForWeek(habit, weekMonday);
  const frequencyGoal = adjustedFrequencyGoal(plan, habit, weekMonday);
  const days = planDaysInWeek(plan, weekMonday);

  let hitDays = 0;
  let amountActual = 0;
  for (const day of days) {
    const entry = getEntry(entries, habit.id, day);
    if (isDayHit(habit, entry, goal)) hitDays++;
    amountActual += entry?.amount ?? 0;
  }

  const result: WeeklyProgress = {
    weekMonday,
    activeDays: activePlanDaysInWeek(plan, weekMonday),
    frequencyGoal,
    hitDays,
    hasFrequencyGoal: frequencyGoal > 0,
  };

  if (habit.type !== 'done') {
    result.amount = {
      actual: amountActual,
      goal: adjustedWeeklyAmountGoal(plan, habit, weekMonday),
    };
  }
  return result;
}

export interface PaceMeasure {
  actual: number;
  due: number;
  status: PaceStatus;
}

export interface FullPlanPace {
  daysHit: PaceMeasure;
  /** Present only for number/time habits. */
  amount?: PaceMeasure;
}

function paceStatus(actual: number, due: number): PaceStatus {
  if (due <= EPSILON) return actual > EPSILON ? 'ahead' : 'no-goal';
  if (actual > due + EPSILON) return 'ahead';
  if (actual < due - EPSILON) return 'behind';
  return 'on-track';
}

/** Active plan days in [from, to] inclusive, clipped to the plan's date range. */
function activePlanDaysBetween(plan: Plan, from: ISODate, to: ISODate): number {
  const start = maxDate(from, plan.startDate);
  const end = minDate(to, plan.endDate);
  const count = diffDays(start, end) + 1;
  return count > 0 ? count : 0;
}

/**
 * Full-plan pace for one habit, measured from the plan start through `today`
 * (clamped to the plan end when the plan has finished).
 *
 * Target due accrues the goal at the pace it is earned: every fully-elapsed
 * week counts its whole adjusted goal, and the current in-progress week counts
 * only the fraction of its goal earned by the active days elapsed through
 * today. So a habit kept up day-by-day reads "On track" rather than "Behind"
 * just because the rest of the week has not happened yet. Actual sums every
 * valid entry in the elapsed range. Neither side is capped.
 */
export function fullPlanPace(
  plan: Plan,
  habit: Habit,
  entries: EntryMap,
  today: ISODate,
): FullPlanPace {
  const mondays = planWeekMondays(plan, today);

  let dueDaysHit = 0;
  let dueAmount = 0;
  for (const weekMonday of mondays) {
    const weekSunday = addDays(weekMonday, 6);
    // How far this week has actually progressed, clipped to the plan and today.
    const weekThrough = minDate(minDate(weekSunday, plan.endDate), today);
    const totalActive = activePlanDaysInWeek(plan, weekMonday);
    const elapsedActive = activePlanDaysBetween(plan, weekMonday, weekThrough);
    const fraction = totalActive > 0 ? elapsedActive / totalActive : 0;

    dueDaysHit += adjustedFrequencyGoal(plan, habit, weekMonday) * fraction;
    if (habit.type !== 'done') {
      dueAmount += adjustedWeeklyAmountGoal(plan, habit, weekMonday) * fraction;
    }
  }

  const rangeEnd = minDate(today, plan.endDate);
  let actualDaysHit = 0;
  let actualAmount = 0;
  if (compareDate(rangeEnd, plan.startDate) >= 0) {
    for (const day of eachDay(plan.startDate, rangeEnd)) {
      const goal = goalForWeek(habit, mondayOf(day));
      const entry = getEntry(entries, habit.id, day);
      if (isDayHit(habit, entry, goal)) actualDaysHit++;
      actualAmount += entry?.amount ?? 0;
    }
  }

  const pace: FullPlanPace = {
    daysHit: {
      actual: actualDaysHit,
      due: dueDaysHit,
      status: paceStatus(actualDaysHit, dueDaysHit),
    },
  };
  if (habit.type !== 'done') {
    pace.amount = {
      actual: actualAmount,
      due: dueAmount,
      status: paceStatus(actualAmount, dueAmount),
    };
  }
  return pace;
}

export const PACE_LABELS: Record<PaceStatus, string> = {
  ahead: 'Ahead',
  'on-track': 'On track',
  behind: 'Behind',
  'no-goal': 'No goal due',
};

/**
 * Total frequency-goal "sessions" for the whole plan: every plan week's
 * adjusted frequency goal, summed from the plan start through the plan end.
 * Partial first/final weeks use the same floor proration as everywhere else,
 * so this can be slightly below (weeks × frequency) when the plan starts or
 * ends mid-week.
 */
export function fullPlanSessionTarget(plan: Plan, habit: Habit): number {
  let total = 0;
  for (const weekMonday of eachWeekMonday(plan.startDate, plan.endDate)) {
    total += adjustedFrequencyGoal(plan, habit, weekMonday);
  }
  return total;
}

/**
 * Count of "hit" days for a habit from the plan start through today (clamped to
 * the plan end). This is the actual sessions done so far.
 */
export function sessionsDoneSoFar(
  plan: Plan,
  habit: Habit,
  entries: EntryMap,
  today: ISODate,
): number {
  const end = minDate(today, plan.endDate);
  if (compareDate(end, plan.startDate) < 0) return 0;
  let count = 0;
  for (const day of eachDay(plan.startDate, end)) {
    const goal = goalForWeek(habit, mondayOf(day));
    if (isDayHit(habit, getEntry(entries, habit.id, day), goal)) count++;
  }
  return count;
}

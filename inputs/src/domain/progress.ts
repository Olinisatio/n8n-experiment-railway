/**
 * Weekly progress and full-plan pace — the scoring heart of the app.
 *
 * All functions are pure: given a plan, a habit, the entries, and a reference
 * date they return numbers and labels. Progress is never capped at 100%: extra
 * work counts and can put a user ahead.
 */
import { addDays, compareDate, eachDay, minDate, mondayOf } from './dates';
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

/**
 * Full-plan pace for one habit, measured from the plan start through `today`
 * (clamped to the plan end when the plan has finished).
 *
 * Target due sums each plan week's adjusted goal, including the whole current
 * calendar week's goal — it is not prorated again by the current weekday.
 * Actual sums every valid entry in the elapsed range. Neither side is capped.
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
    dueDaysHit += adjustedFrequencyGoal(plan, habit, weekMonday);
    if (habit.type !== 'done') {
      dueAmount += adjustedWeeklyAmountGoal(plan, habit, weekMonday);
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

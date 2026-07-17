/**
 * Goal versioning and partial-week goal adjustment.
 *
 * A habit keeps a sorted list of goal versions. For any given week we use the
 * version whose `effectiveMonday` is the latest one on or before that week's
 * Monday, so editing a goal never rewrites the goals of past weeks.
 */
import { compareDate, mondayOf } from './dates';
import { activePlanDaysInWeek } from './plan';
import type { GoalVersion, Habit, ISODate, Plan } from './types';

/** The goal version that applies to the week beginning `weekMonday`. */
export function goalForWeek(habit: Habit, weekMonday: ISODate): GoalVersion {
  let chosen = habit.goalHistory[0]!;
  for (const version of habit.goalHistory) {
    if (compareDate(version.effectiveMonday, weekMonday) <= 0) {
      chosen = version;
    } else {
      break;
    }
  }
  return chosen;
}

/** The goal in effect right now (used for editing the "current" goal). */
export function currentGoal(habit: Habit, today: ISODate): GoalVersion {
  return goalForWeek(habit, mondayOf(today));
}

/**
 * The frequency goal for a partial week:
 *   floor(weeklyFrequency × activePlanDaysInWeek ÷ 7)
 * A full week (7 active days) yields the unmodified goal. The result can be 0.
 */
export function adjustedFrequencyGoal(plan: Plan, habit: Habit, weekMonday: ISODate): number {
  const goal = goalForWeek(habit, weekMonday);
  const activeDays = activePlanDaysInWeek(plan, weekMonday);
  return Math.floor((goal.weeklyFrequency * activeDays) / 7);
}

/**
 * The weekly amount target for a partial week, prorated by active days ÷ 7.
 * Full precision is kept; callers round only for display.
 */
export function adjustedWeeklyAmountGoal(plan: Plan, habit: Habit, weekMonday: ISODate): number {
  const goal = goalForWeek(habit, weekMonday);
  const weekly = goal.weeklyTarget ?? 0;
  const activeDays = activePlanDaysInWeek(plan, weekMonday);
  return (weekly * activeDays) / 7;
}

/**
 * Apply a goal change so it takes effect from the Monday of `today` (the
 * current week) forward. Past weeks are untouched. If a version already exists
 * for that Monday it is replaced. Returns a new goal history array.
 */
export function applyGoalChange(
  habit: Habit,
  today: ISODate,
  change: Omit<GoalVersion, 'effectiveMonday'>,
): GoalVersion[] {
  const effectiveMonday = mondayOf(today);
  const kept = habit.goalHistory.filter(
    (v) => compareDate(v.effectiveMonday, effectiveMonday) !== 0,
  );
  kept.push({ ...change, effectiveMonday });
  kept.sort((a, b) => compareDate(a.effectiveMonday, b.effectiveMonday));
  return kept;
}

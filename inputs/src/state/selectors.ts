/** Pure derived views over AppData for the UI. */
import { compareDate } from '../domain/dates';
import { hasPlanEnded, hasPlanStarted, isDateInPlan } from '../domain/plan';
import { fullPlanSessionTarget, sessionsDoneSoFar } from '../domain/progress';
import type { AppData, Habit, ISODate, Plan } from '../domain/types';

export type PlanStatus = 'future' | 'active' | 'ended' | 'archived';

export function planStatus(plan: Plan, today: ISODate): PlanStatus {
  if (plan.archived) return 'archived';
  if (!hasPlanStarted(plan, today)) return 'future';
  if (hasPlanEnded(plan, today)) return 'ended';
  return 'active';
}

/** Plans currently running today (started, not ended, not archived). */
export function activePlans(data: AppData, today: ISODate): Plan[] {
  return data.plans
    .filter((p) => planStatus(p, today) === 'active')
    .sort((a, b) => compareDate(a.startDate, b.startDate));
}

export function habitsForPlan(data: AppData, planId: string, includeArchived = false): Habit[] {
  return data.habits.filter((h) => h.planId === planId && (includeArchived || !h.archived));
}

export interface PlanSessionSummary {
  /** Sessions completed so far across all active habits in the plan. */
  done: number;
  /** Total target sessions for the whole plan (all weeks). */
  total: number;
  /** Percent complete (done / total × 100), or null when there is no target. */
  pct: number | null;
}

/**
 * Whole-plan "sessions" summary: total target sessions across the entire plan
 * (summed over its active habits' weekly frequency goals) and how many have
 * been done so far. For a single "x3/week" habit over 22 weeks this is the
 * 10/66 · 15% figure. Not capped — extra work can exceed 100%.
 */
export function planSessionSummary(data: AppData, plan: Plan, today: ISODate): PlanSessionSummary {
  let done = 0;
  let total = 0;
  for (const habit of habitsForPlan(data, plan.id)) {
    total += fullPlanSessionTarget(plan, habit);
    done += sessionsDoneSoFar(plan, habit, data.entries, today);
  }
  return { done, total, pct: total > 0 ? (done / total) * 100 : null };
}

export function planById(data: AppData, id: string): Plan | undefined {
  return data.plans.find((p) => p.id === id);
}

export function habitById(data: AppData, id: string): Habit | undefined {
  return data.habits.find((h) => h.id === id);
}

/** Active, non-archived plans that have ended but not yet been dealt with. */
export function endedUnhandledPlans(data: AppData, today: ISODate): Plan[] {
  return data.plans.filter((p) => !p.archived && !p.endHandled && hasPlanEnded(p, today));
}

export function sortedPlans(data: AppData, today: ISODate): Plan[] {
  const order: Record<PlanStatus, number> = { active: 0, future: 1, ended: 2, archived: 3 };
  return [...data.plans].sort((a, b) => {
    const d = order[planStatus(a, today)] - order[planStatus(b, today)];
    if (d !== 0) return d;
    return compareDate(b.startDate, a.startDate);
  });
}

export interface HistoryRow {
  date: ISODate;
  habit: Habit;
  plan: Plan;
  done?: boolean;
  amount?: number;
}

export interface HistoryGroup {
  date: ISODate;
  rows: HistoryRow[];
}

/** History grouped by date, newest first, optionally filtered by plan/habit. */
export function history(
  data: AppData,
  filter: { planId?: string; habitId?: string } = {},
): HistoryGroup[] {
  const habitMap = new Map(data.habits.map((h) => [h.id, h]));
  const planMap = new Map(data.plans.map((p) => [p.id, p]));
  const byDate = new Map<ISODate, HistoryRow[]>();

  for (const entry of Object.values(data.entries)) {
    const habit = habitMap.get(entry.habitId);
    if (!habit) continue;
    if (filter.habitId && habit.id !== filter.habitId) continue;
    const plan = planMap.get(habit.planId);
    if (!plan) continue;
    if (filter.planId && plan.id !== filter.planId) continue;
    if (!isDateInPlan(plan, entry.date)) continue;

    const row: HistoryRow = {
      date: entry.date,
      habit,
      plan,
      done: entry.done,
      amount: entry.amount,
    };
    const list = byDate.get(entry.date) ?? [];
    list.push(row);
    byDate.set(entry.date, list);
  }

  return [...byDate.entries()]
    .sort((a, b) => compareDate(b[0], a[0]))
    .map(([date, rows]) => ({
      date,
      rows: rows.sort((a, b) => a.habit.name.localeCompare(b.habit.name)),
    }));
}

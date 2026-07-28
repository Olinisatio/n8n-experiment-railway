/** Test data builders. */
import { mondayOf } from '../src/domain/dates';
import type { EntryMap, GoalVersion, Habit, ISODate, Plan } from '../src/domain/types';
import { entryKey } from '../src/domain/types';

let seq = 0;
const id = (prefix: string) => `${prefix}-${(seq += 1)}`;

export function makePlan(startDate: ISODate, endDate: ISODate, over: Partial<Plan> = {}): Plan {
  return {
    id: id('plan'),
    name: 'Test plan',
    startDate,
    endDate,
    archived: false,
    createdDate: startDate,
    ...over,
  };
}

export function makeHabit(plan: Plan, over: Partial<Habit> = {}): Habit {
  const goal: GoalVersion = {
    effectiveMonday: mondayOf(plan.startDate),
    weeklyFrequency: 4,
  };
  return {
    id: id('habit'),
    planId: plan.id,
    name: 'Test habit',
    type: 'done',
    createdDate: plan.startDate,
    goalHistory: [goal],
    archived: false,
    ...over,
  };
}

export function entries(
  ...items: { habitId: string; date: ISODate; done?: boolean; amount?: number }[]
): EntryMap {
  const map: EntryMap = {};
  for (const it of items) map[entryKey(it.habitId, it.date)] = it;
  return map;
}

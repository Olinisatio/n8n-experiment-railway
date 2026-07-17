/**
 * Development / test seed data. Never forced into a real user's app — the UI
 * only offers it as an explicit optional action, and tests build it directly.
 */
import { mondayOf } from './dates';
import { newId } from './format';
import type { AppData, Habit, ISODate, Plan } from './types';
import { CURRENT_SCHEMA_VERSION } from './types';

export function buildSeed(startDate: ISODate, endDate: ISODate): AppData {
  const planId = newId();
  const plan: Plan = {
    id: planId,
    name: 'Shreds McGee',
    startDate,
    endDate,
    archived: false,
    createdDate: startDate,
  };
  const monday = mondayOf(startDate);
  const habits: Habit[] = [
    {
      id: newId(),
      planId,
      name: 'Calories',
      type: 'number',
      unit: 'calories',
      weeklyCardDisplay: 'amount',
      createdDate: startDate,
      goalHistory: [
        { effectiveMonday: monday, weeklyFrequency: 7, dailyTarget: 1500, weeklyTarget: 10500 },
      ],
      archived: false,
    },
    {
      id: newId(),
      planId,
      name: 'Gym workout',
      type: 'done',
      createdDate: startDate,
      goalHistory: [{ effectiveMonday: monday, weeklyFrequency: 4 }],
      archived: false,
    },
    {
      id: newId(),
      planId,
      name: 'Cardio workout',
      type: 'done',
      createdDate: startDate,
      goalHistory: [{ effectiveMonday: monday, weeklyFrequency: 7 }],
      archived: false,
    },
  ];
  return { schemaVersion: CURRENT_SCHEMA_VERSION, plans: [plan], habits, entries: {} };
}

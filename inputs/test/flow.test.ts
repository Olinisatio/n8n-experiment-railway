import { describe, expect, it } from 'vitest';
import { reducer, type Action, type HabitDraft } from '../src/state/actions';
import { emptyData } from '../src/storage/schema';
import { parseBackup, serializeBackup } from '../src/storage/backup';
import { weeklyProgress, fullPlanPace } from '../src/domain/progress';
import type { AppData, Habit } from '../src/domain/types';

function run(state: AppData, ...actions: Action[]): AppData {
  return actions.reduce(reducer, state);
}

function habit(state: AppData, name: string): Habit {
  const h = state.habits.find((x) => x.name === name);
  if (!h) throw new Error(`habit ${name} not found`);
  return h;
}

describe('key user flow + past-day recalculation (rule 14)', () => {
  const doneDraft: HabitDraft = { name: 'Gym', type: 'done', weeklyFrequency: 4 };
  const numberDraft: HabitDraft = {
    name: 'Calories',
    type: 'number',
    unit: 'cal',
    weeklyCardDisplay: 'amount',
    weeklyFrequency: 7,
    dailyTarget: 1500,
    weeklyTarget: 10500,
  };
  const timeDraft: HabitDraft = {
    name: 'Cardio',
    type: 'time',
    weeklyFrequency: 5,
    dailyTarget: 30,
    weeklyTarget: 150,
  };

  it('creates a plan with each habit type anchored to the first week', () => {
    const state = run(emptyData(), {
      type: 'createPlan',
      plan: { name: 'Shreds McGee', startDate: '2026-07-13', endDate: '2026-08-09' },
      habits: [doneDraft, numberDraft, timeDraft],
    });
    expect(state.plans).toHaveLength(1);
    expect(state.habits.map((h) => h.type).sort()).toEqual(['done', 'number', 'time']);
    for (const h of state.habits) {
      expect(h.goalHistory[0]!.effectiveMonday).toBe('2026-07-13');
    }
  });

  it('runs create → log → edit-past → pace → backup → restore end to end', () => {
    let state = run(emptyData(), {
      type: 'createPlan',
      plan: { name: 'Shreds McGee', startDate: '2026-07-13', endDate: '2026-08-09' },
      habits: [doneDraft, numberDraft, timeDraft],
    });
    const plan = state.plans[0]!;
    const gym = habit(state, 'Gym');
    const cal = habit(state, 'Calories');
    const cardio = habit(state, 'Cardio');

    // Log today (Wed 15 Jul).
    state = run(
      state,
      { type: 'setDone', habitId: gym.id, date: '2026-07-15', done: true },
      { type: 'setAmount', habitId: cal.id, date: '2026-07-15', amount: 1500 },
      { type: 'setAmount', habitId: cardio.id, date: '2026-07-15', amount: 45 },
    );

    // Log a past day below the target, then edit it upward.
    state = run(state, { type: 'setAmount', habitId: cal.id, date: '2026-07-13', amount: 1000 });
    let wp = weeklyProgress(plan, cal, state.entries, '2026-07-15');
    expect(wp.hitDays).toBe(1); // only 15 Jul (1500) is a hit; 13 Jul (1000) is not
    expect(wp.amount?.actual).toBe(2500);

    // Edit the past day to clear the daily target → it becomes a hit and the
    // weekly amount recalculates.
    state = run(state, { type: 'setAmount', habitId: cal.id, date: '2026-07-13', amount: 2000 });
    wp = weeklyProgress(plan, cal, state.entries, '2026-07-15');
    expect(wp.hitDays).toBe(2);
    expect(wp.amount?.actual).toBe(3500);

    // Pace reflects the elapsed range (through Wed 15 Jul): 3 of 7 active days
    // elapsed, so the current week's goal is prorated by 3/7.
    const pace = fullPlanPace(plan, cal, state.entries, '2026-07-15');
    expect(pace.daysHit.actual).toBe(2);
    expect(pace.daysHit.due).toBeCloseTo(3, 6); // 7 * 3/7
    expect(pace.amount?.actual).toBe(3500);

    // Backup and restore round-trips the whole dataset.
    const restored = parseBackup(serializeBackup(state));
    expect(restored).toEqual(state);

    // Restoring into a fresh store yields identical data.
    const fresh = run(emptyData(), { type: 'replaceAll', data: restored });
    expect(fresh).toEqual(state);
  });

  it('deleting a plan removes its habits and entries', () => {
    let state = run(emptyData(), {
      type: 'createPlan',
      plan: { name: 'P', startDate: '2026-07-13', endDate: '2026-08-09' },
      habits: [numberDraft],
    });
    const cal = habit(state, 'Calories');
    state = run(state, { type: 'setAmount', habitId: cal.id, date: '2026-07-13', amount: 1500 });
    expect(Object.keys(state.entries)).toHaveLength(1);

    state = run(state, { type: 'deletePlan', id: state.plans[0]!.id });
    expect(state.plans).toHaveLength(0);
    expect(state.habits).toHaveLength(0);
    expect(Object.keys(state.entries)).toHaveLength(0);
  });
});

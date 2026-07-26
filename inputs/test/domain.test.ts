import { describe, expect, it } from 'vitest';
import {
  addDays,
  eachDay,
  fromOrdinal,
  mondayOf,
  toOrdinal,
  todayISO,
  weekdayMon0,
} from '../src/domain/dates';
import { adjustedFrequencyGoal } from '../src/domain/goals';
import { activePlanDaysInWeek, planDayNumber, planWeekNumber } from '../src/domain/plan';
import {
  fullPlanPace,
  fullPlanSessionTarget,
  sessionsDoneSoFar,
  weeklyProgress,
} from '../src/domain/progress';
import { applyGoalChange, goalForWeek } from '../src/domain/goals';
import { entries, makeHabit, makePlan } from './factories';

describe('local dates (rule 2, 15)', () => {
  it('weeks start on Monday', () => {
    expect(mondayOf('2026-07-15')).toBe('2026-07-13'); // Wed -> Mon
    expect(mondayOf('2026-07-13')).toBe('2026-07-13'); // Mon -> Mon
    expect(mondayOf('2026-07-19')).toBe('2026-07-13'); // Sun -> that week's Mon
    expect(weekdayMon0('2026-07-13')).toBe(0);
    expect(weekdayMon0('2026-07-19')).toBe(6);
  });

  it('ordinal round-trips and is timezone-independent', () => {
    for (const d of ['2000-01-01', '2026-03-29', '2026-12-31', '2024-02-29']) {
      expect(fromOrdinal(toOrdinal(d))).toBe(d);
    }
    // Adding days never shifts across a DST boundary (pure integer math).
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29');
    expect(addDays('2026-03-29', 1)).toBe('2026-03-30');
  });

  it('todayISO reads local components', () => {
    const d = new Date(2026, 6, 17, 23, 30); // 17 Jul 2026 local, late evening
    expect(todayISO(d)).toBe('2026-07-17');
  });
});

describe('plan day and week numbers (rule 1, 3)', () => {
  const plan = makePlan('2026-07-17', '2026-08-16'); // Friday start

  it('start date is Day 1', () => {
    expect(planDayNumber(plan, '2026-07-17')).toBe(1);
    expect(planDayNumber(plan, '2026-07-18')).toBe(2);
  });

  it('a Sunday start makes the next day Week 2', () => {
    const sun = makePlan('2026-07-19', '2026-08-16'); // Sunday start
    expect(planWeekNumber(sun, '2026-07-19')).toBe(1);
    expect(planWeekNumber(sun, '2026-07-20')).toBe(2); // next Monday
  });

  it('Friday start: Week 1 is the partial week, next Monday is Week 2', () => {
    expect(planWeekNumber(plan, '2026-07-17')).toBe(1);
    expect(planWeekNumber(plan, '2026-07-19')).toBe(1); // Sunday, still week 1
    expect(planWeekNumber(plan, '2026-07-20')).toBe(2); // Monday
  });
});

describe('inclusive ranges and active days (rule 4, 5, 6)', () => {
  it('inclusive end date is counted', () => {
    const plan = makePlan('2026-07-17', '2026-07-17'); // single day
    expect(eachDay(plan.startDate, plan.endDate)).toEqual(['2026-07-17']);
    expect(activePlanDaysInWeek(plan, '2026-07-13')).toBe(1);
  });

  it('partial first-week frequency goal uses floor rounding', () => {
    const plan = makePlan('2026-07-17', '2026-08-30'); // Fri..
    const habit = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: '2026-07-13', weeklyFrequency: 5 }],
    });
    // Active days in first week: Fri, Sat, Sun = 3. floor(5*3/7) = 2.
    expect(activePlanDaysInWeek(plan, '2026-07-13')).toBe(3);
    expect(adjustedFrequencyGoal(plan, habit, '2026-07-13')).toBe(2);
  });

  it('partial final-week goal clips to the plan end', () => {
    const plan = makePlan('2026-07-13', '2026-08-04'); // ends Tue 04 Aug
    const habit = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: '2026-07-13', weeklyFrequency: 7 }],
    });
    // Final week Monday 03 Aug: active days Mon+Tue = 2. floor(7*2/7)=2.
    expect(activePlanDaysInWeek(plan, '2026-08-03')).toBe(2);
    expect(adjustedFrequencyGoal(plan, habit, '2026-08-03')).toBe(2);
  });
});

describe('zero partial goal (rule 7)', () => {
  it('shows no goal due when the adjusted frequency is zero', () => {
    const plan = makePlan('2026-07-19', '2026-08-30'); // Sunday start: 1 active day in week 1
    const habit = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: '2026-07-13', weeklyFrequency: 5 }],
    });
    // floor(5 * 1 / 7) = 0
    expect(adjustedFrequencyGoal(plan, habit, '2026-07-13')).toBe(0);
    const wp = weeklyProgress(plan, habit, {}, '2026-07-19');
    expect(wp.hasFrequencyGoal).toBe(false);
  });
});

describe('number/time hit rules (rule 10, 11)', () => {
  const plan = makePlan('2026-07-13', '2026-08-16');
  const habit = makeHabit(plan, {
    type: 'number',
    unit: 'cal',
    weeklyCardDisplay: 'amount',
    goalHistory: [
      { effectiveMonday: '2026-07-13', weeklyFrequency: 7, dailyTarget: 1500, weeklyTarget: 10500 },
    ],
  });

  it('saves below-target amounts but does not mark the day hit', () => {
    const e = entries({ habitId: habit.id, date: '2026-07-13', amount: 1200 });
    const wp = weeklyProgress(plan, habit, e, '2026-07-13');
    expect(wp.hitDays).toBe(0);
    expect(wp.amount?.actual).toBe(1200); // still counted toward the weekly amount
  });

  it('marks the day hit at or above the daily target', () => {
    const e = entries({ habitId: habit.id, date: '2026-07-13', amount: 1500 });
    const wp = weeklyProgress(plan, habit, e, '2026-07-13');
    expect(wp.hitDays).toBe(1);
    expect(wp.amount?.actual).toBe(1500);
  });
});

describe('weekly progress is uncapped (rule 9)', () => {
  it('shows 6/4 without capping', () => {
    const plan = makePlan('2026-07-13', '2026-08-16');
    const habit = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: '2026-07-13', weeklyFrequency: 4 }],
    });
    const e = entries(
      ...['2026-07-13', '2026-07-14', '2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18'].map(
        (date) => ({ habitId: habit.id, date, done: true }),
      ),
    );
    const wp = weeklyProgress(plan, habit, e, '2026-07-13');
    expect(wp.hitDays).toBe(6);
    expect(wp.frequencyGoal).toBe(4);
  });
});

describe('full-plan pace (rule 8, 12)', () => {
  it('prorates the current week by active days elapsed through today', () => {
    // Product decision (overrides the original spec rule 8): the target due
    // reflects the goal earned by today, not the whole in-progress week.
    const plan = makePlan('2026-07-13', '2026-08-16'); // full weeks
    const habit = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: '2026-07-13', weeklyFrequency: 7 }],
    });
    // Wed of week 1: 3 of 7 active days elapsed → due = 7 * 3/7 = 3.
    const nothing = fullPlanPace(plan, habit, {}, '2026-07-15');
    expect(nothing.daysHit.due).toBeCloseTo(3, 6);
    expect(nothing.daysHit.actual).toBe(0);
    expect(nothing.daysHit.status).toBe('behind');

    // Kept up each elapsed day → on track, not behind.
    const e = entries(
      { habitId: habit.id, date: '2026-07-13', done: true },
      { habitId: habit.id, date: '2026-07-14', done: true },
      { habitId: habit.id, date: '2026-07-15', done: true },
    );
    const keptUp = fullPlanPace(plan, habit, e, '2026-07-15');
    expect(keptUp.daysHit.actual).toBe(3);
    expect(keptUp.daysHit.status).toBe('on-track');
  });

  it('a habit started and done today reads on track, not behind', () => {
    // The reported case: a plan opening on a Saturday (Sat+Sun partial week),
    // done today, should not show "Behind".
    const plan = makePlan('2026-07-18', '2026-09-30'); // Saturday start
    const habit = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: '2026-07-13', weeklyFrequency: 7 }],
    });
    const e = entries({ habitId: habit.id, date: '2026-07-18', done: true });
    const pace = fullPlanPace(plan, habit, e, '2026-07-18');
    // 1 of 2 active days elapsed; adjusted goal 2 → due = 2 * 1/2 = 1.
    expect(pace.daysHit.due).toBeCloseTo(1, 6);
    expect(pace.daysHit.actual).toBe(1);
    expect(pace.daysHit.status).toBe('on-track');
  });

  it('reports both amount pace and days-hit pace for number habits', () => {
    const plan = makePlan('2026-07-13', '2026-08-16');
    const habit = makeHabit(plan, {
      type: 'number',
      goalHistory: [
        {
          effectiveMonday: '2026-07-13',
          weeklyFrequency: 7,
          dailyTarget: 1000,
          weeklyTarget: 7000,
        },
      ],
    });
    const e = entries(
      { habitId: habit.id, date: '2026-07-13', amount: 1000 },
      { habitId: habit.id, date: '2026-07-14', amount: 2000 },
    );
    const pace = fullPlanPace(plan, habit, e, '2026-07-14');
    // Tue of week 1: 2 of 7 active days elapsed → due prorated by 2/7.
    expect(pace.daysHit.actual).toBe(2);
    expect(pace.daysHit.due).toBeCloseTo(2, 6); // 7 * 2/7
    expect(pace.amount?.actual).toBe(3000);
    expect(pace.amount?.due).toBeCloseTo(2000, 6); // 7000 * 2/7
    expect(pace.amount?.status).toBe('ahead'); // 3000 logged vs 2000 due
    expect(pace.daysHit.status).toBe('on-track'); // 2 done vs 2 due
  });

  it('extra work can put a habit ahead', () => {
    const plan = makePlan('2026-07-13', '2026-07-19'); // one full week
    const habit = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: '2026-07-13', weeklyFrequency: 4 }],
    });
    const e = entries(
      ...['2026-07-13', '2026-07-14', '2026-07-15', '2026-07-16', '2026-07-17'].map((date) => ({
        habitId: habit.id,
        date,
        done: true,
      })),
    );
    const pace = fullPlanPace(plan, habit, e, '2026-07-19');
    expect(pace.daysHit.actual).toBe(5);
    expect(pace.daysHit.due).toBe(4);
    expect(pace.daysHit.status).toBe('ahead');
  });
});

describe('goal versioning (rule 13)', () => {
  it('a goal edit changes the current and future weeks but not past weeks', () => {
    const plan = makePlan('2026-07-13', '2026-08-16');
    const base = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: '2026-07-13', weeklyFrequency: 4 }],
    });
    // Change the goal to 6 during the week of 20 Jul (a Monday).
    const newHistory = applyGoalChange(base, '2026-07-22', { weeklyFrequency: 6 });
    const habit = { ...base, goalHistory: newHistory };

    expect(goalForWeek(habit, '2026-07-13').weeklyFrequency).toBe(4); // past week unchanged
    expect(goalForWeek(habit, '2026-07-20').weeklyFrequency).toBe(6); // current week updated
    expect(goalForWeek(habit, '2026-07-27').weeklyFrequency).toBe(6); // future week updated
  });
});

describe('whole-plan session target and completion', () => {
  it('totals sessions across every full plan week (22 weeks × 3 = 66)', () => {
    const start = '2026-07-13'; // Monday
    const end = addDays(start, 22 * 7 - 1); // 22 full Mon–Sun weeks, inclusive
    const plan = makePlan(start, end);
    const habit = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: start, weeklyFrequency: 3 }],
    });
    expect(fullPlanSessionTarget(plan, habit)).toBe(66);
  });

  it('counts sessions done so far → 10/66 ≈ 15%', () => {
    const start = '2026-07-13';
    const end = addDays(start, 22 * 7 - 1);
    const plan = makePlan(start, end);
    const habit = makeHabit(plan, {
      goalHistory: [{ effectiveMonday: start, weeklyFrequency: 3 }],
    });
    // 10 done days within the plan range.
    const done = entries(
      ...Array.from({ length: 10 }, (_, i) => ({
        habitId: habit.id,
        date: addDays(start, i),
        done: true,
      })),
    );
    const total = fullPlanSessionTarget(plan, habit);
    const doneCount = sessionsDoneSoFar(plan, habit, done, end);
    expect(doneCount).toBe(10);
    expect(total).toBe(66);
    expect(Math.round((doneCount / total) * 100)).toBe(15);
  });
});

describe('overlapping active plans (rule 16)', () => {
  it('both plans are active on the same day', async () => {
    const { activePlans } = await import('../src/state/selectors');
    const a = makePlan('2026-07-01', '2026-07-31', { name: 'A' });
    const b = makePlan('2026-07-10', '2026-08-10', { name: 'B' });
    const data = { schemaVersion: 1, plans: [a, b], habits: [], entries: {} };
    const active = activePlans(data, '2026-07-17');
    expect(active.map((p) => p.name).sort()).toEqual(['A', 'B']);
  });
});

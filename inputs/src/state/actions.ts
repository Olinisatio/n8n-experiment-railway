/**
 * Pure reducer and action types for the app. Kept UI-free and pure so the state
 * transitions can be unit-tested directly.
 */
import { mondayOf, todayISO } from '../domain/dates';
import { applyGoalChange } from '../domain/goals';
import { newId } from '../domain/format';
import type { AppData, GoalVersion, Habit, ISODate, Plan, TrackingType } from '../domain/types';
import { entryKey } from '../domain/types';

export interface HabitDraft {
  name: string;
  type: TrackingType;
  unit?: string;
  weeklyCardDisplay?: 'days' | 'amount';
  weeklyFrequency: number;
  dailyTarget?: number;
  weeklyTarget?: number;
}

export interface PlanDraft {
  name: string;
  startDate: ISODate;
  endDate: ISODate;
}

export type Action =
  | { type: 'replaceAll'; data: AppData }
  | { type: 'createPlan'; plan: PlanDraft; habits: HabitDraft[] }
  | { type: 'updatePlan'; id: string; changes: PlanDraft }
  | { type: 'archivePlan'; id: string }
  | { type: 'restorePlan'; id: string }
  | { type: 'deletePlan'; id: string }
  | { type: 'extendPlan'; id: string; endDate: ISODate }
  | { type: 'copyPlan'; id: string; startDate: ISODate; endDate: ISODate }
  | { type: 'markPlanEndHandled'; id: string }
  | { type: 'addHabit'; planId: string; habit: HabitDraft; today: ISODate }
  | {
      type: 'updateHabitMeta';
      id: string;
      name: string;
      unit?: string;
      weeklyCardDisplay?: 'days' | 'amount';
    }
  | {
      type: 'changeHabitGoal';
      id: string;
      today: ISODate;
      change: Omit<GoalVersion, 'effectiveMonday'>;
    }
  | { type: 'archiveHabit'; id: string }
  | { type: 'restoreHabit'; id: string }
  | { type: 'deleteHabit'; id: string }
  | { type: 'setDone'; habitId: string; date: ISODate; done: boolean }
  | { type: 'setAmount'; habitId: string; date: ISODate; amount: number };

function habitFromDraft(planId: string, draft: HabitDraft, today: ISODate): Habit {
  const goal: GoalVersion = {
    effectiveMonday: mondayOf(today),
    weeklyFrequency: draft.weeklyFrequency,
    dailyTarget: draft.type === 'done' ? undefined : draft.dailyTarget,
    weeklyTarget: draft.type === 'done' ? undefined : draft.weeklyTarget,
  };
  return {
    id: newId(),
    planId,
    name: draft.name.trim(),
    type: draft.type,
    unit: draft.type === 'number' ? draft.unit?.trim() || undefined : undefined,
    weeklyCardDisplay: draft.type === 'done' ? undefined : (draft.weeklyCardDisplay ?? 'days'),
    createdDate: today,
    goalHistory: [goal],
    archived: false,
  };
}

export function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'replaceAll':
      return action.data;

    case 'createPlan': {
      const today = todayISO();
      const plan: Plan = {
        id: newId(),
        name: action.plan.name.trim(),
        startDate: action.plan.startDate,
        endDate: action.plan.endDate,
        archived: false,
        createdDate: today,
      };
      const effectiveMonday = mondayOf(plan.startDate);
      const habits = action.habits.map((draft) => {
        const h = habitFromDraft(plan.id, draft, today);
        // Anchor the first goal to the plan's first week, not "today".
        h.goalHistory = [{ ...h.goalHistory[0]!, effectiveMonday }];
        h.createdDate = plan.startDate;
        return h;
      });
      return { ...state, plans: [...state.plans, plan], habits: [...state.habits, ...habits] };
    }

    case 'updatePlan':
      return {
        ...state,
        plans: state.plans.map((p) =>
          p.id === action.id
            ? {
                ...p,
                name: action.changes.name.trim(),
                startDate: action.changes.startDate,
                endDate: action.changes.endDate,
              }
            : p,
        ),
      };

    case 'archivePlan':
      return {
        ...state,
        plans: state.plans.map((p) => (p.id === action.id ? { ...p, archived: true } : p)),
      };

    case 'restorePlan':
      return {
        ...state,
        plans: state.plans.map((p) =>
          p.id === action.id ? { ...p, archived: false, endHandled: undefined } : p,
        ),
      };

    case 'deletePlan': {
      const habitIds = new Set(state.habits.filter((h) => h.planId === action.id).map((h) => h.id));
      const entries = Object.fromEntries(
        Object.entries(state.entries).filter(([, e]) => !habitIds.has(e.habitId)),
      );
      return {
        ...state,
        plans: state.plans.filter((p) => p.id !== action.id),
        habits: state.habits.filter((h) => h.planId !== action.id),
        entries,
      };
    }

    case 'extendPlan':
      return {
        ...state,
        plans: state.plans.map((p) =>
          p.id === action.id ? { ...p, endDate: action.endDate, endHandled: true } : p,
        ),
      };

    case 'copyPlan': {
      const source = state.plans.find((p) => p.id === action.id);
      if (!source) return state;
      const newPlanId = newId();
      const newPlan: Plan = {
        id: newPlanId,
        name: `${source.name} (copy)`,
        startDate: action.startDate,
        endDate: action.endDate,
        archived: false,
        createdDate: todayISO(),
      };
      const effectiveMonday = mondayOf(action.startDate);
      const newHabits = state.habits
        .filter((h) => h.planId === source.id)
        .map((h) => {
          const latest = h.goalHistory[h.goalHistory.length - 1]!;
          const copy: Habit = {
            ...h,
            id: newId(),
            planId: newPlanId,
            createdDate: action.startDate,
            archived: false,
            goalHistory: [{ ...latest, effectiveMonday }],
          };
          return copy;
        });
      return {
        ...state,
        plans: [...state.plans, newPlan],
        habits: [...state.habits, ...newHabits],
      };
    }

    case 'markPlanEndHandled':
      return {
        ...state,
        plans: state.plans.map((p) => (p.id === action.id ? { ...p, endHandled: true } : p)),
      };

    case 'addHabit':
      return {
        ...state,
        habits: [...state.habits, habitFromDraft(action.planId, action.habit, action.today)],
      };

    case 'updateHabitMeta':
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.id
            ? {
                ...h,
                name: action.name.trim(),
                unit: h.type === 'number' ? action.unit?.trim() || undefined : h.unit,
                weeklyCardDisplay:
                  h.type === 'done' ? undefined : (action.weeklyCardDisplay ?? h.weeklyCardDisplay),
              }
            : h,
        ),
      };

    case 'changeHabitGoal':
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.id
            ? { ...h, goalHistory: applyGoalChange(h, action.today, action.change) }
            : h,
        ),
      };

    case 'archiveHabit':
      return {
        ...state,
        habits: state.habits.map((h) => (h.id === action.id ? { ...h, archived: true } : h)),
      };

    case 'restoreHabit':
      return {
        ...state,
        habits: state.habits.map((h) => (h.id === action.id ? { ...h, archived: false } : h)),
      };

    case 'deleteHabit': {
      const entries = Object.fromEntries(
        Object.entries(state.entries).filter(([, e]) => e.habitId !== action.id),
      );
      return { ...state, habits: state.habits.filter((h) => h.id !== action.id), entries };
    }

    case 'setDone': {
      const key = entryKey(action.habitId, action.date);
      const entries = { ...state.entries };
      if (action.done) {
        entries[key] = { habitId: action.habitId, date: action.date, done: true };
      } else {
        delete entries[key];
      }
      return { ...state, entries };
    }

    case 'setAmount': {
      const key = entryKey(action.habitId, action.date);
      const entries = { ...state.entries };
      if (action.amount > 0) {
        entries[key] = { habitId: action.habitId, date: action.date, amount: action.amount };
      } else {
        delete entries[key];
      }
      return { ...state, entries };
    }

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

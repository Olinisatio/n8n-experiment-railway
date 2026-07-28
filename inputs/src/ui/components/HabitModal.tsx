/** Add or edit a habit within an existing plan. Editing a goal applies the
 * change from the current week forward — past weeks keep their old goal. */
import { useState } from 'react';
import { todayISO } from '../../domain/dates';
import { currentGoal } from '../../domain/goals';
import type { Habit, TrackingType } from '../../domain/types';
import { useStore } from '../../state/store';
import { Field, Modal } from './common';

interface Draft {
  name: string;
  type: TrackingType;
  unit: string;
  weeklyCardDisplay: 'days' | 'amount';
  weeklyFrequency: number;
  dailyTarget?: number;
  weeklyTarget?: number;
}

function draftFromHabit(habit: Habit, today: string): Draft {
  const goal = currentGoal(habit, today);
  return {
    name: habit.name,
    type: habit.type,
    unit: habit.unit ?? '',
    weeklyCardDisplay: habit.weeklyCardDisplay ?? 'days',
    weeklyFrequency: goal.weeklyFrequency,
    dailyTarget: goal.dailyTarget,
    weeklyTarget: goal.weeklyTarget,
  };
}

export function HabitModal({
  planId,
  habit,
  onClose,
}: {
  planId: string;
  habit?: Habit;
  onClose: () => void;
}) {
  const { dispatch } = useStore();
  const today = todayISO();
  const isEdit = !!habit;
  const [d, setD] = useState<Draft>(() =>
    habit
      ? draftFromHabit(habit, today)
      : {
          name: '',
          type: 'done',
          unit: '',
          weeklyCardDisplay: 'days',
          weeklyFrequency: 4,
        },
  );
  const [submitted, setSubmitted] = useState(false);

  const error = !d.name.trim()
    ? 'Name this habit.'
    : d.weeklyFrequency < 1 || d.weeklyFrequency > 7
      ? 'Weekly goal is 1–7 days.'
      : d.type !== 'done' && (!d.dailyTarget || d.dailyTarget <= 0)
        ? 'Set a daily target above zero.'
        : d.type !== 'done' && (!d.weeklyTarget || d.weeklyTarget <= 0)
          ? 'Set a weekly target above zero.'
          : '';

  const set = (patch: Partial<Draft>) => setD((cur) => ({ ...cur, ...patch }));

  function save() {
    setSubmitted(true);
    if (error) return;
    if (isEdit && habit) {
      dispatch({
        type: 'updateHabitMeta',
        id: habit.id,
        name: d.name,
        unit: d.type === 'number' ? d.unit : undefined,
        weeklyCardDisplay: d.type === 'done' ? undefined : d.weeklyCardDisplay,
      });
      dispatch({
        type: 'changeHabitGoal',
        id: habit.id,
        today,
        change: {
          weeklyFrequency: d.weeklyFrequency,
          dailyTarget: d.type === 'done' ? undefined : d.dailyTarget,
          weeklyTarget: d.type === 'done' ? undefined : d.weeklyTarget,
        },
      });
    } else {
      dispatch({
        type: 'addHabit',
        planId,
        today,
        habit: {
          name: d.name,
          type: d.type,
          unit: d.type === 'number' ? d.unit : undefined,
          weeklyCardDisplay: d.type === 'done' ? undefined : d.weeklyCardDisplay,
          weeklyFrequency: d.weeklyFrequency,
          dailyTarget: d.type === 'done' ? undefined : d.dailyTarget,
          weeklyTarget: d.type === 'done' ? undefined : d.weeklyTarget,
        },
      });
    }
    onClose();
  }

  return (
    <Modal title={isEdit ? 'Edit habit' : 'Add habit'} onClose={onClose}>
      <Field label="Name" error={submitted ? (error && !d.name.trim() ? error : '') : ''}>
        <input value={d.name} onChange={(e) => set({ name: e.target.value })} />
      </Field>

      <Field label="Tracking type" hint={isEdit ? 'Type is fixed after creation.' : undefined}>
        <div className="seg" role="group" aria-label="Tracking type">
          {(['done', 'number', 'time'] as TrackingType[]).map((t) => (
            <button
              key={t}
              type="button"
              disabled={isEdit}
              className={d.type === t ? 'on' : ''}
              onClick={() => set({ type: t })}
            >
              {t === 'done' ? 'Done / not' : t === 'number' ? 'Number' : 'Time'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Weekly frequency (days/week)">
        <input
          type="number"
          min={1}
          max={7}
          value={d.weeklyFrequency}
          onChange={(e) => set({ weeklyFrequency: Math.round(Number(e.target.value)) })}
        />
      </Field>

      {d.type === 'number' ? (
        <Field label="Unit">
          <input
            value={d.unit}
            onChange={(e) => set({ unit: e.target.value })}
            placeholder="e.g. steps"
          />
        </Field>
      ) : null}

      {d.type !== 'done' ? (
        <>
          <div className="row" style={{ gap: 12 }}>
            <Field label={`Daily target${d.type === 'time' ? ' (min)' : ''}`}>
              <input
                type="number"
                min={0}
                value={d.dailyTarget ?? ''}
                onChange={(e) => set({ dailyTarget: Number(e.target.value) || undefined })}
              />
            </Field>
            <Field label={`Weekly target${d.type === 'time' ? ' (min)' : ''}`}>
              <input
                type="number"
                min={0}
                value={d.weeklyTarget ?? ''}
                onChange={(e) => set({ weeklyTarget: Number(e.target.value) || undefined })}
              />
            </Field>
          </div>
          <Field label="Weekly card shows">
            <select
              value={d.weeklyCardDisplay}
              onChange={(e) => set({ weeklyCardDisplay: e.target.value as 'days' | 'amount' })}
            >
              <option value="days">Days hit</option>
              <option value="amount">Amount progress</option>
            </select>
          </Field>
        </>
      ) : null}

      {submitted && error ? <div className="form-error">{error}</div> : null}

      <div className="btn-row" style={{ justifyContent: 'flex-end', marginTop: 6 }}>
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        <button className="btn primary" onClick={save}>
          {isEdit ? 'Save changes' : 'Add habit'}
        </button>
      </div>
    </Modal>
  );
}

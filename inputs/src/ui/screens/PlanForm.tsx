/** Create-plan flow: name, dates, and one or more habits, all on one page so
 * nothing is lost when the user scrolls back up. */
import { useState } from 'react';
import { compareDate, isValidISODate, todayISO } from '../../domain/dates';
import type { TrackingType } from '../../domain/types';
import type { HabitDraft, PlanDraft } from '../../state/actions';
import { useStore } from '../../state/store';
import { Field } from '../components/common';

interface DraftHabit extends HabitDraft {
  key: string;
}

let keySeq = 0;
function blankHabit(): DraftHabit {
  keySeq += 1;
  return {
    key: `h${keySeq}`,
    name: '',
    type: 'done',
    weeklyFrequency: 4,
    unit: '',
    dailyTarget: undefined,
    weeklyTarget: undefined,
    weeklyCardDisplay: 'days',
  };
}

export function PlanForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const { dispatch } = useStore();
  const today = todayISO();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState('');
  const [habits, setHabits] = useState<DraftHabit[]>([blankHabit()]);
  const [submitted, setSubmitted] = useState(false);

  const planErrors = {
    name: !name.trim() ? 'Give the plan a name.' : '',
    startDate: !isValidISODate(startDate) ? 'Pick a valid start date.' : '',
    endDate: !isValidISODate(endDate)
      ? 'Pick a valid end date.'
      : isValidISODate(startDate) && compareDate(endDate, startDate) < 0
        ? 'End date must be on or after the start date.'
        : '',
  };

  function habitError(h: DraftHabit): string {
    if (!h.name.trim()) return 'Name this habit.';
    if (h.weeklyFrequency < 1 || h.weeklyFrequency > 7) return 'Weekly goal is 1–7 days.';
    if (h.type !== 'done') {
      if (!h.dailyTarget || h.dailyTarget <= 0) return 'Set a daily target above zero.';
      if (!h.weeklyTarget || h.weeklyTarget <= 0) return 'Set a weekly target above zero.';
    }
    return '';
  }

  const habitErrors = habits.map(habitError);
  const hasErrors =
    Object.values(planErrors).some(Boolean) || habitErrors.some(Boolean) || habits.length === 0;

  function update(key: string, patch: Partial<DraftHabit>) {
    setHabits((list) => list.map((h) => (h.key === key ? { ...h, ...patch } : h)));
  }

  function submit() {
    setSubmitted(true);
    if (hasErrors) return;
    const plan: PlanDraft = { name, startDate, endDate };
    const drafts: HabitDraft[] = habits.map((h) => ({
      name: h.name,
      type: h.type,
      unit: h.type === 'number' ? h.unit : undefined,
      weeklyCardDisplay: h.type === 'done' ? undefined : h.weeklyCardDisplay,
      weeklyFrequency: h.weeklyFrequency,
      dailyTarget: h.type === 'done' ? undefined : h.dailyTarget,
      weeklyTarget: h.type === 'done' ? undefined : h.weeklyTarget,
    }));
    dispatch({ type: 'createPlan', plan, habits: drafts });
    onDone();
  }

  const show = (err: string) => (submitted ? err : '');

  return (
    <div className="app-main">
      <h1 className="screen-title">New plan</h1>

      <div className="card stack">
        <Field label="Plan name" htmlFor="plan-name" error={show(planErrors.name)}>
          <input
            id="plan-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer reset"
            className={show(planErrors.name) ? 'error-input' : ''}
          />
        </Field>
        <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Field label="Start (Day 1)" htmlFor="plan-start" error={show(planErrors.startDate)}>
              <input
                id="plan-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={show(planErrors.startDate) ? 'error-input' : ''}
              />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="End date" htmlFor="plan-end" error={show(planErrors.endDate)}>
              <input
                id="plan-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={show(planErrors.endDate) ? 'error-input' : ''}
              />
            </Field>
          </div>
        </div>
      </div>

      <h2 className="screen-title" style={{ fontSize: 18 }}>
        Habits
      </h2>
      <div className="stack">
        {habits.map((h, i) => (
          <HabitDraftEditor
            key={h.key}
            habit={h}
            error={show(habitErrors[i] ?? '')}
            canRemove={habits.length > 1}
            onChange={(patch) => update(h.key, patch)}
            onRemove={() => setHabits((list) => list.filter((x) => x.key !== h.key))}
          />
        ))}
      </div>

      <div className="btn-row" style={{ marginTop: 14 }}>
        <button className="btn" onClick={() => setHabits((l) => [...l, blankHabit()])}>
          + Add habit
        </button>
      </div>

      <div className="btn-row" style={{ marginTop: 22, justifyContent: 'flex-end' }}>
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn primary" onClick={submit}>
          Save plan
        </button>
      </div>
      {submitted && hasErrors ? (
        <p className="form-error" style={{ textAlign: 'right' }}>
          Fix the highlighted fields to save.
        </p>
      ) : null}
    </div>
  );
}

const TYPES: { value: TrackingType; label: string }[] = [
  { value: 'done', label: 'Done / not' },
  { value: 'number', label: 'Number' },
  { value: 'time', label: 'Time' },
];

function HabitDraftEditor({
  habit,
  error,
  canRemove,
  onChange,
  onRemove,
}: {
  habit: DraftHabit;
  error: string;
  canRemove: boolean;
  onChange: (patch: Partial<DraftHabit>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="card stack" style={{ gap: 10 }}>
      <div className="row spread">
        <input
          aria-label="Habit name"
          value={habit.name}
          placeholder="Habit name"
          onChange={(e) => onChange({ name: e.target.value })}
          className={`field-input ${error && !habit.name.trim() ? 'error-input' : ''}`}
          style={{ flex: 1 }}
        />
        {canRemove ? (
          <button className="btn ghost small" aria-label="Remove habit" onClick={onRemove}>
            Remove
          </button>
        ) : null}
      </div>

      <div className="row wrap" style={{ gap: 10 }}>
        <div className="seg" role="group" aria-label="Tracking type">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={habit.type === t.value ? 'on' : ''}
              onClick={() => onChange({ type: t.value })}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className="row" style={{ gap: 6, fontSize: 13 }}>
          <span className="muted">Days/week</span>
          <input
            className="field-input"
            style={{ width: 64 }}
            type="number"
            min={1}
            max={7}
            aria-label="Weekly frequency goal"
            value={habit.weeklyFrequency}
            onChange={(e) => onChange({ weeklyFrequency: Math.round(Number(e.target.value)) })}
          />
        </label>
      </div>

      {habit.type !== 'done' ? (
        <div className="row wrap" style={{ gap: 10 }}>
          {habit.type === 'number' ? (
            <label className="row" style={{ gap: 6, fontSize: 13 }}>
              <span className="muted">Unit</span>
              <input
                className="field-input"
                style={{ width: 120 }}
                aria-label="Unit"
                placeholder="e.g. steps"
                value={habit.unit ?? ''}
                onChange={(e) => onChange({ unit: e.target.value })}
              />
            </label>
          ) : null}
          <label className="row" style={{ gap: 6, fontSize: 13 }}>
            <span className="muted">Daily{habit.type === 'time' ? ' (min)' : ''}</span>
            <input
              className="field-input"
              style={{ width: 90 }}
              type="number"
              min={0}
              aria-label="Daily target"
              value={habit.dailyTarget ?? ''}
              onChange={(e) => onChange({ dailyTarget: Number(e.target.value) || undefined })}
            />
          </label>
          <label className="row" style={{ gap: 6, fontSize: 13 }}>
            <span className="muted">Weekly{habit.type === 'time' ? ' (min)' : ''}</span>
            <input
              className="field-input"
              style={{ width: 90 }}
              type="number"
              min={0}
              aria-label="Weekly target"
              value={habit.weeklyTarget ?? ''}
              onChange={(e) => onChange({ weeklyTarget: Number(e.target.value) || undefined })}
            />
          </label>
          <label className="row" style={{ gap: 6, fontSize: 13 }}>
            <span className="muted">Card</span>
            <select
              className="field-input"
              aria-label="Weekly card display"
              value={habit.weeklyCardDisplay}
              onChange={(e) => onChange({ weeklyCardDisplay: e.target.value as 'days' | 'amount' })}
            >
              <option value="days">Days hit</option>
              <option value="amount">Amount</option>
            </select>
          </label>
        </div>
      ) : null}

      {error ? <div className="form-error">{error}</div> : null}
    </div>
  );
}

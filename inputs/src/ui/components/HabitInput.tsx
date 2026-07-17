/** Fast per-habit input controls for a given date. */
import { useEffect, useState } from 'react';
import { dailyAmount, isDone } from '../../domain/entries';
import { formatAmount } from '../../domain/format';
import { useStore } from '../../state/store';
import type { Habit, ISODate } from '../../domain/types';

export function HabitInput({ habit, date }: { habit: Habit; date: ISODate }) {
  const { data, dispatch } = useStore();

  if (habit.type === 'done') {
    const on = isDone(data.entries, habit.id, date);
    return (
      <button
        type="button"
        className={`control-done ${on ? 'on' : ''}`}
        aria-pressed={on}
        onClick={() => dispatch({ type: 'setDone', habitId: habit.id, date, done: !on })}
      >
        <span className="box" aria-hidden="true">
          ✓
        </span>
        <span className="label">{on ? 'Done' : 'Mark done'}</span>
      </button>
    );
  }

  if (habit.type === 'time') {
    return <TimeInput habit={habit} date={date} />;
  }
  return <NumberInput habit={habit} date={date} />;
}

function NumberInput({ habit, date }: { habit: Habit; date: ISODate }) {
  const { data, dispatch } = useStore();
  const saved = dailyAmount(data.entries, habit.id, date);
  const [value, setValue] = useState(saved ? String(saved) : '');

  useEffect(() => {
    setValue(saved ? String(saved) : '');
  }, [saved, date]);

  const commit = () => {
    const n = Number(value);
    const amount = Number.isFinite(n) && n > 0 ? n : 0;
    dispatch({ type: 'setAmount', habitId: habit.id, date, amount });
    setValue(amount ? String(amount) : '');
  };

  return (
    <div className="amount-control">
      <input
        className="field-input"
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        aria-label={`${habit.name} amount${habit.unit ? ` in ${habit.unit}` : ''}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
      />
      {habit.unit ? <span className="unit-label">{habit.unit}</span> : null}
      <button type="button" className="btn small" onClick={commit}>
        Save
      </button>
      {saved > 0 ? (
        <span className="faint" style={{ fontSize: 12.5 }}>
          Today: {formatAmount(habit, saved)}
        </span>
      ) : null}
    </div>
  );
}

function TimeInput({ habit, date }: { habit: Habit; date: ISODate }) {
  const { data, dispatch } = useStore();
  const saved = dailyAmount(data.entries, habit.id, date);
  const [h, setH] = useState(saved ? String(Math.floor(saved / 60)) : '');
  const [m, setM] = useState(saved ? String(saved % 60) : '');

  useEffect(() => {
    setH(saved ? String(Math.floor(saved / 60)) : '');
    setM(saved ? String(saved % 60) : '');
  }, [saved, date]);

  const commit = () => {
    const hours = Math.max(0, Math.floor(Number(h) || 0));
    const mins = Math.max(0, Math.floor(Number(m) || 0));
    const total = hours * 60 + mins;
    dispatch({ type: 'setAmount', habitId: habit.id, date, amount: total });
  };

  return (
    <div className="amount-control">
      <input
        className="field-input"
        type="number"
        inputMode="numeric"
        min={0}
        aria-label={`${habit.name} hours`}
        value={h}
        onChange={(e) => setH(e.target.value)}
        onBlur={commit}
      />
      <span className="unit-label">h</span>
      <input
        className="field-input"
        type="number"
        inputMode="numeric"
        min={0}
        max={59}
        aria-label={`${habit.name} minutes`}
        value={m}
        onChange={(e) => setM(e.target.value)}
        onBlur={commit}
      />
      <span className="unit-label">m</span>
      <button type="button" className="btn small" onClick={commit}>
        Save
      </button>
      {saved > 0 ? (
        <span className="faint" style={{ fontSize: 12.5 }}>
          Today: {formatAmount(habit, saved)}
        </span>
      ) : null}
    </div>
  );
}

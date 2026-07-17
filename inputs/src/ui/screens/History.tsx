/** History as a dated list (not a calendar), newest first, filterable, with
 * inline editing of any past day. */
import { useMemo, useState } from 'react';
import { formatLong } from '../../domain/dates';
import { formatAmount } from '../../domain/format';
import type { Habit, ISODate } from '../../domain/types';
import { history } from '../../state/selectors';
import { useStore } from '../../state/store';
import { HabitInput } from '../components/HabitInput';
import { Modal } from '../components/common';

export function History() {
  const { data } = useStore();
  const [planId, setPlanId] = useState('');
  const [habitId, setHabitId] = useState('');
  const [editing, setEditing] = useState<{ habit: Habit; date: ISODate } | null>(null);

  const habitOptions = useMemo(
    () => data.habits.filter((h) => !planId || h.planId === planId),
    [data.habits, planId],
  );

  const groups = useMemo(
    () =>
      history(data, {
        planId: planId || undefined,
        habitId: habitId || undefined,
      }),
    [data, planId, habitId],
  );

  return (
    <div className="app-main">
      <h1 className="screen-title">History</h1>

      <div className="card row wrap" style={{ gap: 10 }}>
        <label className="row" style={{ gap: 6, fontSize: 13 }}>
          <span className="muted">Plan</span>
          <select
            className="field-input"
            value={planId}
            onChange={(e) => {
              setPlanId(e.target.value);
              setHabitId('');
            }}
          >
            <option value="">All plans</option>
            {data.plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="row" style={{ gap: 6, fontSize: 13 }}>
          <span className="muted">Habit</span>
          <select
            className="field-input"
            value={habitId}
            onChange={(e) => setHabitId(e.target.value)}
          >
            <option value="">All habits</option>
            {habitOptions.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {groups.length === 0 ? (
        <div className="card muted" style={{ marginTop: 14 }}>
          Nothing logged yet. Entries you save on Today will appear here.
        </div>
      ) : (
        <div style={{ marginTop: 8 }}>
          {groups.map((group) => (
            <div className="history-day" key={group.date}>
              <h3>{formatLong(group.date)}</h3>
              {group.rows.map((row) => (
                <button
                  key={row.habit.id + row.date}
                  className="history-row"
                  style={{ width: '100%', textAlign: 'left' }}
                  onClick={() => setEditing({ habit: row.habit, date: row.date })}
                >
                  <span>
                    <span style={{ fontWeight: 600 }}>{row.habit.name}</span>{' '}
                    <span className="faint" style={{ fontSize: 12 }}>
                      {row.plan.name}
                    </span>
                  </span>
                  <span className="value">
                    {row.habit.type === 'done'
                      ? row.done
                        ? 'Done ✓'
                        : '—'
                      : formatAmount(row.habit, row.amount ?? 0)}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {editing ? (
        <Modal
          title={`${editing.habit.name} · ${formatLong(editing.date)}`}
          onClose={() => setEditing(null)}
        >
          <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
            Editing this past day recalculates every affected score. Set it to zero / unchecked to
            clear the day.
          </p>
          <HabitInput habit={editing.habit} date={editing.date} />
          <div className="btn-row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
            <button className="btn primary" onClick={() => setEditing(null)}>
              Done
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

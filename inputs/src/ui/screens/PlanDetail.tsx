/** A single plan's habits, weekly progress, and full-plan results. */
import { useState } from 'react';
import { formatLong, todayISO } from '../../domain/dates';
import { planDayNumber, planWeekNumber } from '../../domain/plan';
import type { Habit } from '../../domain/types';
import { habitsForPlan, planById, planStatus } from '../../state/selectors';
import { useStore } from '../../state/store';
import { ConfirmDialog } from '../components/common';
import { HabitModal } from '../components/HabitModal';
import { HabitStats } from '../components/HabitStats';
import { EditPlanModal } from '../components/PlanModals';

export function PlanDetail({ planId, onBack }: { planId: string; onBack: () => void }) {
  const { data, dispatch } = useStore();
  const today = todayISO();
  const plan = planById(data, planId);
  const [editingPlan, setEditingPlan] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [deleteHabit, setDeleteHabit] = useState<Habit | null>(null);

  if (!plan) {
    return (
      <div className="app-main">
        <button className="btn small" onClick={onBack}>
          ← Back
        </button>
        <p className="muted">This plan no longer exists.</p>
      </div>
    );
  }

  const status = planStatus(plan, today);
  const activeHabits = habitsForPlan(data, plan.id);
  const archivedHabits = habitsForPlan(data, plan.id, true).filter((h) => h.archived);
  // Reference date for stats: today if within the plan, else the plan end.
  const refDate = status === 'future' ? plan.startDate : status === 'ended' ? plan.endDate : today;

  return (
    <div className="app-main">
      <button className="btn small" onClick={onBack} style={{ marginBottom: 12 }}>
        ← Back to plans
      </button>

      <div className="card stack">
        <div className="row spread">
          <h1 className="screen-title" style={{ margin: 0 }}>
            {plan.name}
          </h1>
          <span className={`chip status-${status}`}>{status}</span>
        </div>
        <div className="faint" style={{ fontSize: 13 }}>
          {formatLong(plan.startDate)} → {formatLong(plan.endDate)}
        </div>
        {status === 'active' ? (
          <div className="chip" style={{ alignSelf: 'flex-start' }}>
            Day {planDayNumber(plan, today)} · Week {planWeekNumber(plan, today)}
          </div>
        ) : null}
        <div className="btn-row">
          <button className="btn small" onClick={() => setEditingPlan(true)}>
            Edit plan
          </button>
          <button className="btn small primary" onClick={() => setAddOpen(true)}>
            + Add habit
          </button>
        </div>
      </div>

      <h2 className="screen-title" style={{ fontSize: 18 }}>
        Habits
      </h2>
      {activeHabits.length === 0 ? (
        <div className="card muted">No habits yet. Add one to start tracking.</div>
      ) : (
        <div className="stack">
          {activeHabits.map((habit) => (
            <div className="card habit" key={habit.id}>
              <div className="habit-head">
                <div>
                  <div className="habit-name">{habit.name}</div>
                  <div className="habit-sub">
                    {habit.type === 'done'
                      ? 'Done / not done'
                      : habit.type === 'time'
                        ? 'Time'
                        : `Number${habit.unit ? ` · ${habit.unit}` : ''}`}
                  </div>
                </div>
                <div className="btn-row">
                  <button className="btn ghost small" onClick={() => setEditHabit(habit)}>
                    Edit
                  </button>
                  <button
                    className="btn ghost small"
                    onClick={() => dispatch({ type: 'archiveHabit', id: habit.id })}
                  >
                    Archive
                  </button>
                  <button className="btn ghost small danger" onClick={() => setDeleteHabit(habit)}>
                    Delete
                  </button>
                </div>
              </div>
              <HabitStats plan={plan} habit={habit} entries={data.entries} date={refDate} />
            </div>
          ))}
        </div>
      )}

      {archivedHabits.length > 0 ? (
        <>
          <h2 className="screen-title" style={{ fontSize: 16, color: 'var(--text-faint)' }}>
            Archived habits
          </h2>
          <div className="stack">
            {archivedHabits.map((habit) => (
              <div className="card row spread" key={habit.id}>
                <span className="muted">{habit.name}</span>
                <div className="btn-row">
                  <button
                    className="btn ghost small"
                    onClick={() => dispatch({ type: 'restoreHabit', id: habit.id })}
                  >
                    Restore
                  </button>
                  <button className="btn ghost small danger" onClick={() => setDeleteHabit(habit)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {editingPlan ? <EditPlanModal plan={plan} onClose={() => setEditingPlan(false)} /> : null}
      {addOpen ? <HabitModal planId={plan.id} onClose={() => setAddOpen(false)} /> : null}
      {editHabit ? (
        <HabitModal planId={plan.id} habit={editHabit} onClose={() => setEditHabit(null)} />
      ) : null}
      {deleteHabit ? (
        <ConfirmDialog
          title="Delete habit?"
          message={
            <>
              This permanently removes <strong>{deleteHabit.name}</strong> and all its logged
              history. This cannot be undone.
            </>
          }
          confirmLabel="Delete permanently"
          danger
          onCancel={() => setDeleteHabit(null)}
          onConfirm={() => {
            dispatch({ type: 'deleteHabit', id: deleteHabit.id });
            setDeleteHabit(null);
          }}
        />
      ) : null}
    </div>
  );
}

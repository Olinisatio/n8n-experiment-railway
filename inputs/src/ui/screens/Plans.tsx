/** Plans list: active, future, ended, and archived, with state-appropriate
 * actions. */
import { useState } from 'react';
import { formatShort, todayISO } from '../../domain/dates';
import type { Plan } from '../../domain/types';
import {
  habitsForPlan,
  planSessionSummary,
  planStatus,
  sortedPlans,
  type PlanStatus,
} from '../../state/selectors';
import { useStore } from '../../state/store';
import { ConfirmDialog } from '../components/common';
import { CopyPlanModal, EditPlanModal } from '../components/PlanModals';

const STATUS_LABEL: Record<PlanStatus, string> = {
  active: 'Active',
  future: 'Upcoming',
  ended: 'Ended',
  archived: 'Archived',
};

export function Plans({
  onNewPlan,
  onOpenPlan,
}: {
  onNewPlan: () => void;
  onOpenPlan: (id: string) => void;
}) {
  const { data, dispatch } = useStore();
  const today = todayISO();
  const plans = sortedPlans(data, today);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [copying, setCopying] = useState<Plan | null>(null);
  const [deleting, setDeleting] = useState<Plan | null>(null);

  return (
    <div className="app-main">
      <div className="row spread" style={{ margin: '6px 2px 14px' }}>
        <h1 className="screen-title" style={{ margin: 0 }}>
          Plans
        </h1>
        <button className="btn primary small" onClick={onNewPlan}>
          + New plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="empty">
          <div className="lead">Track what moves the needle.</div>
          <p className="muted" style={{ maxWidth: 320 }}>
            Create a plan, add a few daily habits, and log them in seconds each day.
          </p>
          <button className="btn primary" onClick={onNewPlan}>
            Create your first plan
          </button>
          <p className="tagline">Your life reflects your inputs.</p>
        </div>
      ) : (
        <div className="stack">
          {plans.map((plan) => {
            const status = planStatus(plan, today);
            const habitCount = habitsForPlan(data, plan.id).length;
            const summary = planSessionSummary(data, plan, today);
            return (
              <div className="card stack" key={plan.id} style={{ gap: 10 }}>
                <div className="row spread">
                  <button
                    className="btn ghost"
                    style={{
                      padding: 0,
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: 16,
                      minHeight: 'auto',
                    }}
                    onClick={() => onOpenPlan(plan.id)}
                  >
                    {plan.name}
                  </button>
                  <span className={`chip status-${status}`}>{STATUS_LABEL[status]}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div className="faint" style={{ fontSize: 13 }}>
                    {formatShort(plan.startDate)} – {formatShort(plan.endDate)} · {habitCount} habit
                    {habitCount === 1 ? '' : 's'}
                  </div>
                  {summary.pct !== null ? (
                    <div style={{ fontSize: 13 }}>
                      <span className="value" style={{ fontWeight: 600 }}>
                        {summary.done}/{summary.total} sessions
                      </span>{' '}
                      <span className="muted">· {Math.round(summary.pct)}% of plan</span>
                    </div>
                  ) : null}
                </div>
                <div className="btn-row">
                  <button className="btn small" onClick={() => onOpenPlan(plan.id)}>
                    View
                  </button>
                  {status !== 'archived' ? (
                    <button className="btn small" onClick={() => setEditing(plan)}>
                      Edit
                    </button>
                  ) : null}
                  <button className="btn small" onClick={() => setCopying(plan)}>
                    Copy
                  </button>
                  {status === 'archived' ? (
                    <button
                      className="btn small"
                      onClick={() => dispatch({ type: 'restorePlan', id: plan.id })}
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      className="btn small"
                      onClick={() => dispatch({ type: 'archivePlan', id: plan.id })}
                    >
                      Archive
                    </button>
                  )}
                  <button className="btn small danger" onClick={() => setDeleting(plan)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing ? <EditPlanModal plan={editing} onClose={() => setEditing(null)} /> : null}
      {copying ? <CopyPlanModal plan={copying} onClose={() => setCopying(null)} /> : null}
      {deleting ? (
        <ConfirmDialog
          title="Delete plan?"
          message={
            <>
              This permanently deletes <strong>{deleting.name}</strong>, its habits, and all logged
              history. This cannot be undone.
            </>
          }
          confirmLabel="Delete permanently"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            dispatch({ type: 'deletePlan', id: deleting.id });
            setDeleting(null);
          }}
        />
      ) : null}
    </div>
  );
}

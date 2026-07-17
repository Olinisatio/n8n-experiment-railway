/** Shown when an active plan has ended: archive, extend, copy, or leave. */
import { useState } from 'react';
import { addDays, compareDate, isValidISODate, todayISO } from '../../domain/dates';
import type { Plan } from '../../domain/types';
import { useStore } from '../../state/store';
import { Field, Modal } from './common';

export function EndedPlanPrompt({ plan }: { plan: Plan }) {
  const { dispatch } = useStore();
  const [mode, setMode] = useState<'choose' | 'extend' | 'copy'>('choose');
  const today = todayISO();
  const [extendEnd, setExtendEnd] = useState(addDays(today, 30));
  const [copyStart, setCopyStart] = useState(today);
  const [copyEnd, setCopyEnd] = useState(addDays(today, 30));

  if (mode === 'choose') {
    return (
      <Modal
        title={`"${plan.name}" has ended`}
        onClose={() => dispatch({ type: 'markPlanEndHandled', id: plan.id })}
      >
        <p className="muted" style={{ marginTop: 0 }}>
          This plan finished on {plan.endDate}. What would you like to do?
        </p>
        <div className="stack" style={{ gap: 8 }}>
          <button className="btn primary" onClick={() => setMode('extend')}>
            Extend it
          </button>
          <button className="btn" onClick={() => setMode('copy')}>
            Copy into a new plan
          </button>
          <button className="btn" onClick={() => dispatch({ type: 'archivePlan', id: plan.id })}>
            Archive it
          </button>
          <button
            className="btn ghost"
            onClick={() => dispatch({ type: 'markPlanEndHandled', id: plan.id })}
          >
            Leave as is
          </button>
        </div>
      </Modal>
    );
  }

  if (mode === 'extend') {
    const err =
      !isValidISODate(extendEnd) || compareDate(extendEnd, plan.endDate) <= 0
        ? 'Pick a date after the current end date.'
        : '';
    return (
      <Modal title="Extend plan" onClose={() => setMode('choose')}>
        <Field label="New end date" error={err}>
          <input type="date" value={extendEnd} onChange={(e) => setExtendEnd(e.target.value)} />
        </Field>
        <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => setMode('choose')}>
            Back
          </button>
          <button
            className="btn primary"
            disabled={!!err}
            onClick={() => dispatch({ type: 'extendPlan', id: plan.id, endDate: extendEnd })}
          >
            Extend
          </button>
        </div>
      </Modal>
    );
  }

  // copy
  const copyErr =
    !isValidISODate(copyStart) || !isValidISODate(copyEnd) || compareDate(copyEnd, copyStart) < 0
      ? 'Pick a valid start and end.'
      : '';
  return (
    <Modal title="Copy into a new plan" onClose={() => setMode('choose')}>
      <div className="row" style={{ gap: 12 }}>
        <Field label="Start">
          <input type="date" value={copyStart} onChange={(e) => setCopyStart(e.target.value)} />
        </Field>
        <Field label="End" error={copyErr}>
          <input type="date" value={copyEnd} onChange={(e) => setCopyEnd(e.target.value)} />
        </Field>
      </div>
      <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn" onClick={() => setMode('choose')}>
          Back
        </button>
        <button
          className="btn primary"
          disabled={!!copyErr}
          onClick={() => {
            dispatch({ type: 'copyPlan', id: plan.id, startDate: copyStart, endDate: copyEnd });
            dispatch({ type: 'markPlanEndHandled', id: plan.id });
          }}
        >
          Create copy
        </button>
      </div>
    </Modal>
  );
}

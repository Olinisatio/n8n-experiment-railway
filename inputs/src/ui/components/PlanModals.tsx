/** Modals for editing a plan's meta and for copying a plan to new dates. */
import { useState } from 'react';
import { addDays, compareDate, isValidISODate } from '../../domain/dates';
import type { Plan } from '../../domain/types';
import { useStore } from '../../state/store';
import { Field, Modal } from './common';

export function EditPlanModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const { dispatch } = useStore();
  const [name, setName] = useState(plan.name);
  const [startDate, setStartDate] = useState(plan.startDate);
  const [endDate, setEndDate] = useState(plan.endDate);

  const errors = {
    name: !name.trim() ? 'Give the plan a name.' : '',
    startDate: !isValidISODate(startDate) ? 'Pick a valid start date.' : '',
    endDate: !isValidISODate(endDate)
      ? 'Pick a valid end date.'
      : isValidISODate(startDate) && compareDate(endDate, startDate) < 0
        ? 'End must be on or after start.'
        : '',
  };
  const invalid = Object.values(errors).some(Boolean);

  return (
    <Modal title="Edit plan" onClose={onClose}>
      <Field label="Name" error={errors.name}>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <div className="row" style={{ gap: 12 }}>
        <Field label="Start (Day 1)" error={errors.startDate}>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="End" error={errors.endDate}>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
      </div>
      <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn primary"
          disabled={invalid}
          onClick={() => {
            dispatch({ type: 'updatePlan', id: plan.id, changes: { name, startDate, endDate } });
            onClose();
          }}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

export function CopyPlanModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const { dispatch } = useStore();
  const [startDate, setStartDate] = useState(plan.startDate);
  const [endDate, setEndDate] = useState(plan.endDate);

  const err =
    !isValidISODate(startDate) || !isValidISODate(endDate) || compareDate(endDate, startDate) < 0
      ? 'Pick a valid start and end.'
      : '';

  return (
    <Modal title={`Copy "${plan.name}"`} onClose={onClose}>
      <p className="muted" style={{ marginTop: 0 }}>
        Creates a new plan with the same habits and goals on fresh dates.
      </p>
      <div className="row" style={{ gap: 12 }}>
        <Field label="Start">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="End" error={err}>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
      </div>
      <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn" onClick={() => setEndDate(addDays(startDate, 29))}>
          4 weeks
        </button>
        <button
          className="btn primary"
          disabled={!!err}
          onClick={() => {
            dispatch({ type: 'copyPlan', id: plan.id, startDate, endDate });
            onClose();
          }}
        >
          Create copy
        </button>
      </div>
    </Modal>
  );
}

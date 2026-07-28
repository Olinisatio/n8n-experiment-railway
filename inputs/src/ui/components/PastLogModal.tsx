/** Back-fill a habit on a past date: pick a date within the plan (no future),
 * then log it with the habit's normal control. */
import { useState } from 'react';
import { compareDate, formatLong, isValidISODate, isWithin, minDate, todayISO } from '../../domain/dates';
import type { Habit, Plan } from '../../domain/types';
import { HabitInput } from './HabitInput';
import { Field, Modal } from './common';

export function PastLogModal({
  plan,
  habit,
  onClose,
}: {
  plan: Plan;
  habit: Habit;
  onClose: () => void;
}) {
  const today = todayISO();
  // The most recent date you can log: today, but never past the plan's end.
  const latest = minDate(today, plan.endDate);
  const hasRange = compareDate(latest, plan.startDate) >= 0;
  const [date, setDate] = useState(hasRange ? latest : plan.startDate);
  const valid = isValidISODate(date) && isWithin(date, plan.startDate, latest);

  return (
    <Modal title={`${habit.name} · add a past session`} onClose={onClose}>
      {!hasRange ? (
        <p className="muted" style={{ marginTop: 0 }}>
          This plan hasn&rsquo;t started yet, so there are no past dates to log.
        </p>
      ) : (
        <>
          <Field
            label="Date"
            htmlFor="past-date"
            hint={`Any date from ${formatLong(plan.startDate)} to ${formatLong(latest)}. Future dates aren't allowed.`}
            error={valid ? '' : 'Pick a date within the plan (no future dates).'}
          >
            <input
              id="past-date"
              type="date"
              value={date}
              min={plan.startDate}
              max={latest}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>

          {valid ? (
            <Field label={`Log for ${formatLong(date)}`}>
              {/* Keyed by date so the control resets when the date changes. */}
              <HabitInput key={date} habit={habit} date={date} />
            </Field>
          ) : null}
        </>
      )}

      <div className="btn-row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
        <button className="btn primary" onClick={onClose}>
          Done
        </button>
      </div>
    </Modal>
  );
}

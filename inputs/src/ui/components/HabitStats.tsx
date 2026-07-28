/** Weekly progress + full-plan pace display, shared by Today and Plan detail. */
import { formatAmount, formatPercent } from '../../domain/format';
import { fullPlanPace, weeklyProgress } from '../../domain/progress';
import type { EntryMap, Habit, ISODate, Plan } from '../../domain/types';
import { PaceBadge, ProgressBar } from './common';

export function HabitStats({
  plan,
  habit,
  entries,
  date,
}: {
  plan: Plan;
  habit: Habit;
  entries: EntryMap;
  date: ISODate;
}) {
  const weekly = weeklyProgress(plan, habit, entries, date);
  const pace = fullPlanPace(plan, habit, entries, date);
  const showAmount = habit.type !== 'done';
  const cardByAmount = showAmount && habit.weeklyCardDisplay === 'amount';

  return (
    <div className="stack" style={{ gap: 10 }}>
      {/* Weekly progress */}
      <div className="progress">
        {cardByAmount && weekly.amount ? (
          <>
            <div className="progress-line">
              <span className="muted">This week</span>
              <span className="value">
                {formatAmount(habit, weekly.amount.actual)} /{' '}
                {formatAmount(habit, weekly.amount.goal)}
                {'  '}
                <span className="faint">
                  {formatPercent(weekly.amount.actual, weekly.amount.goal)}
                </span>
              </span>
            </div>
            <ProgressBar actual={weekly.amount.actual} goal={weekly.amount.goal} />
          </>
        ) : weekly.hasFrequencyGoal ? (
          <>
            <div className="progress-line">
              <span className="muted">This week</span>
              <span className="value">
                {weekly.hitDays}/{weekly.frequencyGoal} days
              </span>
            </div>
            <ProgressBar actual={weekly.hitDays} goal={weekly.frequencyGoal} />
          </>
        ) : (
          <div className="progress-line">
            <span className="muted">This week</span>
            <span className="faint">No goal due</span>
          </div>
        )}
      </div>

      {/* Full-plan pace */}
      <div className="row wrap" style={{ gap: 12, fontSize: 12.5 }}>
        <span className="row" style={{ gap: 6 }}>
          <span className="faint">Plan</span>
          <span className="value" style={{ fontWeight: 600 }}>
            {pace.daysHit.actual}/{Math.round(pace.daysHit.due)} days
          </span>
          <PaceBadge status={pace.daysHit.status} />
        </span>
        {showAmount && pace.amount ? (
          <span className="row" style={{ gap: 6 }}>
            <span className="value" style={{ fontWeight: 600 }}>
              {formatAmount(habit, pace.amount.actual)} / {formatAmount(habit, pace.amount.due)}
            </span>
            <PaceBadge status={pace.amount.status} />
          </span>
        ) : null}
      </div>
    </div>
  );
}

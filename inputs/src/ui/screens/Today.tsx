/** The default screen: log every active plan's habits for today. */
import { formatLong, todayISO } from '../../domain/dates';
import { planDayNumber, planWeekNumber } from '../../domain/plan';
import { activePlans, endedUnhandledPlans, habitsForPlan } from '../../state/selectors';
import { useStore } from '../../state/store';
import { EndedPlanPrompt } from '../components/EndedPlanPrompt';
import { HabitInput } from '../components/HabitInput';
import { HabitStats } from '../components/HabitStats';

export function Today({ onNewPlan }: { onNewPlan: () => void }) {
  const { data } = useStore();
  const today = todayISO();
  const plans = activePlans(data, today);
  const ended = endedUnhandledPlans(data, today);

  if (data.plans.length === 0) {
    return (
      <div className="app-main">
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
      </div>
    );
  }

  return (
    <div className="app-main">
      {ended.length > 0 ? <EndedPlanPrompt plan={ended[0]!} /> : null}

      <div className="row spread" style={{ margin: '6px 2px 16px' }}>
        <div>
          <div className="screen-title" style={{ margin: 0 }}>
            Today
          </div>
          <div className="faint" style={{ fontSize: 13 }}>
            {formatLong(today)}
          </div>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            No active plans today. Start a new one or check the Plans tab for upcoming and past
            plans.
          </p>
          <div className="btn-row" style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={onNewPlan}>
              New plan
            </button>
          </div>
        </div>
      ) : (
        plans.map((plan) => {
          const habits = habitsForPlan(data, plan.id);
          return (
            <section className="plan-group" key={plan.id}>
              <div className="plan-group-head">
                <h2>{plan.name}</h2>
                <span className="chip">
                  Day {planDayNumber(plan, today)} · Week {planWeekNumber(plan, today)}
                </span>
              </div>
              {habits.length === 0 ? (
                <div className="card muted">No habits in this plan yet.</div>
              ) : (
                <div className="stack">
                  {habits.map((habit) => (
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
                      </div>
                      <HabitInput habit={habit} date={today} />
                      <HabitStats plan={plan} habit={habit} entries={data.entries} date={today} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}

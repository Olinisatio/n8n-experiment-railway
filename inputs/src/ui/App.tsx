/** App shell: navigation, routing, and the undo toast. */
import { useState } from 'react';
import { useAuth } from '../state/auth';
import { useStore } from '../state/store';
import { History } from './screens/History';
import { PlanDetail } from './screens/PlanDetail';
import { PlanForm } from './screens/PlanForm';
import { Plans } from './screens/Plans';
import { Settings } from './screens/Settings';
import { Today } from './screens/Today';

type Tab = 'today' | 'plans' | 'history' | 'settings';
type Route = { name: Tab } | { name: 'new-plan' } | { name: 'plan'; id: string };

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'today', label: 'Today', icon: '◎' },
  { key: 'plans', label: 'Plans', icon: '▦' },
  { key: 'history', label: 'History', icon: '≣' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
];

export function App() {
  const { canUndo, undo, undoLabel } = useStore();
  const { account, logOut } = useAuth();
  const [route, setRoute] = useState<Route>({ name: 'today' });
  const activeTab: Tab =
    route.name === 'plan' || route.name === 'new-plan' ? 'plans' : (route.name as Tab);

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          Inputs
          <small>Your life reflects your inputs.</small>
        </div>
        {account ? (
          <div className="account-badge">
            <span className="account-email" title={account.email}>
              {account.email}
            </span>
            <button className="btn ghost small" onClick={logOut}>
              Switch account
            </button>
          </div>
        ) : null}
      </div>

      {route.name === 'today' && <Today onNewPlan={() => setRoute({ name: 'new-plan' })} />}
      {route.name === 'plans' && (
        <Plans
          onNewPlan={() => setRoute({ name: 'new-plan' })}
          onOpenPlan={(id) => setRoute({ name: 'plan', id })}
        />
      )}
      {route.name === 'history' && <History />}
      {route.name === 'settings' && <Settings />}
      {route.name === 'new-plan' && (
        <PlanForm
          onDone={() => setRoute({ name: 'plans' })}
          onCancel={() => setRoute({ name: 'plans' })}
        />
      )}
      {route.name === 'plan' && (
        <PlanDetail planId={route.id} onBack={() => setRoute({ name: 'plans' })} />
      )}

      {canUndo ? (
        <div className="toast" role="status">
          <span>Saved</span>
          <button onClick={undo}>{undoLabel}</button>
        </div>
      ) : null}

      <nav className="bottom-nav" aria-label="Primary">
        <div className="inner">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`nav-item ${activeTab === t.key ? 'on' : ''}`}
              aria-current={activeTab === t.key ? 'page' : undefined}
              onClick={() => setRoute({ name: t.key })}
            >
              <span className="ico" aria-hidden="true">
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './ui/App';
import { AuthScreen } from './ui/screens/AuthScreen';
import { AuthProvider, useAuth } from './state/auth';
import { StoreProvider } from './state/store';

/** Gate: show the login screen until signed in, then the app scoped to the
 * signed-in account. Keying StoreProvider by account id remounts it (and its
 * data) when the account changes. */
// eslint-disable-next-line react-refresh/only-export-components -- entry file, not hot-reloaded.
function Root() {
  const { account } = useAuth();
  if (!account) return <AuthScreen />;
  return (
    <StoreProvider key={account.id} accountId={account.id}>
      <App />
    </StoreProvider>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </StrictMode>,
);

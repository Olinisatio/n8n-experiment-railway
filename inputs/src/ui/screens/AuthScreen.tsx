/** Login / sign-up gate shown when no one is signed in. Browser-only auth. */
import { useState } from 'react';
import { useAuth } from '../../state/auth';
import { Field } from '../components/common';

type Mode = 'login' | 'signup';

export function AuthScreen() {
  const { logIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result =
        mode === 'signup' ? await signUp(email, password) : await logIn(email, password);
      if (!result.ok) setError(result.error);
      // On success the app re-renders into the signed-in view automatically.
    } finally {
      setBusy(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
  }

  return (
    <div className="auth">
      <div className="auth-card card">
        <div className="brand" style={{ textAlign: 'center' }}>
          Inputs
          <small>Your life reflects your inputs.</small>
        </div>

        <div className="seg auth-tabs" role="tablist" aria-label="Login or sign up">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'on' : ''}
            onClick={() => switchMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={mode === 'signup' ? 'on' : ''}
            onClick={() => switchMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          <Field label="Email" htmlFor="auth-email">
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Field
            label="Password"
            htmlFor="auth-password"
            hint={mode === 'signup' ? 'At least 6 characters.' : undefined}
          >
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </Field>

          {error ? (
            <div className="form-error" role="alert" style={{ marginBottom: 10 }}>
              {error}
            </div>
          ) : null}

          <button type="submit" className="btn primary" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="faint auth-switch">
          {mode === 'login' ? (
            <>
              New here?{' '}
              <button type="button" className="linklike" onClick={() => switchMode('signup')}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="linklike" onClick={() => switchMode('login')}>
                Log in
              </button>
            </>
          )}
        </p>

        <p className="faint auth-note">
          Accounts and data are stored only in this browser — there's no server, and they don't sync
          to other devices. Back up your data from Settings to keep it safe.
        </p>
      </div>
    </div>
  );
}

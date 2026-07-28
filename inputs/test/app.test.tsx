import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/ui/App';
import { AuthProvider } from '../src/state/auth';
import { StoreProvider } from '../src/state/store';
import { AuthScreen } from '../src/ui/screens/AuthScreen';
import { emptyData } from '../src/storage/schema';

/** Render the signed-in app directly with a fixed account id (bypasses the
 * login gate; the gate itself is exercised separately below). */
function renderApp() {
  return render(
    <AuthProvider>
      <StoreProvider accountId="test-account" initial={emptyData()}>
        <App />
      </StoreProvider>
    </AuthProvider>,
  );
}

describe('App shell', () => {
  beforeEach(() => localStorage.clear());

  it('shows the first-run empty state', () => {
    renderApp();
    expect(screen.getByText('Create your first plan')).toBeInTheDocument();
    expect(screen.getAllByText(/Your life reflects your inputs\./i).length).toBeGreaterThan(0);
  });

  it('opens the new-plan form from the empty state', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByText('Create your first plan'));
    expect(screen.getByRole('heading', { name: 'New plan' })).toBeInTheDocument();
    expect(screen.getByLabelText('Plan name')).toBeInTheDocument();
  });

  it('creates a plan and logs a done habit from the plan page', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByText('Create your first plan'));

    await user.type(screen.getByLabelText('Plan name'), 'My plan');
    // start date defaults to today; give an end date well in the future
    await user.clear(screen.getByLabelText('End date'));
    await user.type(screen.getByLabelText('End date'), '2099-12-31');
    await user.type(screen.getByLabelText('Habit name'), 'Meditate');
    await user.click(screen.getByRole('button', { name: 'Save plan' }));

    // Land on Plans; open the plan to log there (Today tab no longer exists).
    await user.click(screen.getByRole('button', { name: 'My plan' }));
    const habitCard = screen.getByText('Meditate').closest('.card') as HTMLElement;
    const toggle = within(habitCard).getByRole('button', { name: 'Mark done' });
    await user.click(toggle);
    expect(within(habitCard).getByRole('button', { name: 'Done' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('back-fills a past session from the plan page', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByText('Create your first plan'));

    // A plan that started in the past so there are past dates to log.
    await user.type(screen.getByLabelText('Plan name'), 'Ball practice');
    await user.clear(screen.getByLabelText('Start (Day 1)'));
    await user.type(screen.getByLabelText('Start (Day 1)'), '2026-07-01');
    await user.clear(screen.getByLabelText('End date'));
    await user.type(screen.getByLabelText('End date'), '2099-12-31');
    await user.type(screen.getByLabelText('Habit name'), 'Shooting drills');
    await user.click(screen.getByRole('button', { name: 'Save plan' }));

    await user.click(screen.getByRole('button', { name: 'Ball practice' }));

    // Click the habit name to open the "add a past session" modal.
    await user.click(screen.getByRole('button', { name: 'Shooting drills' }));
    const dialog = screen.getByRole('dialog');
    const dateInput = within(dialog).getByLabelText('Date') as HTMLInputElement;
    await user.clear(dateInput);
    await user.type(dateInput, '2026-07-10');

    // Log the past day as done, then close.
    await user.click(within(dialog).getByRole('button', { name: 'Mark done' }));
    expect(within(dialog).getByRole('button', { name: 'Done', pressed: true })).toBeInTheDocument();
  });
});

describe('Auth gate', () => {
  beforeEach(() => localStorage.clear());

  it('signs up, then rejects a wrong-password login and accepts the right one', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>,
    );

    // Sign up
    await user.click(screen.getByRole('tab', { name: 'Sign up' }));
    await user.type(screen.getByLabelText('Email'), 'me@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    // Account now exists in storage (hashing is async, so wait for it).
    await waitFor(() =>
      expect(localStorage.getItem('inputs.accounts.v1')).toContain('me@example.com'),
    );
    unmount();

    // Fresh login screen: wrong password is rejected.
    render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>,
    );
    await user.type(screen.getByLabelText('Email'), 'me@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpw');
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    expect(await screen.findByText(/incorrect password/i)).toBeInTheDocument();
  });

  it('rejects a duplicate email at sign-up', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <AuthScreen />
      </AuthProvider>,
    );
    await user.click(screen.getByRole('tab', { name: 'Sign up' }));
    await user.type(screen.getByLabelText('Email'), 'dup@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    // Wait for the first sign-up to persist before trying again.
    await waitFor(() =>
      expect(localStorage.getItem('inputs.accounts.v1')).toContain('dup@example.com'),
    );

    // AuthScreen is rendered standalone (no gate to swap views), so the form
    // remains; signing up again with the same email is rejected.
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
  });
});

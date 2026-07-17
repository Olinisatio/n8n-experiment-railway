import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/ui/App';
import { StoreProvider } from '../src/state/store';
import { emptyData } from '../src/storage/schema';

function renderApp() {
  return render(
    <StoreProvider initial={emptyData()}>
      <App />
    </StoreProvider>,
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

  it('creates a plan and logs a done habit on Today', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByText('Create your first plan'));

    await user.type(screen.getByLabelText('Plan name'), 'My plan');
    // start date defaults to today; give an end date well in the future
    await user.clear(screen.getByLabelText('End date'));
    await user.type(screen.getByLabelText('End date'), '2099-12-31');
    await user.type(screen.getByLabelText('Habit name'), 'Meditate');
    await user.click(screen.getByRole('button', { name: 'Save plan' }));

    // Land on Plans; open Today via the nav.
    await user.click(screen.getByRole('button', { name: /Today/ }));
    const habitCard = screen.getByText('Meditate').closest('.card') as HTMLElement;
    const toggle = within(habitCard).getByRole('button', { name: 'Mark done' });
    await user.click(toggle);
    expect(within(habitCard).getByRole('button', { name: 'Done' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

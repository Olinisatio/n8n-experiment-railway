# Inputs

A fast, calm, mobile-first habit tracker. **Your life reflects your inputs.**

Inputs is a single-user web app with no account, backend, cloud sync, reminders,
or PWA install. All data lives in your browser's local storage, with JSON backup
and restore so you can protect and move it.

## Features

- **Plans** with inclusive start/end dates. Day 1 is the start date; weeks run
  Monday–Sunday, and the partial week containing the start is Week 1.
- **Habits** of three kinds: done / not-done, number (e.g. steps, calories), and
  time (stored as minutes). Each has a weekly frequency goal and, for
  number/time, daily and weekly amount targets.
- **Partial-week goals** are lowered automatically:
  `floor(weeklyFrequency × activeDays ÷ 7)` for frequency, prorated by
  `activeDays ÷ 7` for amounts.
- **Versioned goals** — editing a goal changes the current and future weeks only;
  past weeks keep the goal that applied at the time.
- **Weekly progress** and **full-plan pace** per habit (Ahead / On track /
  Behind), never capped at 100% — extra work counts.
- **Today**, **Plans**, **History** (a dated list with past-day editing), and
  **Settings** (backup, restore, delete-all).
- Overlapping active plans, undo on logging, and safe restore that validates a
  backup before ever touching your current data.

## Getting started

```bash
cd inputs
npm install
npm run dev      # start the dev server (Vite prints the local URL)
```

Open the printed URL (defaults to http://localhost:5173). On first run, choose
**Create your first plan**. There is also an optional sample plan under
**Settings** when no plans exist.

## Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the development server        |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Preview the production build        |
| `npm test`          | Run the unit and integration tests  |
| `npm run typecheck` | Type-check without emitting         |
| `npm run lint`      | Lint the source                     |
| `npm run format`    | Format with Prettier                |

## Architecture

- `src/domain/` — pure, UI-free logic: local-date math (`dates.ts`), plan/week
  math (`plan.ts`), goal versioning and partial-week adjustment (`goals.ts`),
  and weekly/full-plan scoring (`progress.ts`). All calculations keep full
  precision and use local calendar dates, so nothing shifts across time zones.
- `src/storage/` — a versioned, validated repository over `localStorage`
  (`repository.ts`, `schema.ts`) and backup export/restore (`backup.ts`).
- `src/state/` — a pure reducer (`actions.ts`), React store binding with undo
  (`store.tsx`), and derived selectors (`selectors.ts`).
- `src/ui/` — screens and components.

Tests live in `test/` and cover every risky rule (date/week math, partial and
zero goals, uncapped progress, hit thresholds, goal versioning, past-day
recalculation, timezone stability, backup round-trip, and invalid-backup
safety) plus the full create → log → edit → back-up → restore flow.

## Data & privacy

Everything stays in this browser. Nothing is sent anywhere. Use **Settings →
Download backup** regularly if the data matters to you; clearing browser storage
erases it.

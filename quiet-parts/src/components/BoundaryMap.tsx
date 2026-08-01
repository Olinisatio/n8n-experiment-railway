'use client';

import { useEffect, useRef, useState } from 'react';
import { Results } from '@/components/Results';
import { getDimension } from '@/data/dimensions';
import type { Answers, Result } from '@/data/types';
import { scale, scoreDimension } from '@/data/types';
import { capture } from '@/lib/analytics';

type Stage = 'name' | 'questions' | 'results';

/**
 * Quick-picks. The label is what the chip says; the value is what gets
 * substituted into the statements, which is why "A friend" becomes
 * "my friend" — "I agree with A friend" does not read like English.
 */
const QUICK_PICKS: { label: string; value: string | null }[] = [
  { label: 'Mum', value: 'Mum' },
  { label: 'Dad', value: 'Dad' },
  { label: 'Partner', value: 'my partner' },
  { label: 'Boss', value: 'my boss' },
  { label: 'A friend', value: 'my friend' },
  // null clears the field and hands it back to the user.
  { label: 'Someone else', value: null },
];

const ADVANCE_MS = 250;

/**
 * The Boundary Map.
 *
 * All state lives here, in React, and nowhere else. There is no localStorage,
 * no sessionStorage, no cookie and no network call carrying an answer — a
 * refresh genuinely loses everything, which is what the page promises.
 *
 * `intro` and `essay` are server-rendered nodes handed in from the page. They
 * are hidden with CSS rather than unmounted during the question flow, so the
 * H1 and the body copy are in the HTML for crawlers at every stage.
 *
 * The dimension arrives as a slug rather than an object because a `Dimension`
 * is mostly functions, and functions cannot cross the server/client boundary.
 */
export function BoundaryMap({
  slug,
  intro,
  essay,
}: {
  slug: string;
  intro: React.ReactNode;
  essay: React.ReactNode;
}) {
  const dimension = getDimension(slug);
  const [stage, setStage] = useState<Stage>('name');
  const [person, setPerson] = useState('');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => Array(8).fill(null));
  /** Every completed run this session, oldest first. */
  const [history, setHistory] = useState<Result[]>([]);
  const [runCount, setRunCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A pending auto-advance must not fire after the user has navigated away.
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const trimmedPerson = person.trim();
  const statements = dimension.statements(trimmedPerson || 'them');

  function begin() {
    if (!trimmedPerson) return;
    capture(runCount === 0 ? 'inventory_started' : 'second_person_started');
    setRunCount((count) => count + 1);
    setAnswers(Array(8).fill(null));
    setIndex(0);
    setStage('questions');
  }

  function answer(value: (typeof scale)[number]['value']) {
    if (advanceTimer.current) return; // mid-advance; ignore a double tap

    const next: Answers = [...answers];
    next[index] = value;
    setAnswers(next);

    // The selected state is visible for a beat before the screen changes —
    // an instant jump reads as a glitch rather than a response.
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      if (index < statements.length - 1) {
        setIndex(index + 1);
        return;
      }
      setHistory((previous) => [...previous, scoreDimension(dimension, trimmedPerson, next)]);
      capture('inventory_completed');
      setStage('results');
    }, ADVANCE_MS);
  }

  function goBack() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    if (index === 0) {
      setStage('name');
      return;
    }
    setIndex(index - 1);
  }

  function runAgain() {
    setPerson('');
    setAnswers(Array(8).fill(null));
    setIndex(0);
    setStage('name');
  }

  // Move focus to the new heading on every stage change so the flow is
  // followable on a screen reader and the phone keyboard closes.
  useEffect(() => {
    if (stage === 'name') {
      inputRef.current?.focus({ preventScroll: true });
    } else {
      headingRef.current?.focus({ preventScroll: true });
    }
    if (stage !== 'questions') window.scrollTo({ top: 0, behavior: 'auto' });
  }, [stage]);

  // Hidden with CSS, never unmounted: the H1 and the body copy stay in the
  // DOM at every stage. The essay comes back for the results, where it is the
  // natural next thing to read; only the question flow gets the page to itself.
  const introClass = stage === 'name' ? '' : 'tucked';
  const essayClass = stage === 'questions' ? 'tucked' : '';
  const current = history[history.length - 1];

  return (
    <>
      <div className={introClass}>{intro}</div>

      {stage === 'name' ? (
        <section className="shell name-step drift screen-only" aria-labelledby="qp-who">
          <div className="card-raised name-card">
            <h2 id="qp-who" className="display-md">
              Who is this about?
            </h2>
            <p className="ink-soft small who-help">
              One person. It works best on whoever came to mind first.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                begin();
              }}
            >
              <label className="visually-hidden" htmlFor="qp-person">
                Their name, or what you call them
              </label>
              <input
                id="qp-person"
                ref={inputRef}
                className="field"
                type="text"
                autoComplete="off"
                maxLength={40}
                placeholder="Their name, or what you call them"
                value={person}
                onChange={(event) => setPerson(event.target.value)}
              />

              <div className="chips" role="group" aria-label="Quick picks">
                {QUICK_PICKS.map((pick) => (
                  <button
                    key={pick.label}
                    type="button"
                    className="chip"
                    aria-pressed={pick.value !== null && person === pick.value}
                    onClick={() => {
                      setPerson(pick.value ?? '');
                      inputRef.current?.focus();
                    }}
                  >
                    {pick.label}
                  </button>
                ))}
              </div>

              <button className="btn begin" type="submit" disabled={!trimmedPerson}>
                Begin
              </button>
            </form>
          </div>

          {/* Handwritten accent — one of only three on the page. */}
          <p className="hand margin-note name-note">the harder one tells you more</p>
        </section>
      ) : null}

      {stage === 'questions' ? (
        <section className="stage screen-only" aria-label="Eight statements">
          <div className="shell stage-inner">
            <div className="stage-top">
              <div className="progress" aria-hidden="true">
                <i style={{ width: `${((index + 1) / statements.length) * 100}%` }} />
              </div>
              <div className="stage-meta">
                <button type="button" className="back" onClick={goBack}>
                  <span aria-hidden="true">←</span> Back
                </button>
                <span className="small ink-soft" aria-live="polite">
                  {index + 1} of {statements.length}
                </span>
              </div>
            </div>

            <div className="stage-body" key={index}>
              <h2 ref={headingRef} tabIndex={-1} className="q-statement drift">
                {statements[index]}
              </h2>

              <div className="options drift drift-1" role="group" aria-label={statements[index]}>
                {scale.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="option"
                    data-selected={answers[index] === option.value}
                    onClick={() => answer(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="small ink-soft stage-foot">
              Answer for how it is with {trimmedPerson}, not in general.
            </p>
          </div>
        </section>
      ) : null}

      {stage === 'results' && current ? (
        <section className="shell results-block" aria-label="Your result">
          <h2 ref={headingRef} tabIndex={-1} className="visually-hidden">
            Your result for {current.person}
          </h2>
          <Results result={current} history={history} onRunAgain={runAgain} />
        </section>
      ) : null}

      <div className={essayClass}>{essay}</div>
    </>
  );
}

'use client';

import { EmailCapture } from '@/components/EmailCapture';
import { PrintSheet } from '@/components/PrintSheet';
import { HandRule, ScriptRule } from '@/components/Texture';
import type { Result } from '@/data/types';
import { capture } from '@/lib/analytics';

/**
 * The results screen. Typographic only — no charts, no bars, no radar, no
 * percentages, and the total is never shown. The band heading does the work
 * that a graph would do on a worse version of this page.
 *
 * `history` is every completed run this session, oldest first, including the
 * one being displayed.
 */
export function Results({
  result,
  history,
  onRunAgain,
}: {
  result: Result;
  history: Result[];
  onRunAgain: () => void;
}) {
  const { person, band, subPattern } = result;

  function onDownload() {
    capture('worksheet_downloaded');
    window.print();
  }

  return (
    <div className={`band-${band.tone}`}>
      <div className="screen-only">
        <section className="drift">
          <p className="eyebrow">Setting Boundaries · {person}</p>
          <h2 className="pull-quote">{band.heading(person)}</h2>

          {band.body(person).map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </section>

        <HandRule />

        <section className="drift drift-1">
          <p className="eyebrow">The pattern underneath</p>
          <h3 className="display-md pattern-name">{subPattern.name}</h3>
          <p className="ink-soft pattern-tagline">{subPattern.tagline}</p>
          <p>{subPattern.paragraph(person)}</p>
        </section>

        <section className="drift drift-2 scripts-block">
          <div className="scripts-head">
            <h3 className="display-md">What you could say</h3>
            {/* Handwritten accent — one of only three on the page. */}
            <span className="hand margin-note">say one out loud first</span>
          </div>

          <div className="script-list">
            <ScriptRule />
            {subPattern.scripts.map((script) => (
              <p className="script" key={script.line}>
                “{script.line}”
                {script.note ? <span className="script-note">{script.note}</span> : null}
              </p>
            ))}
          </div>

          <p className="expect">
            <strong>Expect:</strong> {subPattern.expect(person)}
          </p>
        </section>

        {history.length > 1 ? <Comparison history={history} /> : null}

        <HandRule />

        <section className="drift drift-3 actions">
          <button className="btn" type="button" onClick={onDownload}>
            Download your worksheet
          </button>
          <button className="btn btn-quiet" type="button" onClick={onRunAgain}>
            Run this for someone else
          </button>
        </section>

        <p className="small ink-soft signpost">
          If reading this has stirred something up, talking it through with someone helps. A GP can
          refer you, and directories like{' '}
          <a href="https://www.bacp.co.uk/search/Therapists" rel="noopener nofollow">
            BACP
          </a>{' '}
          (UK) or{' '}
          <a href="https://www.psychologytoday.com/us/therapists" rel="noopener nofollow">
            Psychology Today
          </a>{' '}
          (US) let you search for a therapist directly.
        </p>

        <div className="email-block">
          <EmailCapture />
        </div>
      </div>

      <PrintSheet result={result} />
    </div>
  );
}

/**
 * Stacked comparison, shown once there are two or more people. Same rule as
 * everywhere else: the band heading and the pattern name, never a number.
 */
function Comparison({ history }: { history: Result[] }) {
  return (
    <section className="drift compare">
      <HandRule />
      <p className="eyebrow">Side by side</p>
      <h3 className="display-md" style={{ marginBottom: '1.1rem' }}>
        You’re different depending on who you’re with
      </h3>
      <ul className="compare-list">
        {history.map((entry, index) => (
          <li className={`compare-row band-${entry.band.tone}`} key={`${entry.person}-${index}`}>
            <p className="compare-person">{entry.person}</p>
            <p className="compare-band">{entry.band.heading(entry.person)}</p>
            <p className="compare-pattern ink-soft">{entry.subPattern.name}</p>
          </li>
        ))}
      </ul>
      <p className="small ink-soft" style={{ marginBottom: 0 }}>
        This is usually the most useful thing on the page. The difference between two people is
        information about the relationship, not about you.
      </p>
    </section>
  );
}

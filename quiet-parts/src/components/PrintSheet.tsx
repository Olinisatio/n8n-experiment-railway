import type { Result } from '@/data/types';

/**
 * The printed worksheet.
 *
 * This is its own design, not a stripped-back copy of the screen. It sits in
 * the DOM permanently and is `display: none` until the print stylesheet turns
 * it on, which is what lets `window.print()` work with no PDF library and no
 * dependencies at all.
 *
 * The ruled section at the bottom is the actual point of the sheet: the
 * scripts are only worth anything once someone has tried one and written down
 * what happened.
 */
export function PrintSheet({ result }: { result: Result }) {
  const { person, band, subPattern } = result;

  return (
    <section className="print-sheet" aria-hidden="true">
      <header className="print-masthead">
        <span className="print-wordmark">Quiet Parts</span>
        <span className="print-about">Setting Boundaries · {person}</span>
      </header>

      {/* Deliberately not an <h1>: the page already has one ("Setting
          Boundaries") and this node lives in the DOM permanently, so a heading
          tag here would give the document two. */}
      <p className="print-heading">{band.heading(person)}</p>

      <div className="print-section">
        <p className="print-label">The pattern</p>
        <p className="print-pattern-name">{subPattern.name}</p>
        <p>{subPattern.tagline}</p>
        <p>{subPattern.paragraph(person)}</p>
      </div>

      <div className="print-section">
        <p className="print-label">What you could say to {person}</p>
        {subPattern.scripts.map((script) => (
          <p className="print-script" key={script.line}>
            {script.line}
            {script.note ? <span className="print-expect"> — {script.note}</span> : null}
          </p>
        ))}
        <p className="print-expect">
          <strong>Expect:</strong> {subPattern.expect(person)}
        </p>
      </div>

      <div className="print-section">
        <p className="print-label">What happened when you tried one</p>
        <p className="print-expect">
          Which one you used, when, and what {person} actually did. The gap between what you
          expected and what happened is the useful part.
        </p>
        <div className="print-rules" />
      </div>

      <footer className="print-foot">
        A reflection tool, not a diagnosis. It isn’t a clinical assessment and it isn’t a
        substitute for talking to a qualified professional. If reading this has stirred something
        up, talking it through with someone helps — a GP can refer you, and directories like BACP
        (UK) or Psychology Today (US) let you search for a therapist directly.
      </footer>
    </section>
  );
}

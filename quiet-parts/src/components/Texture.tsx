/**
 * Hand-made texture primitives.
 *
 * Everything here is inline SVG with deliberately irregular geometry. The
 * point is that no edge on the page is machine-perfect: rules wobble,
 * underlines wander, and a fine grain sits over the whole surface. None of it
 * should be noticeable on its own.
 */

/**
 * Paper grain across the entire viewport. Fixed, non-interactive, and at 0.035
 * opacity — felt rather than seen. Rendered once, in the layout.
 *
 * The noise itself is a 180px `feTurbulence` tile in a CSS background rather
 * than a full-viewport SVG element. Rasterising turbulence across the whole
 * screen is genuinely expensive — it cost about a second of LCP on a
 * throttled phone — while a small tile is rasterised once and repeated by the
 * compositor. `stitchTiles` is what keeps the seams invisible.
 */
export function PaperGrain() {
  return <div className="grain" aria-hidden="true" />;
}

/**
 * A section divider. Not a straight line — a drawn one, with the tail
 * lightening the way a real pen does when it lifts.
 */
export function HandRule({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`rule ${className}`}
      viewBox="0 0 600 9"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 5.4C61 3.1 121 6.2 181 4.3c60-1.8 119 2.9 179 1.4 60-1.6 120-3.1 179-1.1s0 0 59 1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * A wobbly underline for a key phrase. Deliberately not `border-bottom` — the
 * whole reason it exists is that it is uneven and sits a little low.
 */
export function HandUnderline({ children }: { children: React.ReactNode }) {
  return (
    <span className="underlined">
      {children}
      <svg
        className="underlined-mark"
        viewBox="0 0 300 10"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M2 6.5C48 3.2 96 8.1 144 5.2c48-2.8 96 3.4 154 1.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/**
 * The drawn left rule beside a set of scripts. Stretches to the height of the
 * list; `non-scaling-stroke` keeps the line weight honest while it does.
 */
export function ScriptRule() {
  return (
    <svg
      className="script-rule"
      viewBox="0 0 8 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 2C2.6 28 5.4 54 3.4 80c-2 26 2.2 52 .6 78 -1.2 20 1.4 30 .8 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

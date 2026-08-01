/**
 * The engine behind every Quiet Parts tool.
 *
 * Setting Boundaries is the first of six dimensions. The five that follow use
 * this same shape, so nothing here knows anything about boundaries
 * specifically — a dimension is a list of statements, a set of bands, and a
 * set of sub-patterns that each own their scripts.
 *
 * Everything that mentions the person is a function of their name rather than
 * a string with a placeholder in it. That way there is no interpolation step
 * to forget, and no chance of a raw "[name]" reaching the screen.
 */

/** One of the five answers, and what it is worth. Never = 1 … Almost always = 5. */
export type ScaleOption = {
  label: string;
  value: 1 | 2 | 3 | 4 | 5;
};

export const scale: ScaleOption[] = [
  { label: 'Never', value: 1 },
  { label: 'Rarely', value: 2 },
  { label: 'Sometimes', value: 3 },
  { label: 'Often', value: 4 },
  { label: 'Almost always', value: 5 },
];

/**
 * A script the user could actually say. `note` is the small aside that belongs
 * to a specific line — "a full sentence, no reason attached" — not a general
 * instruction.
 */
export type Script = {
  line: string;
  note?: string;
};

export type SubPattern = {
  id: string;
  name: string;
  /** The one-line gloss shown under the name. */
  tagline: string;
  /**
   * 1-indexed statement numbers, so this list reads the same as the numbered
   * statements in the brief. Two items each, scored 2–10.
   */
  items: [number, number];
  paragraph: (name: string) => string;
  scripts: Script[];
  expect: (name: string) => string;
};

export type Band = {
  id: string;
  min: number;
  max: number;
  /** Applied to the results wrapper, so the palette can vary by band. */
  tone: 'steady' | 'partial' | 'deep';
  heading: (name: string) => string;
  body: (name: string) => string[];
};

export type Dimension = {
  slug: string;
  /** Exact H1 text. */
  h1: string;
  subline: string;
  /** The two sentences under the sub-line. */
  intro: string[];
  metaTitle: string;
  metaDescription: string;
  statements: (name: string) => string[];
  bands: Band[];
  subPatterns: SubPattern[];
  faq: { question: string; answer: string }[];
};

/* --------------------------------------------------------------- scoring -- */

/** Answers are indexed by statement position, 0-based. `null` = unanswered. */
export type Answers = (1 | 2 | 3 | 4 | 5 | null)[];

export type Result = {
  person: string;
  band: Band;
  subPattern: SubPattern;
};

export function totalScore(answers: Answers): number {
  return answers.reduce<number>((sum, a) => sum + (a ?? 0), 0);
}

export function bandFor(dimension: Dimension, total: number): Band {
  const found = dimension.bands.find((b) => total >= b.min && total <= b.max);
  // The bands cover 8–40 exhaustively; the fallback exists so a future
  // dimension with a different item count can never render nothing.
  return found ?? dimension.bands[dimension.bands.length - 1];
}

/**
 * Highest-scoring sub-pattern wins. On a tie the earlier entry in
 * `dimension.subPatterns` wins, which is why the array order is meaningful and
 * must not be sorted.
 */
export function subPatternFor(dimension: Dimension, answers: Answers): SubPattern {
  let best = dimension.subPatterns[0];
  let bestScore = -1;

  for (const pattern of dimension.subPatterns) {
    const score = pattern.items.reduce<number>((sum, item) => sum + (answers[item - 1] ?? 0), 0);
    if (score > bestScore) {
      best = pattern;
      bestScore = score;
    }
  }

  return best;
}

export function scoreDimension(
  dimension: Dimension,
  person: string,
  answers: Answers,
): Result {
  return {
    person,
    band: bandFor(dimension, totalScore(answers)),
    subPattern: subPatternFor(dimension, answers),
  };
}

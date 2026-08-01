import type { Dimension } from '@/data/types';
import { boundaries } from '@/data/dimensions/boundaries';

/**
 * Registry of every dimension.
 *
 * The tool is a client component and a `Dimension` is full of functions, which
 * cannot be passed across the server/client boundary. So the page hands over a
 * slug — a plain string — and the client looks the dimension up here. That
 * also means adding one of the five remaining dimensions is a single line in
 * this file plus its data module.
 */
export const dimensions = {
  [boundaries.slug]: boundaries,
} satisfies Record<string, Dimension>;

export type DimensionSlug = keyof typeof dimensions;

export function getDimension(slug: string): Dimension {
  const dimension = dimensions[slug as DimensionSlug];
  if (!dimension) throw new Error(`Unknown dimension: ${slug}`);
  return dimension;
}

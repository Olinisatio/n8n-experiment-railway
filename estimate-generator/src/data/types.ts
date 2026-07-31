export type LineItem = {
  description: string;
  unit: string;
  defaultQty: number;
  defaultRate: number;
};

export type Trade = {
  /** URL fragment, e.g. "roofing" → /roofing-estimate-template */
  slug: string;
  /** Display name, e.g. "Roofing" */
  name: string;
  h1: string;
  metaTitle: string;
  /** 150–160 characters. */
  metaDescription: string;
  /** 120–180 words, sits above the generator. */
  intro: string;
  /** 6–10 realistic pre-filled rows. */
  lineItems: LineItem[];
  commonUnits: string[];
  bodyContent: { heading: string; body: string }[];
  faq: { q: string; a: string }[];
};

export const TEMPLATE_SUFFIX = '-estimate-template';

export function slugToPath(slug: string): string {
  return `/${slug}${TEMPLATE_SUFFIX}`;
}

export function pathSlugToTrade(pathSlug: string): string | null {
  if (!pathSlug.endsWith(TEMPLATE_SUFFIX)) return null;
  return pathSlug.slice(0, -TEMPLATE_SUFFIX.length);
}

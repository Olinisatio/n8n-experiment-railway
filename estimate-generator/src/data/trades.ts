import type { Trade } from './types';
import { cleaning } from './trades/cleaning';
import { concrete } from './trades/concrete';
import { construction } from './trades/construction';
import { contractor } from './trades/contractor';
import { deck } from './trades/deck';
import { drywall } from './trades/drywall';
import { electrical } from './trades/electrical';
import { fencing } from './trades/fencing';
import { flooring } from './trades/flooring';
import { handyman } from './trades/handyman';
import { hvac } from './trades/hvac';
import { landscaping } from './trades/landscaping';
import { masonry } from './trades/masonry';
import { painting } from './trades/painting';
import { plumbing } from './trades/plumbing';
import { renovation } from './trades/renovation';
import { roofing } from './trades/roofing';
import { siding } from './trades/siding';
import { subcontractor } from './trades/subcontractor';
import { treeRemoval } from './trades/tree-removal';

/**
 * Every page on the site comes from this array — routes, sitemap, hub page and
 * cross-links all derive from it, so adding a trade here is the only step
 * needed to publish a new landing page.
 */
export const trades: Trade[] = [
  construction,
  contractor,
  roofing,
  painting,
  landscaping,
  electrical,
  plumbing,
  hvac,
  concrete,
  cleaning,
  handyman,
  treeRemoval,
  renovation,
  subcontractor,
  flooring,
  drywall,
  fencing,
  siding,
  deck,
  masonry,
];

export const tradeBySlug = new Map(trades.map((trade) => [trade.slug, trade]));

export function getTrade(slug: string): Trade | undefined {
  return tradeBySlug.get(slug);
}

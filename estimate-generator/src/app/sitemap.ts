import type { MetadataRoute } from 'next';
import { trades } from '@/data/trades';
import { slugToPath } from '@/data/types';
import { absoluteUrl } from '@/lib/site';

/**
 * Every URL here is built from `siteUrl`, the same value that produces the
 * canonical tags. They must match exactly — including the www / non-www
 * choice — or Google treats the sitemap as pointing at a different site and
 * ignores it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...trades.map((trade) => ({
      url: absoluteUrl(slugToPath(trade.slug)),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}

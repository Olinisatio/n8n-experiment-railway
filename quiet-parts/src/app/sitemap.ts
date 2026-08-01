import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

/**
 * Every URL here comes from `siteUrl`, the same value that produces the
 * canonical tags — they have to match exactly, including the non-www form, or
 * Google reads the sitemap as pointing at a different site and ignores it.
 *
 * One page for now. The five remaining dimensions get added here as they ship.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}

import type { MetadataRoute } from 'next';
import { absoluteUrl, siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // The page is meant to be indexed. /api holds only the subscribe endpoint,
    // which has nothing to crawl.
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteUrl,
  };
}

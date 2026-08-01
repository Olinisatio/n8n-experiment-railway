/**
 * Canonical site configuration.
 *
 * `siteUrl` is the single source of truth for canonical tags, OG URLs, the
 * sitemap and robots.txt. It must be the exact non-www form of the production
 * domain. If it disagrees with what Google actually crawls — www vs non-www,
 * trailing slash, http vs https — the sitemap looks like it points at a
 * different site and gets ignored.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel. Everything else follows from it.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function normaliseSiteUrl(value: string | undefined): string {
  if (!value) {
    // Before a custom domain is attached, fall back to the Vercel deployment
    // URL so previews still produce absolute, valid metadata.
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
    if (vercelUrl) return `https://${vercelUrl.replace(/\/+$/, '')}`;
    return 'http://localhost:3000';
  }
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  // Strip www and any trailing slash so a mis-typed env var cannot split the
  // site's identity in two.
  return withProtocol.replace(/^(https?:\/\/)www\./i, '$1').replace(/\/+$/, '');
}

export const siteUrl = normaliseSiteUrl(rawSiteUrl);

export const siteName = 'Quiet Parts';

export const siteTagline =
  'Free self-reflection tools about the ways people adapt in relationships — the patterns that made sense once and kept running.';

export function absoluteUrl(path: string): string {
  if (!path.startsWith('/')) return `${siteUrl}/${path}`;
  return `${siteUrl}${path}`;
}

/**
 * The canonical URL of the home page, used for the canonical tag, the OG url
 * and the sitemap entry alike. It exists as one constant because those have to
 * be character-for-character identical, and they do not agree by default:
 * Next normalises a canonical of `https://example.com/` down to
 * `https://example.com`, while the sitemap writer emits whatever it is given.
 * Defining it without the trailing slash is what makes both sides match.
 */
export const canonicalUrl = siteUrl;

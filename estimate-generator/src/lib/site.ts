/**
 * Canonical site configuration.
 *
 * IMPORTANT: `siteUrl` is the single source of truth for canonical tags, OG
 * URLs, the sitemap and robots.txt. It must match the domain Google actually
 * indexes — including the www / non-www choice — or the sitemap will be
 * ignored. Set NEXT_PUBLIC_SITE_URL in Vercel to your production domain.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function normaliseSiteUrl(value: string | undefined): string {
  if (!value) {
    // Vercel injects this for preview/production builds when no custom domain
    // has been configured yet.
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
    if (vercelUrl) return `https://${vercelUrl.replace(/\/+$/, '')}`;
    return 'http://localhost:3000';
  }
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, '');
}

export const siteUrl = normaliseSiteUrl(rawSiteUrl);

export const siteName = 'Free Estimate Templates';

export const siteTagline =
  'Free estimate templates for contractors. Fill in your line items and download a professional PDF in minutes. No signup, no watermark.';

export function absoluteUrl(path: string): string {
  if (!path.startsWith('/')) return `${siteUrl}/${path}`;
  return `${siteUrl}${path}`;
}

import type { Metadata, Viewport } from 'next';
import { Caveat, Fraunces, Karla } from 'next/font/google';
import { PaperGrain } from '@/components/Texture';
import { boundaries } from '@/data/dimensions/boundaries';
import { absoluteUrl, siteName, siteUrl } from '@/lib/site';
import './globals.css';

/**
 * Fraunces carries the whole personality of the page. `SOFT` rounds the
 * terminals and `WONK` swaps in the odder alternates; both are exposed as
 * variable axes here and then held to low values in globals.css, so the face
 * reads warm rather than novelty. Italic is loaded properly because the
 * scripts are set in it — a synthesised slant would be visible at that size.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-fraunces',
});

const karla = Karla({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-karla',
});

/** Handwritten accents only — used two or three times on the entire page. */
const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});

export const viewport: Viewport = {
  themeColor: '#F5EFE6',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: boundaries.metaTitle,
  description: boundaries.metaDescription,
  // Canonical is set per-page; declaring the base here means every future
  // dimension page inherits the same non-www origin automatically.
  alternates: { canonical: '/' },
  applicationName: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    siteName,
    url: absoluteUrl('/'),
    title: boundaries.metaTitle,
    description: boundaries.metaDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: boundaries.metaTitle,
    description: boundaries.metaDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${karla.variable} ${caveat.variable}`}>
      <body>
        <PaperGrain />
        {children}
      </body>
    </html>
  );
}

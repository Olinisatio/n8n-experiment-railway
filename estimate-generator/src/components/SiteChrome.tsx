import Link from 'next/link';
import { siteName } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-base font-bold tracking-tight hover:text-brand">
          {siteName}
        </Link>
        <Link href="/" className="text-sm font-semibold text-brand hover:underline">
          All trades
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-ink-soft sm:px-6">
        <p>
          {siteName} — free estimate templates for contractors. Estimates are generated in
          your browser; nothing you type is uploaded.
        </p>
        <p className="mt-2">
          Pricing shown in the templates is illustrative. Always price to your own costs
          and local market.
        </p>
      </div>
    </footer>
  );
}

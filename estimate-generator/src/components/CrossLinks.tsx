import Link from 'next/link';
import { trades } from '@/data/trades';
import { slugToPath } from '@/data/types';

/**
 * Every trade page links to every other one. With 20 pages that is the whole
 * internal link graph, and it is what gets the long tail crawled.
 */
export function CrossLinks({ currentSlug }: { currentSlug?: string }) {
  const others = trades.filter((trade) => trade.slug !== currentSlug);

  return (
    <section aria-labelledby="other-templates">
      <h2 id="other-templates" className="text-2xl font-bold tracking-tight">
        Other estimate templates
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((trade) => (
          <li key={trade.slug}>
            <Link
              href={slugToPath(trade.slug)}
              className="flex min-h-12 items-center rounded-md border border-line px-4 py-2 font-semibold text-brand hover:bg-brand-soft"
            >
              {trade.name} estimate template
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Analytics } from '@/components/Analytics';
import { CrossLinks } from '@/components/CrossLinks';
import { CtaBlock } from '@/components/CtaBlock';
import { EstimateGenerator } from '@/components/EstimateGenerator';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { getTrade, trades } from '@/data/trades';
import { pathSlugToTrade, slugToPath } from '@/data/types';
import { absoluteUrl } from '@/lib/site';

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return trades.map((trade) => ({ slug: `${trade.slug}-estimate-template` }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tradeSlug = pathSlugToTrade(slug);
  const trade = tradeSlug ? getTrade(tradeSlug) : undefined;
  if (!trade) return {};

  const canonical = absoluteUrl(slugToPath(trade.slug));

  return {
    title: trade.metaTitle,
    description: trade.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: trade.metaTitle,
      description: trade.metaDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: trade.metaTitle,
      description: trade.metaDescription,
    },
  };
}

export default async function TradePage({ params }: PageProps) {
  const { slug } = await params;
  const tradeSlug = pathSlugToTrade(slug);
  const trade = tradeSlug ? getTrade(tradeSlug) : undefined;
  if (!trade) notFound();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: trade.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <SiteHeader />
      <Analytics trade={trade.slug} />

      <main className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {trade.h1}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-soft">
          {trade.intro}
        </p>

        <div className="mt-8">
          <EstimateGenerator trade={trade} />
        </div>

        <div className="mt-10">
          <CtaBlock trade={trade.slug} />
        </div>

        <div className="mt-14 space-y-10">
          {trade.bodyContent.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <section className="mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold tracking-tight">
            {trade.name} estimate template FAQ
          </h2>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            {trade.faq.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="text-lg font-semibold">{item.q}</dt>
                <dd className="mt-2 max-w-3xl leading-relaxed text-ink-soft">{item.a}</dd>
              </div>
            ))}
          </dl>
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger -- static, build-time JSON-LD
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        </section>

        <div className="mt-14">
          <CrossLinks currentSlug={trade.slug} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

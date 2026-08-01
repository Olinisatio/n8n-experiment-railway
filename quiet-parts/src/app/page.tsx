import type { Metadata } from 'next';
import { Analytics } from '@/components/Analytics';
import { BoundaryMap } from '@/components/BoundaryMap';
import { HandUnderline } from '@/components/Texture';
import { BoundariesEssay } from '@/content/BoundariesEssay';
import { boundaries } from '@/data/dimensions/boundaries';
import { absoluteUrl, canonicalUrl, siteName } from '@/lib/site';

export const metadata: Metadata = {
  title: boundaries.metaTitle,
  description: boundaries.metaDescription,
  alternates: { canonical: canonicalUrl },
};

/**
 * The Setting Boundaries page.
 *
 * The intro block and the essay are built here, on the server, and handed to
 * `BoundaryMap` as nodes. That keeps the H1 and the whole body copy in the
 * server-rendered HTML no matter which stage of the tool the user is on —
 * `BoundaryMap` only ever hides them with CSS.
 */
export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: boundaries.faq.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'The Boundary Map',
    url: absoluteUrl('/'),
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any',
    description: boundaries.metaDescription,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    publisher: { '@type': 'Organization', name: siteName, url: absoluteUrl('/') },
  };

  const intro = (
    <header className="shell page-head screen-only">
      <p className="eyebrow">{siteName} · The Boundary Map</p>
      <h1 className="display-xl">{boundaries.h1}</h1>
      <p className="subline">
        Find where you <HandUnderline>go quiet</HandUnderline> — and what to say instead.
      </p>

      {boundaries.intro.map((line) => (
        <p key={line.slice(0, 30)}>{line}</p>
      ))}

      <p className="disclaimer">
        This is a reflection tool, not a diagnosis. It isn’t a clinical assessment and it isn’t a
        substitute for talking to a qualified professional.
      </p>

      <p className="privacy-line">Your answers never leave your browser. Nothing is stored.</p>
    </header>
  );

  return (
    <main>
      <Analytics />
      <script
        type="application/ld+json"
        // Both objects are built from constants in this repo — no user input
        // goes anywhere near them.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <BoundaryMap slug={boundaries.slug} intro={intro} essay={essay} />
    </main>
  );
}

/**
 * Everything below the tool. Passed through `BoundaryMap` as one node so it
 * can step aside for the question flow, which gets the screen to itself.
 */
const essay = (
  <>
    <BoundariesEssay />
    <FaqSection />
    <footer className="shell site-footer screen-only">
      <p className="small ink-soft">
        {siteName} — free self-reflection tools about the ways people adapt in relationships.
        Nothing on this site is stored, and nothing here is a clinical assessment.
      </p>
    </footer>
  </>
);

/**
 * The visible counterpart to the FAQ schema. Structured data with no on-page
 * equivalent is worth nothing, so these are the same three answers.
 */
function FaqSection() {
  return (
    <section className="shell prose faq screen-only">
      <h2>Questions people ask</h2>
      {boundaries.faq.map((entry) => (
        <div key={entry.question}>
          <h3>{entry.question}</h3>
          <p>{entry.answer}</p>
        </div>
      ))}
    </section>
  );
}

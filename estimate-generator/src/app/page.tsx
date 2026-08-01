import type { Metadata } from 'next';
import Link from 'next/link';
import { Analytics } from '@/components/Analytics';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { trades } from '@/data/trades';
import { slugToPath } from '@/data/types';
import { absoluteUrl, siteName, siteTagline } from '@/lib/site';

const title = 'Free Contractor Estimate Templates (PDF) — No Signup';

export const metadata: Metadata = {
  title,
  description: siteTagline,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/'),
    title,
    description: siteTagline,
  },
  twitter: { card: 'summary_large_image', title, description: siteTagline },
};

const steps = [
  {
    heading: 'Pick your trade',
    body: 'Each template is pre-filled with realistic line items and units for that trade, so you are adjusting numbers rather than starting from a blank page.',
  },
  {
    heading: 'Edit the line items',
    body: 'Change any description, quantity, unit or rate. Add rows, delete rows, reorder them. Markup and tax are separate fields so your margin stays visible.',
  },
  {
    heading: 'Download the PDF',
    body: 'A clean US Letter estimate with your logo, licence number, totals and terms. No watermark, no email required, and your details are saved for next time.',
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <Analytics trade="hub" />

      <main className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          Free contractor estimate templates
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-soft">
          Twenty estimate templates with a working builder on every page. Fill in your
          line items, set your markup and tax, and download a professional PDF estimate
          in under three minutes. No signup, no email gate and no watermark — the PDF is
          free and unrestricted, and everything runs in your browser so nothing you type
          is uploaded.
        </p>

        <section className="mt-10" aria-labelledby="templates-heading">
          <h2 id="templates-heading" className="text-2xl font-bold tracking-tight">
            Choose your trade
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {trades.map((trade) => (
              <li key={trade.slug}>
                <Link
                  href={slugToPath(trade.slug)}
                  className="flex min-h-14 items-center rounded-md border border-line px-4 py-3 font-semibold text-brand hover:bg-brand-soft"
                >
                  {trade.name} estimate template
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl font-bold tracking-tight">
            How it works
          </h2>
          <ol className="mt-4 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.heading}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-lg font-bold">{step.heading}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14" aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-bold tracking-tight">
            Why these templates are different
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">
            Most free estimate templates are a spreadsheet with empty rows. These come
            loaded with the line items the trade actually uses — squares and linear feet
            for roofing, fixtures and rough-ins for plumbing, cubic yards for concrete —
            at rates in a realistic range for US residential work. You still set your own
            pricing, but you are not trying to remember every item at nine at night after
            a full day on site. Your business details, logo and terms save in this
            browser, so the second estimate takes about ninety seconds. Estimate numbers
            increment automatically. Nothing is uploaded anywhere, which means customer
            names and addresses stay on your own device.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

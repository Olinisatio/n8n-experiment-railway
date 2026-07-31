import { Analytics } from '@/components/Analytics';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <Analytics trade="hub" />
      <h1 className="text-3xl font-bold tracking-tight">Free Estimate Templates</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Fill in your line items and download a professional PDF estimate in minutes. No
        signup, no watermark. Trade pages are on the way.
      </p>
    </main>
  );
}

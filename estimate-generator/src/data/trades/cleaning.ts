import type { Trade } from '../types';

export const cleaning: Trade = {
  slug: 'cleaning',
  name: 'Cleaning',
  h1: 'Cleaning Estimate Template',
  metaTitle: 'Free Cleaning Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free cleaning estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Cleaning is priced three different ways — by the hour, by the square foot and by the job — and the estimate that wins usually shows all three at once. A client wants to know what it costs, how long it takes and exactly what "deep clean" means, because the last company they hired had a different definition. This template arrives pre-filled for a roughly 2,200 square foot residential deep clean: the base clean, kitchen and bathroom detail, interior windows, floor care, baseboards and trim, supplies, and crew hours. Adjust any quantity or rate, add rows for oven interiors, refrigerator interiors, garages or post-construction work, and delete anything not included. Totals recalculate as you type, and the PDF carries your business name, insurance details and terms. Everything runs in your browser, so client addresses never leave your phone. No signup, no watermark.',
  lineItems: [
    { description: 'Initial deep clean, whole property', unit: 'sq ft', defaultQty: 2200, defaultRate: 0.28 },
    { description: 'Kitchen detail — appliance exteriors and cabinet fronts', unit: 'each', defaultQty: 1, defaultRate: 145 },
    { description: 'Bathroom detail — descale, grout and fixtures', unit: 'each', defaultQty: 3, defaultRate: 65 },
    { description: 'Interior window and sill cleaning', unit: 'each', defaultQty: 18, defaultRate: 9 },
    { description: 'Floor care — vacuum, mop and hard floor treatment', unit: 'sq ft', defaultQty: 1600, defaultRate: 0.12 },
    { description: 'Baseboards, trim, switches and fixtures', unit: 'linear ft', defaultQty: 240, defaultRate: 0.85 },
    { description: 'Cleaning supplies and equipment', unit: 'each', defaultQty: 1, defaultRate: 45 },
    { description: 'Cleaning crew labour', unit: 'hour', defaultQty: 8, defaultRate: 45 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'hour', 'each', 'room', 'visit', 'week'],
  bodyContent: [
    {
      heading: 'What to include in a cleaning estimate',
      body: 'Define the scope room by room and task by task, because "deep clean" means whatever the client last paid for. List what is included — inside the oven or not, inside the refrigerator or not, interior windows or not, blinds, light fixtures, baseboards — and put the common extras on the estimate as separate priced lines rather than leaving them ambiguous. State how many cleaners and how long, since a client comparing two quotes is really comparing hours on site. Note whether you supply products and equipment, and flag any surfaces you will not treat: natural stone, unsealed wood, antiques and anything the client wants cleaned with their own product. Add access details and who is home. Most cleaning disputes are scope disputes, and a specific list solves nearly all of them before the first visit.',
    },
    {
      heading: 'Hourly, square foot or flat rate',
      body: 'Hourly pricing protects you on unfamiliar or hoarded properties but makes clients anxious about an open-ended bill. Square-foot pricing is fast to quote and works well once you know your production rate — most residential crews clean 800 to 1,200 square feet per hour per person on a maintenance visit, and roughly half that on a first deep clean. Flat-rate per visit is what recurring clients prefer, because it is predictable. The practical answer is to estimate in hours internally, present a flat or square-foot price externally, and keep an hourly rate in your terms for out-of-scope work. Typical US figures: $0.15 to $0.35 per square foot for a deep clean, $45 to $65 per cleaner per hour, and a standard three-bedroom maintenance clean at $130 to $220.',
    },
    {
      heading: 'Recurring work is where the money is',
      body: 'A one-off deep clean is a transaction; a fortnightly schedule is a business. Price the first visit to reflect the real work — it is always heavier — and then quote the recurring rate alongside it on the same estimate, so the client sees both numbers together and the ongoing figure looks like the bargain it is. Weekly, fortnightly and monthly rates should differ, because a property cleaned every four weeks takes noticeably longer than one cleaned every two. Put cancellation terms in the notes: how much notice, and what happens if the crew arrives and cannot get in. Note your insurance and whether staff are background-checked, because for anyone handing over a key, that answers a bigger question than price does.',
    },
  ],
  faq: [
    {
      q: 'Is this cleaning estimate template free?',
      a: 'Yes. There is no signup, no email required, no trial and no watermark on the PDF. Fill in the line items, download the file and send it to your client. It runs entirely in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'Should I quote cleaning by the hour or by the job?',
      a: 'Estimate in hours internally, quote a flat or per-square-foot price externally. Clients prefer a number they can budget against, while you need hours to know whether the job pays. Keep an hourly rate in your terms for anything outside the agreed scope, so extras are billable without a new quote.',
    },
    {
      q: 'How much should I charge for a deep clean?',
      a: 'Across the US, a residential deep clean commonly runs $0.15 to $0.35 per square foot, putting a 2,000 square foot house somewhere around $300 to $700. Condition matters more than size — a lightly used home and a heavily lived-in one at the same square footage can differ by a factor of two. Always walk the property before committing.',
    },
    {
      q: 'How do I price a recurring cleaning contract?',
      a: 'Quote the first deep clean at its real cost, then show weekly, fortnightly or monthly rates on the same estimate. Longer gaps between visits mean more work each time, so the rates should differ. Include cancellation notice and access terms in the notes so they print on the PDF the client agrees to.',
    },
  ],
};

import type { Trade } from '../types';

export const subcontractor: Trade = {
  slug: 'subcontractor',
  name: 'Subcontractor',
  h1: 'Subcontractor Estimate Template',
  metaTitle: 'Free Subcontractor Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free subcontractor estimate template with a built-in calculator. Edit the line items, set your rates and download a professional PDF estimate. No signup.',
  intro:
    'A subcontractor estimate has a different reader from a homeowner quote. The general contractor on the other side already knows what the work costs — what they are checking is whether your scope matches the drawings, whether your exclusions leave them exposed, and whether you will turn up when the schedule says. This template is built for that reader: mobilisation, skilled and helper hours, a materials figure, equipment, clean-up, compliance documentation and supervision, each on its own line with quantities they can check against the take-off. Adjust everything to your trade and scope, add rows, and delete what the GC is supplying. Markup and tax stay separate so your margin is visible to you and defensible to them. The PDF carries your business name, licence and insurance details. No signup, no watermark.',
  lineItems: [
    { description: 'Mobilisation, site setup and induction', unit: 'each', defaultQty: 1, defaultRate: 450 },
    { description: 'Skilled trade labour', unit: 'hour', defaultQty: 120, defaultRate: 72 },
    { description: 'Helper and general labour', unit: 'hour', defaultQty: 60, defaultRate: 44 },
    { description: 'Materials supplied by subcontractor', unit: 'allowance', defaultQty: 1, defaultRate: 3800 },
    { description: 'Equipment and plant hire', unit: 'day', defaultQty: 5, defaultRate: 165 },
    { description: 'Site clean-up and debris removal', unit: 'each', defaultQty: 1, defaultRate: 385 },
    { description: 'Insurance certificates and compliance documentation', unit: 'each', defaultQty: 1, defaultRate: 225 },
    { description: 'Supervision and coordination', unit: 'hour', defaultQty: 16, defaultRate: 85 },
  ],
  commonUnits: ['hour', 'day', 'week', 'sq ft', 'linear ft', 'each', 'allowance'],
  bodyContent: [
    {
      heading: 'What a general contractor looks for',
      body: 'Scope alignment first. Reference the drawing numbers and revision dates your price is based on, because a GC comparing three subcontractor bids needs to know you all priced the same set. State what you have excluded in the same language the trade schedule uses — hoisting, scaffolding, temporary power, final clean, protection of adjacent work — since those are the gaps that turn into back-charges. Give your crew size and duration, not just a number, because the GC is building a programme and a price with no schedule attached is unusable. Confirm your insurance limits and any prequalification documents you can supply. Then say what you need from them: access dates, a clear work area, and lead times. A bid that reads as though you have run a job before gets shortlisted.',
    },
    {
      heading: 'Pricing subcontract work',
      body: 'Subcontract pricing lives or dies on the labour estimate, because materials are usually a pass-through and equipment is a known rate. Build hours from production rates you have measured on your own completed jobs rather than from a published table, and split skilled from helper hours so a long job does not silently erode your margin. Typical margins on subcontract work run tighter than direct-to-homeowner — 10 to 18 percent is common — which makes accurate hours far more important than an ambitious markup. Price mobilisation separately, especially on small scopes, because a two-day job that needs a full setup is not two days of cost. And build in the cost of the GC’s administration: site inductions, daily reports, progress claims and retention all consume hours nobody quotes for.',
    },
    {
      heading: 'Payment terms, retention and getting paid',
      body: 'The commercial risk in subcontracting is not the work, it is the cash. Put your terms on the estimate rather than discovering the GC’s terms in their contract: how often you claim, how many days to payment, and whether retention applies and at what percentage. Say explicitly whether your price assumes pay-when-paid, because it changes the number. Note that variations must be approved in writing before work proceeds — verbal instructions on site are the single most common cause of unpaid subcontractor work. If you are supplying materials, state whether the price holds against supplier increases and for how long. None of this makes you difficult to work with; it makes you the subcontractor whose invoices are never a surprise.',
    },
  ],
  faq: [
    {
      q: 'Is this subcontractor estimate template free?',
      a: 'Yes, completely. No signup, no email required, no trial and no watermark on the PDF. Fill in the line items, download the file and send it to the general contractor. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'What margin should a subcontractor use?',
      a: 'Subcontract work typically carries tighter margins than direct residential work — commonly 10 to 18 percent — because the general contractor is applying their own markup on top. That makes an accurate labour estimate more valuable than an ambitious markup. Keep the percentage as a separate visible field so you know exactly what you are working for.',
    },
    {
      q: 'What should I exclude from a subcontractor bid?',
      a: 'Anything the trade schedule might reasonably assign to someone else: scaffolding, hoisting, temporary power and lighting, protection of adjacent trades, final clean, and out-of-hours work. Name them explicitly in the same terms the contract documents use, and reference the drawing revision your price is based on.',
    },
    {
      q: 'Should payment terms be on the estimate?',
      a: 'Yes. State your claim frequency, payment days, whether retention applies and at what rate, and that variations require written approval before work starts. Putting terms on the estimate rather than negotiating them after award is the cheapest protection available to a subcontractor.',
    },
  ],
};

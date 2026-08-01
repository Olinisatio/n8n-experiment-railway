import type { Trade } from '../types';

export const plumbing: Trade = {
  slug: 'plumbing',
  name: 'Plumbing',
  h1: 'Plumbing Estimate Template',
  metaTitle: 'Free Plumbing Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free plumbing estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup.',
  intro:
    'Plumbing estimates carry more risk than most trades because so much of the work is behind a wall or under a slab. The way to manage that is not vaguer pricing — it is a clearer scope. This template starts you with the items that make up a typical residential job: the diagnostic call, fixture rough-ins, toilets, sinks and faucets, a water heater replacement, supply line by the foot, drain line by the foot, the permit and your licensed hours. Every quantity and rate is editable, so you can strip it down to a single water heater swap or build it up into a full bathroom. Totals recalculate as you type, and the PDF carries your logo, licence number and terms. It runs entirely in your browser, so nothing you type about a customer leaves your phone. No signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Service call and diagnostic', unit: 'each', defaultQty: 1, defaultRate: 125 },
    { description: 'Fixture rough-in, supply and waste', unit: 'each', defaultQty: 3, defaultRate: 475 },
    { description: 'Toilet, supplied and installed', unit: 'each', defaultQty: 2, defaultRate: 395 },
    { description: 'Sink and faucet, installed', unit: 'each', defaultQty: 2, defaultRate: 285 },
    { description: 'Water heater replacement, 50 gallon gas', unit: 'each', defaultQty: 1, defaultRate: 1850 },
    { description: 'PEX supply line, run and connected', unit: 'linear ft', defaultQty: 120, defaultRate: 9.5 },
    { description: 'Drain line, 2 in PVC', unit: 'linear ft', defaultQty: 60, defaultRate: 12.5 },
    { description: 'Permit and inspection fee', unit: 'each', defaultQty: 1, defaultRate: 220 },
    { description: 'Licensed plumber labour', unit: 'hour', defaultQty: 12, defaultRate: 110 },
  ],
  commonUnits: ['each', 'linear ft', 'hour', 'fixture', 'day', 'trip'],
  bodyContent: [
    {
      heading: 'What to include in a plumbing estimate',
      body: 'Price by fixture wherever you can. "Three fixture rough-ins" is a unit a homeowner understands and a unit you can estimate accurately from a walkthrough. Separate supply from waste, because re-piping supply is a different job from replacing a drain stack and customers frequently want one and not the other. Name the products: water heater brand, capacity and warranty; faucet and valve manufacturer. Show the permit as its own line. Then be explicit about what you have not priced — opening and repairing walls or ceilings, replacing a corroded shut-off you find behind the drywall, tree roots in the lateral, or bringing a non-compliant vent up to code. Each of those belongs in the notes with a unit price, so an unwelcome discovery becomes a documented change order rather than a difficult phone call.',
    },
    {
      heading: 'How plumbers price residential work',
      body: 'Most residential plumbers run flat-rate pricing for common jobs and time and materials for diagnostics and repairs. Typical US figures: a service call $75 to $200, a toilet supplied and installed $350 to $600, a 50 gallon gas water heater replaced $1,500 to $2,500 including permit and haul-away, and a full bathroom rough-in $1,200 to $2,500 depending on how far the fixtures move. Licensed hourly rates commonly sit between $90 and $140. Moving a drain is the expensive move, not moving a supply line — supply is flexible and forgiving, waste needs fall and venting. If a customer is choosing between two layouts, pricing the drain work as its own line makes the cost difference obvious before they commit.',
    },
    {
      heading: 'Emergencies, after-hours and how to price them',
      body: 'A significant share of plumbing revenue arrives at the worst possible time, and that has to be on the estimate too. Set an after-hours or weekend rate and state it in your terms rather than negotiating it at eleven at night. For emergency call-outs, price the diagnostic separately from the repair so the customer is agreeing to a small, clear number before you are on the floor with a torch. Say how long parts take to source, because an unavailable water heater is a two-day problem you did not cause and should not absorb. Finally, offer the option that is cheaper now and the option that is right — repair versus replace, priced side by side. Customers pick the larger job more often than most plumbers expect when they can see both numbers.',
    },
  ],
  faq: [
    {
      q: 'Is this plumbing estimate template free?',
      a: 'Yes, entirely. There is no signup, no email required and no watermark on the PDF. Fill in your line items, download the file and send it to your customer. It runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge to replace a water heater?',
      a: 'A standard 50 gallon gas water heater replaced in the US typically runs $1,500 to $2,500 including the unit, permit, haul-away of the old tank and labour. Tankless conversions run considerably higher because of gas line and venting work. Adjust the rate in the template to your own supplier pricing and local permit costs.',
    },
    {
      q: 'Should I charge a diagnostic fee?',
      a: 'Most plumbers do, and it belongs on the estimate as its own line. It covers the trip and the time to find the actual problem, and it filters out price shoppers. Many contractors credit it against the repair if the customer goes ahead — if you do that, say so in the notes so it is visible on the PDF.',
    },
    {
      q: 'What is the difference between an estimate and a quote in plumbing?',
      a: 'An estimate is your best professional judgement and can change if the scope does — a corroded shut-off or an unvented drain, for example. A quote is a fixed price you commit to. Plumbing usually starts as an estimate because so much is concealed. Make clear which you are giving, and list the likely surprises with unit prices in the notes.',
    },
  ],
};

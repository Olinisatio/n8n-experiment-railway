import type { Trade } from '../types';

export const deck: Trade = {
  slug: 'deck',
  name: 'Deck',
  h1: 'Deck Estimate Template',
  metaTitle: 'Free Deck Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free deck estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Deck pricing is dominated by two things homeowners never think about: the substructure and the railing. The boards they picked out are maybe a third of the cost, while footings, joists, hangers and code-compliant railing quietly make up the rest. An estimate that shows this is far easier to defend than a single number. This template arrives pre-filled for a roughly 320 square foot composite deck: design and permit, footings, pressure-treated framing, composite decking, railing with metal balusters, stairs, fasteners and hardware, and carpentry hours. Adjust the size, swap composite for pressure-treated or hardwood, and add rows for demolition of an existing deck, ledger flashing, lighting or skirting. Totals recalculate as you type and the PDF carries your logo, licence number and terms. No signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Design, layout and permit application', unit: 'each', defaultQty: 1, defaultRate: 650 },
    { description: 'Footings, dug, poured and inspected', unit: 'each', defaultQty: 12, defaultRate: 185 },
    { description: 'Pressure-treated framing, beams and joists', unit: 'sq ft', defaultQty: 320, defaultRate: 14.5 },
    { description: 'Composite decking boards, supplied', unit: 'sq ft', defaultQty: 320, defaultRate: 9.75 },
    { description: 'Railing, composite with metal balusters', unit: 'linear ft', defaultQty: 56, defaultRate: 68 },
    { description: 'Stairs, built and installed', unit: 'each', defaultQty: 4, defaultRate: 185 },
    { description: 'Fasteners, joist hangers and hardware', unit: 'each', defaultQty: 1, defaultRate: 485 },
    { description: 'Carpentry labour', unit: 'hour', defaultQty: 56, defaultRate: 72 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'each', 'hour', 'day', 'riser', 'footing'],
  bodyContent: [
    {
      heading: 'What to include in a deck estimate',
      body: 'Show the substructure. Footings, beams, joists, hangers and the ledger connection are the parts that make a deck safe, they are the parts an inspector actually looks at, and they are entirely invisible in the finished photograph the customer has been imagining. Break them out. Price railing by the linear foot separately from decking by the square foot, because railing frequently costs more per foot than the deck surface does and customers routinely underestimate it. Count stairs by the riser. Name the decking product, colour and warranty term. Include the permit and inspection. In exclusions, cover removal of an existing deck, soil conditions requiring deeper or larger footings, grading and drainage, electrical for lighting, and any structural work needed at the house wall to attach a ledger safely.',
    },
    {
      heading: 'How deck builders price by the square foot',
      body: 'Square footage of deck surface is the headline unit, but the substructure cost varies with height far more than with area — a deck two feet off the ground and one twelve feet up have the same boards and very different framing. Typical US installed figures: pressure-treated $25 to $45 per square foot, composite $35 to $80, and hardwood such as ipe $45 to $95. Railing commonly runs $50 to $110 per linear foot installed depending on material, and stairs $150 to $250 per riser. Footings run $150 to $300 each. A useful sanity check: on a typical composite deck, decking material is around a third of the total, framing and footings another third, and railing, stairs and labour the rest. If your ratios are far from that, something is mispriced.',
    },
    {
      heading: 'Permits, ledgers and building to code',
      body: 'Decks are among the most commonly failed residential inspections, and almost always for the same reasons: footing depth, ledger attachment and guard rail height or baluster spacing. Put your code compliance on the estimate as a selling point rather than an assumption. Name the frost depth you are digging to, say that the ledger will be properly flashed and lag-bolted or through-bolted to the rim joist, and state the railing height and baluster spacing you are building to. Note who pulls the permit and schedules inspections. This matters commercially as well as structurally: an unpermitted deck is a problem at resale, and a homeowner comparing your bid against a cheaper one needs a reason to understand the difference. Code compliance, written plainly, is that reason.',
    },
  ],
  faq: [
    {
      q: 'Is this deck estimate template free?',
      a: 'Yes, entirely. No signup, no email required, no trial and no watermark on the PDF. Fill in your line items, download the file and send it to your customer. It runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge per square foot for a deck?',
      a: 'US installed pricing typically runs $25 to $45 per square foot for pressure-treated, $35 to $80 for composite and $45 to $95 for hardwood. Height above grade affects the framing cost more than area does. Price railing and stairs separately — they are often a third of the total on a smaller deck.',
    },
    {
      q: 'How do I price deck railing?',
      a: 'By the linear foot, as its own line, typically $50 to $110 installed depending on material and baluster type. Railing frequently costs more per foot than the deck surface, and customers almost always underestimate it, so burying it inside a square-foot rate makes your total look arbitrary rather than reasoned.',
    },
    {
      q: 'Does a deck need a permit?',
      a: 'In most US jurisdictions, yes — commonly for any deck over a certain height or attached to the house. Show the permit as its own line and say who pulls it and schedules inspections. Footing depth, ledger attachment and guard rail spacing are the usual inspection failures, so name what you are building to.',
    },
  ],
};

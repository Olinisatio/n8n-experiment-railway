import type { Trade } from '../types';

export const concrete: Trade = {
  slug: 'concrete',
  name: 'Concrete',
  h1: 'Concrete Estimate Template',
  metaTitle: 'Free Concrete Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free concrete estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Concrete is unforgiving to estimate badly. The pour is a fixed cost you cannot renegotiate once the truck is booked, and the margin lives in everything around it — excavation, base, forming, reinforcement and finishing. This template splits all of that out. It arrives pre-filled for an 800 square foot driveway or patio pour: excavation and grading, compacted gravel base, forming, rebar and mesh, 4,000 psi concrete supplied and placed, broom finishing, control joints and sealing, and crew hours. Adjust the area, change any rate to your own supplier and ready-mix pricing, and add rows for thickened edges, stamping, colour or demolition of an existing slab. Totals update as you type and the PDF carries your logo, licence number and terms — including the curing and cracking language every concrete contractor eventually wishes they had written down. No signup, no watermark.',
  lineItems: [
    { description: 'Excavation, grading and haul-off', unit: 'sq ft', defaultQty: 800, defaultRate: 2.85 },
    { description: 'Compacted gravel base, 4 in', unit: 'sq ft', defaultQty: 800, defaultRate: 1.75 },
    { description: 'Forming, staking and edge setup', unit: 'linear ft', defaultQty: 120, defaultRate: 4.5 },
    { description: 'Rebar and welded wire mesh', unit: 'sq ft', defaultQty: 800, defaultRate: 1.25 },
    { description: 'Concrete, 4000 psi, supplied and placed', unit: 'cubic yard', defaultQty: 10, defaultRate: 185 },
    { description: 'Finishing, broom finish', unit: 'sq ft', defaultQty: 800, defaultRate: 2.25 },
    { description: 'Control joints, cut and sealed', unit: 'linear ft', defaultQty: 160, defaultRate: 2.75 },
    { description: 'Concrete crew labour', unit: 'hour', defaultQty: 40, defaultRate: 65 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'cubic yard', 'hour', 'day', 'each', 'load'],
  bodyContent: [
    {
      heading: 'What to include in a concrete estimate',
      body: 'Specify the mix and the thickness. "4,000 psi, four inches over a compacted four-inch base, fibre reinforced" is a specification; "concrete driveway" is not, and it puts you level with whoever is pouring three inches over dirt. Break out excavation, base, forming, reinforcement, the pour and finishing as separate lines, because base preparation is the invisible half of the job and the first thing a cheap bid removes. Name the finish — broom, trowel, exposed aggregate, stamped — since it changes labour substantially. Show control joints as their own item so the customer understands they are planned, not accidental. In exclusions, cover rock or unsuitable soil in excavation, removal of an existing slab, utility relocation, and access limits that prevent the truck reaching the pour.',
    },
    {
      heading: 'How concrete contractors price a pour',
      body: 'Material is calculated by volume and labour by area, which is why the two need different units. A cubic yard covers 81 square feet at four inches thick, so an 800 square foot slab needs roughly ten yards plus waste. Typical US figures: ready-mix delivered $140 to $200 per cubic yard, a finished four-inch residential slab $6 to $14 per square foot all in, and stamped or coloured work $12 to $25 per square foot. Short-load fees apply below four or five yards and belong on the estimate as their own line. The costs that surprise people are pump hire when a truck cannot reach, and disposal of an existing slab — broken concrete is heavy, and dumpster weight limits arrive faster than volume limits do.',
    },
    {
      heading: 'Cracking, curing and setting expectations in writing',
      body: 'Concrete cracks. Every experienced contractor knows it, most homeowners do not, and the gap between those two facts causes more disputes than any pricing question. Put it in the notes: control joints are placed to direct cracking, hairline cracking is normal and not a defect, and the warranty covers structural failure rather than surface cracks. State the cure time before foot traffic and before vehicle traffic — typically 24 to 48 hours and 7 days respectively — because a customer parking on a four-day-old driveway will blame the pour. Note that colour variation between loads is inherent to the material. Weather clauses matter too: name the temperature and rain conditions under which you will postpone, so rescheduling is a documented judgement rather than a broken promise.',
    },
  ],
  faq: [
    {
      q: 'Is this concrete estimate template free?',
      a: 'Yes, completely. No signup, no email required and no watermark on the PDF. Fill in the line items, download the file and send it to your customer. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge per square foot for concrete?',
      a: 'A plain four-inch residential slab with broom finish typically runs $6 to $14 per square foot installed across the US, covering excavation, base, forming, reinforcement, concrete and finishing. Stamped or coloured work runs $12 to $25. The template separates each of those costs so you can price them to your own supplier and labour rates.',
    },
    {
      q: 'How do I calculate how much concrete I need?',
      a: 'Volume in cubic yards equals area in square feet times thickness in feet, divided by 27. One cubic yard covers 81 square feet at four inches. Add five to ten percent for waste and uneven subgrade. The template prices concrete by the cubic yard and everything else by area, which keeps the arithmetic honest.',
    },
    {
      q: 'Should my estimate mention cracking?',
      a: 'Yes, in the notes and terms. Concrete cracks as it cures, control joints direct where, and hairline surface cracks are not a defect. Writing that on the estimate before the pour is the single cheapest way to avoid a warranty argument six months later. Cover cure times and colour variation between loads in the same paragraph.',
    },
  ],
};

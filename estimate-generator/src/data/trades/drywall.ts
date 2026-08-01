import type { Trade } from '../types';

export const drywall: Trade = {
  slug: 'drywall',
  name: 'Drywall',
  h1: 'Drywall Estimate Template',
  metaTitle: 'Free Drywall Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free drywall estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Drywall is priced by the square foot and won or lost on the finish level. A customer comparing bids rarely knows that Level 3 and Level 5 are different products with a real cost difference, and the estimate that explains it is the one that stops looking expensive. This template arrives pre-filled for a roughly 1,800 square foot hang and finish: board supplied and hung, three-coat taping, sanding to Level 4, corner bead, knockdown texture, primer, scrap removal and crew hours. Adjust the area to your take-off, change the finish level in the description, and add rows for moisture-resistant board, fire-rated assemblies, ceilings or high work. Totals recalculate live and the PDF carries your logo, licence number and terms — including the dust and access language worth agreeing before you arrive. No signup, no email gate, no watermark.',
  lineItems: [
    { description: '1/2 in drywall, supplied and hung', unit: 'sq ft', defaultQty: 1800, defaultRate: 1.85 },
    { description: 'Taping and mudding, three coats', unit: 'sq ft', defaultQty: 1800, defaultRate: 1.45 },
    { description: 'Sanding and finish to Level 4', unit: 'sq ft', defaultQty: 1800, defaultRate: 0.75 },
    { description: 'Corner bead, installed and finished', unit: 'linear ft', defaultQty: 160, defaultRate: 2.25 },
    { description: 'Knockdown texture, applied', unit: 'sq ft', defaultQty: 1800, defaultRate: 0.95 },
    { description: 'Primer coat, sprayed', unit: 'sq ft', defaultQty: 1800, defaultRate: 0.55 },
    { description: 'Scrap removal and disposal', unit: 'each', defaultQty: 1, defaultRate: 325 },
    { description: 'Drywall crew labour', unit: 'hour', defaultQty: 24, defaultRate: 58 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'sheet', 'hour', 'day', 'each', 'room'],
  bodyContent: [
    {
      heading: 'What to include in a drywall estimate',
      body: 'State the finish level explicitly. Level 3 is fine behind texture, Level 4 is standard for flat paint and light texture, and Level 5 — a skim coat over the whole surface — is what critical lighting and gloss finishes actually need. Most disputes about drywall are really disputes about a customer expecting Level 5 and paying for Level 4. Break out hanging, taping, sanding and texture separately so the difference is visible. Specify board type and thickness, and call out moisture-resistant or fire-rated board where the assembly requires it. Include corner bead by the linear foot, scrap disposal, and primer if you are supplying it. In exclusions, cover framing corrections, out-of-plumb walls, and any painting beyond the primer coat.',
    },
    {
      heading: 'How drywall contractors price',
      body: 'Square footage of board surface, not floor area, is the unit — count walls and ceilings and it typically comes to around three to four times the floor area of a room. Typical US pricing: hanging and finishing together runs $1.50 to $3.50 per square foot for a standard Level 4 finish, with material at roughly $0.50 to $0.90 per square foot and labour making up the rest. Level 5 adds $0.50 to $1.25 per square foot. Textures range from $0.50 for a light orange peel to $1.50 for a hand-applied pattern. Ceilings cost more than walls for the same area, and heights above nine feet slow production noticeably. Repairs and patches are hourly work — trying to price a patch by area is how patch jobs lose money.',
    },
    {
      heading: 'Dust, access and scheduling around other trades',
      body: 'Drywall is the trade everyone else waits on, and it is also the messiest thing that will happen in the building. Put both facts on the estimate. Say what containment and protection you provide and what you do not — sanding dust travels through a whole house and a customer who was not warned will remember it more clearly than the finish. Note that the space must be clear, that rough-in inspections must have passed, and that you need continuous access rather than a two-hour window. Give a duration that includes drying time between coats, since a three-coat finish cannot be rushed and a customer expecting one day will be unhappy on day three. State the temperature and humidity conditions your schedule assumes, because both change how long mud takes.',
    },
  ],
  faq: [
    {
      q: 'Is this drywall estimate template free?',
      a: 'Yes. No signup, no email required, no trial and no watermark on the PDF. Fill in your line items, download the file and send it to your customer. It runs entirely in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge per square foot for drywall?',
      a: 'Hanging and finishing to a standard Level 4 typically runs $1.50 to $3.50 per square foot of board surface across the US, with material around $0.50 to $0.90 of that. Level 5 adds roughly $0.50 to $1.25. Set your own rates in the template rather than working from a blended national figure.',
    },
    {
      q: 'Should the finish level be on the estimate?',
      a: 'Absolutely. Level 3, 4 and 5 are genuinely different products with different costs, and most drywall complaints come from a customer expecting one and paying for another. Name the level in the line description and say what it is suitable for. It also explains why your bid differs from a cheaper one.',
    },
    {
      q: 'How do I price drywall repairs?',
      a: 'Hourly, plus materials, with a minimum. Patches and repairs have almost no relationship between area and time — a small hole in an awkward spot with a texture match can take longer than hanging a whole wall. Use the handyman-style service call line and bill the actual hours.',
    },
  ],
};

import type { Trade } from '../types';

export const siding: Trade = {
  slug: 'siding',
  name: 'Siding',
  h1: 'Siding Estimate Template',
  metaTitle: 'Free Siding Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free siding estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Siding is one of the largest exterior purchases a homeowner makes, and the bids they collect will vary enormously — usually because of what is behind the siding rather than the siding itself. House wrap, flashing details and rotten sheathing are invisible in a finished photograph and are exactly where a cheap bid saves money. This template splits them out. It arrives pre-filled for a roughly 1,800 square foot fibre cement re-side: tear-off and disposal, house wrap and flashing, material, installation labour, trim and corners, soffit and fascia, caulking and paint, and staging. Swap fibre cement for vinyl, engineered wood or cedar, adjust the area, and add rows for sheathing replacement or insulation. Totals recalculate live and the PDF carries your logo, licence number and terms. No signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Remove and dispose of existing siding', unit: 'sq ft', defaultQty: 1800, defaultRate: 2.25 },
    { description: 'House wrap, flashing and water management details', unit: 'sq ft', defaultQty: 1800, defaultRate: 0.95 },
    { description: 'Fibre cement siding, supplied', unit: 'sq ft', defaultQty: 1800, defaultRate: 4.85 },
    { description: 'Installation labour', unit: 'sq ft', defaultQty: 1800, defaultRate: 4.25 },
    { description: 'Trim, corners and J-channel', unit: 'linear ft', defaultQty: 320, defaultRate: 6.5 },
    { description: 'Soffit and fascia, replaced', unit: 'linear ft', defaultQty: 180, defaultRate: 12.5 },
    { description: 'Caulking, priming and finish paint', unit: 'sq ft', defaultQty: 1800, defaultRate: 1.35 },
    { description: 'Scaffolding and staging', unit: 'day', defaultQty: 5, defaultRate: 185 },
  ],
  commonUnits: ['sq ft', 'square', 'linear ft', 'hour', 'day', 'each'],
  bodyContent: [
    {
      heading: 'What to include in a siding estimate',
      body: 'The weather barrier deserves its own line. House wrap, flashing at windows and doors, and the details around penetrations are what determine whether the wall assembly lasts twenty years or rots quietly, and they are invisible the moment the siding goes on. Listing them separately is the only way a homeowner can tell your bid apart from one that skips them. Name the product, manufacturer, exposure and warranty term. Break out trim, corners, soffit and fascia, because those are frequently in worse condition than the siding and customers want to know the cost before committing. Include tear-off and disposal by area. In exclusions, cover rotten sheathing and framing repair with a stated unit rate, insulation upgrades, window replacement and lead paint on pre-1978 properties.',
    },
    {
      heading: 'How siding is measured and priced',
      body: 'Siding is measured in squares — 100 square feet — the same as roofing, though most residential quotes present it per square foot. Measure wall area by elevation, subtract large openings, and add ten percent for waste, more on a cut-up elevation with dormers and gables. Typical US installed figures: vinyl $4 to $9 per square foot, engineered wood $6 to $12, fibre cement $8 to $16, and cedar $9 to $20. Fibre cement carries higher labour because it is heavy, requires specific fasteners and cutting equipment, and needs careful gapping and flashing. Height drives cost more than area — a two-storey elevation needs staging, and staging is a day rate that keeps accruing regardless of how much siding went up.',
    },
    {
      heading: 'Rot, sheathing and the day-two conversation',
      body: 'Nobody knows what is behind old siding until it comes off, and pretending otherwise is how siding jobs turn adversarial. Write the unit price for sheathing replacement into the estimate before you start — per sheet, per square foot, whatever suits — along with framing repair by the linear foot. Say that you will photograph anything you find and get written approval before proceeding. That single paragraph converts the worst conversation in the trade into an administrative step the customer already agreed to. Also set expectations about weather: siding is exterior work, the wall is open at the end of some days, and rain moves schedules. State what you do to protect an open wall overnight, because a customer who has seen that written down sleeps better than one who has not.',
    },
  ],
  faq: [
    {
      q: 'Is this siding estimate template free?',
      a: 'Yes. There is no signup, no email required, no trial and no watermark on the PDF. Fill in your line items, download the file and send it to your customer. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge per square foot for siding?',
      a: 'Installed US pricing typically runs $4 to $9 per square foot for vinyl, $6 to $12 for engineered wood, $8 to $16 for fibre cement and $9 to $20 for cedar. Two-storey work and cut-up elevations with dormers push the labour side up. Set your own material and labour rates in the template.',
    },
    {
      q: 'How do I handle rotten sheathing found during tear-off?',
      a: 'Price it before you start. Put sheathing replacement and framing repair on the estimate as lines with a stated unit rate and a zero or nominal quantity, and note that you will photograph findings and get written approval. It turns an unwelcome discovery into a quantity change the customer has already accepted in principle.',
    },
    {
      q: 'Should house wrap be a separate line item?',
      a: 'Yes, always. The weather barrier and flashing details are what make the wall last, they are invisible once the siding is on, and they are the first thing a cheaper bid quietly removes. A separate line is the only way a homeowner can see the difference between your quote and one that skips it.',
    },
  ],
};

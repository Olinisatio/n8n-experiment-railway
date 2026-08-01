import type { Trade } from '../types';

export const roofing: Trade = {
  slug: 'roofing',
  name: 'Roofing',
  h1: 'Roofing Estimate Template',
  metaTitle: 'Free Roofing Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free roofing estimate template with a built-in calculator. Edit the line items, set your rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Roofing estimates live or die on the squares. Miss the tear-off count or forget the dumpster and a job that looked profitable on Monday is losing money by Thursday. This template starts you with the line items a residential re-roof actually needs — tear-off and disposal, underlayment, architectural shingles, ridge cap, drip edge, pipe boot flashing, the dumpster and your crew hours — pre-filled with realistic quantities for a 25-square roof so you can adjust rather than start from a blank page. Change any description, quantity or rate, add rows for skylights or decking replacement, delete what does not apply, then set your markup and tax. The generator totals everything as you type and produces a clean PDF estimate with your logo and licence number on it. It runs entirely in your browser, so nothing you type leaves your phone, and there is no signup, no email gate and no watermark on the file you hand the homeowner.',
  lineItems: [
    {
      description: 'Tear-off and disposal of existing roofing (1 layer)',
      unit: 'square',
      defaultQty: 25,
      defaultRate: 115,
    },
    {
      description: 'Synthetic underlayment, installed',
      unit: 'square',
      defaultQty: 25,
      defaultRate: 32,
    },
    {
      description: 'Architectural asphalt shingles, 30-year',
      unit: 'square',
      defaultQty: 25,
      defaultRate: 145,
    },
    {
      description: 'Ridge cap shingles and ridge vent',
      unit: 'linear ft',
      defaultQty: 45,
      defaultRate: 9.5,
    },
    { description: 'Drip edge, painted aluminium', unit: 'linear ft', defaultQty: 160, defaultRate: 3.25 },
    { description: 'Pipe boot flashing, replaced', unit: 'each', defaultQty: 4, defaultRate: 45 },
    { description: '20-yard dumpster rental and haul-away', unit: 'each', defaultQty: 1, defaultRate: 525 },
    { description: 'Roofing crew labour', unit: 'hour', defaultQty: 60, defaultRate: 75 },
  ],
  commonUnits: ['square', 'sq ft', 'linear ft', 'hour', 'day', 'each'],
  bodyContent: [
    {
      heading: 'What to include in a roofing estimate',
      body: 'A roofing estimate should let the homeowner see exactly what they are buying. Break out tear-off and disposal separately from installation — it is the line most likely to change once you are on the roof and find a second layer. List underlayment, shingles, ridge cap, drip edge and flashing as their own items rather than burying them in a single "materials" figure, because itemised estimates close better against a competitor who quoted one number. State the shingle manufacturer, product line and warranty term in the description. Include the dumpster and the permit if your municipality requires one. Finish with the exclusions: decking replacement, chimney reflashing, gutter work and anything hidden under the existing roof. Those exclusions belong in the notes, priced per unit, so a change order is a conversation about quantity rather than about whether the work was covered.',
    },
    {
      heading: 'How roofers price by the square',
      body: 'Roofing is sold by the square — 100 square feet of roof surface, not floor area. A 2,000 square foot single-storey house with a moderate 6/12 pitch typically works out around 22 to 25 squares once you add for pitch and overhangs. Measure from the ground with a satellite tool or off the plans, then add roughly 10 percent for waste on a simple gable and 15 percent on a cut-up hip roof with valleys. Steeper than 8/12 or a second storey means staging, harnesses and slower production, so most crews add a pitch and height factor rather than raising the base rate. Price tear-off separately per square per layer. Keeping your unit rates per square, per linear foot and per hour makes it obvious which part of a job is eroding your margin when you review it afterwards.',
    },
    {
      heading: 'Turning the estimate into a signed job',
      body: 'Get the estimate to the homeowner the same day you climb down. Roofing decisions are usually made between two or three contractors within a week, and the one who follows up first with a document that looks professional wins more often than the cheapest bid. Put your licence number, insurance carrier and manufacturer certification on the estimate — those are the trust signals a homeowner checks. Give the price a validity window of 15 to 30 days, because shingle pricing moves and you do not want a quote from last spring honoured this autumn. Spell out the payment schedule: a deposit at contract signing, a progress payment on material delivery, and the balance on completion and final inspection. Attach photographs of the damage you found. A clear scope with photos and a firm expiry date removes almost every reason to delay.',
    },
  ],
  faq: [
    {
      q: 'Is this roofing estimate template really free?',
      a: 'Yes. There is no signup, no email required, no trial and no watermark on the PDF. Fill in the line items, download the file and send it to your customer. The generator runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge per square for a roof?',
      a: 'Across most of the US, a full residential asphalt re-roof runs roughly $450 to $700 per square installed, covering tear-off, underlayment, shingles and labour. Steep pitch, second-storey access, multiple layers or premium shingles push it higher. The template splits those costs into separate lines so you can set each rate to your own local numbers rather than guessing at a blended figure.',
    },
    {
      q: 'Should a roofing estimate include a deposit?',
      a: 'Most roofers take a deposit of 10 to 30 percent at signing, with a progress payment when materials are delivered and the balance on completion. Some states cap residential deposits, so check your own rules. Whatever you choose, write the schedule into the notes and terms section so it appears on the PDF and there is no argument later.',
    },
    {
      q: 'What is the difference between an estimate and a quote?',
      a: 'An estimate is your best professional judgement of the cost and can move if the scope changes — a second layer of shingles or rotten decking, for example. A quote is a fixed price you are agreeing to hold. Roofing usually starts as an estimate because so much is hidden until tear-off. Make it clear which one you are giving in the notes.',
    },
  ],
};

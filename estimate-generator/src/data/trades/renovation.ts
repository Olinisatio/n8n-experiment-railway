import type { Trade } from '../types';

export const renovation: Trade = {
  slug: 'renovation',
  name: 'Renovation',
  h1: 'Renovation Estimate Template',
  metaTitle: 'Free Renovation Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free renovation estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup.',
  intro:
    'Renovation is the trade where the estimate matters most, because the client is living in the job. They are not just buying a kitchen; they are buying six weeks of disruption, and the document that explains what happens when tends to beat the one that is slightly cheaper. This template arrives pre-filled for a mid-range kitchen or bathroom renovation: design and permits, demolition, framing alterations, electrical and plumbing rough-in, drywall and paint, cabinetry, flooring, a fixtures and appliances allowance, and project management. Change any line to match your scope, adjust the allowances to the client’s selections, and add rows for tiling, glazing or structural work. Markup and tax stay as separate visible fields. The PDF carries your logo, licence number, payment schedule and exclusions. Everything runs in your browser — no signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Design, drawings and permit applications', unit: 'each', defaultQty: 1, defaultRate: 2400 },
    { description: 'Demolition, protection and disposal', unit: 'sq ft', defaultQty: 220, defaultRate: 8.5 },
    { description: 'Framing alterations and structural blocking', unit: 'linear ft', defaultQty: 60, defaultRate: 42 },
    { description: 'Electrical and plumbing rough-in', unit: 'allowance', defaultQty: 1, defaultRate: 5600 },
    { description: 'Drywall, taping, priming and paint', unit: 'sq ft', defaultQty: 780, defaultRate: 4.25 },
    { description: 'Cabinetry and millwork, installed', unit: 'linear ft', defaultQty: 22, defaultRate: 385 },
    { description: 'Flooring, supplied and installed', unit: 'sq ft', defaultQty: 220, defaultRate: 12.5 },
    { description: 'Fixtures, fittings and appliances', unit: 'allowance', defaultQty: 1, defaultRate: 4200 },
    { description: 'Project management and coordination', unit: 'hour', defaultQty: 45, defaultRate: 85 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'hour', 'day', 'each', 'allowance', 'week'],
  bodyContent: [
    {
      heading: 'What to include in a renovation estimate',
      body: 'Sequence and allowances. Order the lines the way the work actually happens — demolition, structure, rough-in, close-up, finishes — so the client can read the estimate as a schedule as well as a price. Use allowances for anything they have not chosen yet, state the figure clearly, and say what happens when the real selection costs more or less. Show design and permit work as paid line items rather than absorbing them, because they are real hours and clients who have not paid for drawings tend to revise them endlessly. Put project management on the page. Then write the exclusions that renovation always needs: concealed structural damage, outdated wiring or plumbing exposed during demolition, asbestos or lead in older properties, and levelling of out-of-true floors and walls.',
    },
    {
      heading: 'How renovation work is priced',
      body: 'Most renovation is estimated as a set of trade packages with overhead and profit applied on top, rather than as a single per-square-foot rate — but the per-square-foot check is still useful for sanity. Typical US ranges: a mid-range kitchen $25,000 to $60,000, a full bathroom $12,000 to $30,000, and whole-house renovation $100 to $250 per square foot depending on how much moves. Cabinetry is usually the largest single line in a kitchen and is priced per linear foot of run. Contingency matters more here than in new build: 10 to 15 percent is normal, and the honest way to present it is as a stated contingency the client can see, rather than as padding hidden in the trade lines where it quietly disappears into your margin.',
    },
    {
      heading: 'Living through the job',
      body: 'The questions clients actually lose sleep over are rarely about price. Will the kitchen be unusable, and for how long? Is the bathroom out of action? Who has a key, when do people arrive, and will there be dust everywhere? Answer all of it in the notes, because a renovation estimate that reads like it was written by someone who has done this before is worth more than a discount. Set the payment schedule against verifiable milestones — deposit, rough-in inspection passed, cabinetry delivered, substantial completion — rather than dates. Say how change orders get approved and that work pauses until they are signed. Give a realistic duration with a stated allowance for supplier lead times, and the single most common source of renovation resentment disappears.',
    },
  ],
  faq: [
    {
      q: 'Is this renovation estimate template free?',
      a: 'Yes. No signup, no email required, no trial and no watermark on the PDF. Fill in your line items, download the file and send it to your client. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much contingency should a renovation estimate carry?',
      a: 'Ten to fifteen percent is standard, and more on properties over fifty years old where concealed conditions are likely. Present it as a visible contingency line the client understands, not as padding buried in trade rates — a stated contingency that goes unspent builds far more trust than a mysterious total that happens to be accurate.',
    },
    {
      q: 'How do allowances work on a renovation?',
      a: 'An allowance is a stated budget for something not yet selected — tiles, fixtures, appliances. Put the figure on the estimate and say what it covers. When the client picks the actual product, the difference becomes a documented change order. Allowances set realistically protect both sides; allowances set low to win the bid cause disputes.',
    },
    {
      q: 'What should a renovation estimate exclude?',
      a: 'Anything hidden behind existing finishes: structural damage, rot, outdated wiring or plumbing found at demolition, asbestos or lead in older buildings, and floors and walls that turn out to be badly out of true. List each in the notes with a unit price so a discovery becomes a quantity change rather than an argument.',
    },
  ],
};

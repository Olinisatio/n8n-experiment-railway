import type { Trade } from '../types';

export const construction: Trade = {
  slug: 'construction',
  name: 'Construction',
  h1: 'Construction Estimate Template',
  metaTitle: 'Free Construction Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free construction estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup.',
  intro:
    'A construction estimate has to do two jobs at once: convince a client the price is fair, and protect you when the scope moves. This template does both by breaking a project into the divisions a client actually recognises — site prep, demolition, framing, rough mechanicals, drywall, finishes, permits and supervision — rather than presenting a single intimidating number. It arrives pre-filled for a mid-size residential addition so you have realistic quantities to adjust rather than a blank page. Change any description, quantity or unit rate, add rows for excavation, roofing or specialty work, and delete anything the job does not include. Markup and tax are separate fields, so overhead and profit stay visible to you and legible to the client. The PDF carries your logo, licence number and terms. Everything runs in your browser, with no signup, no email gate and no watermark.',
  lineItems: [
    { description: 'Site preparation, protection and staging', unit: 'day', defaultQty: 2, defaultRate: 450 },
    { description: 'Demolition and debris removal', unit: 'sq ft', defaultQty: 400, defaultRate: 6.5 },
    { description: 'Framing labour and lumber package', unit: 'sq ft', defaultQty: 400, defaultRate: 28 },
    { description: 'Rough plumbing, electrical and HVAC', unit: 'allowance', defaultQty: 1, defaultRate: 6800 },
    { description: 'Drywall, tape and level 4 finish', unit: 'sq ft', defaultQty: 1200, defaultRate: 2.75 },
    { description: 'Interior finishes, doors and trim', unit: 'sq ft', defaultQty: 400, defaultRate: 22 },
    { description: 'Permit, plan review and inspection fees', unit: 'each', defaultQty: 1, defaultRate: 1450 },
    { description: 'Project management and supervision', unit: 'hour', defaultQty: 60, defaultRate: 85 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'cubic yard', 'hour', 'day', 'each', 'allowance'],
  bodyContent: [
    {
      heading: 'What to include in a construction estimate',
      body: 'Structure the estimate by phase, not by supplier invoice. A client reading "framing", "rough mechanicals", "drywall", "finishes" can follow the project in their head; the same numbers grouped by vendor mean nothing to them. Use allowances deliberately and label them as allowances — fixtures, appliances and finish selections are the items clients change their minds about, and an allowance converts an argument into an arithmetic problem. Show permits and plan review separately, because those costs are set by the municipality and are not yours to discount. Put supervision on the page as real work; it is the line most often stripped out by an underbidding competitor and the first thing missed when a project goes badly. Then list the exclusions plainly: unforeseen structural repair, hazardous material abatement, rock in excavation and utility upgrades.',
    },
    {
      heading: 'How construction work gets priced',
      body: 'Most residential construction is estimated bottom-up: quantities from the drawings, unit rates from your own historical costs, then overhead and profit applied on top. Typical US figures for a residential addition run $200 to $500 per square foot depending on region and finish level, with framing and rough mechanicals each commonly taking 15 to 20 percent of the total. Keep your markup visible and separate rather than baked into unit rates — it lets you flex on scope without losing track of margin, and it survives the conversation where a client asks you to remove one item. General conditions and supervision typically run 8 to 15 percent of direct cost. If your unit rates come from finished jobs rather than supplier quotes, your estimates will get steadily more accurate.',
    },
    {
      heading: 'Change orders start in the estimate',
      body: 'Every disputed change order traces back to an estimate that was silent on something. The fix is cheap: write the exclusions and price them per unit before you start. "Structural repair to existing framing, quoted at $95 per linear foot if required" costs you one line and converts a bad conversation into a signature. Set out the payment schedule against milestones a client can verify — deposit at contract, progress at framing complete, at rough-in inspection passed, at substantial completion — rather than against dates, which drift. State how change orders are approved and that work does not proceed without written approval. Give the estimate a validity window, because lumber and steel pricing move faster than most schedules do.',
    },
  ],
  faq: [
    {
      q: 'Is this construction estimate template free?',
      a: 'Yes, completely. There is no signup, no email required and no watermark on the PDF. Fill in your line items, download the file and send it to your client. It runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'What markup should I use on a construction estimate?',
      a: 'Residential contractors commonly apply 15 to 25 percent to cover overhead and profit, with smaller jobs carrying more because fixed costs are spread over less revenue. The template defaults to 20 percent as a separate, visible field, so you can adjust it per job and still see exactly what it contributes to the total.',
    },
    {
      q: 'How do I handle items the client has not chosen yet?',
      a: 'Use an allowance line with a stated dollar figure and say plainly what it covers. When the client selects the actual fixture or finish, the difference becomes a documented change order. Allowances that are labelled and realistic protect both sides; allowances that are quietly low to win the bid cause disputes later.',
    },
    {
      q: 'Should permits be included in the estimate?',
      a: 'Show them, always, as their own line. Permit and plan review fees are set by the municipality and are not a place you can compete on price, so hiding them only makes your number look inflated. Listing them also makes clear that the work will be permitted and inspected, which matters at resale.',
    },
  ],
};

import type { Trade } from '../types';

export const contractor: Trade = {
  slug: 'contractor',
  name: 'Contractor',
  h1: 'Contractor Estimate Template',
  metaTitle: 'Free Contractor Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free contractor estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup.',
  intro:
    'This is the general-purpose version: a contractor estimate template that works whatever the job is. It starts with the structure almost every contractor estimate shares — a site visit, a materials figure, skilled labour, helper hours, equipment, disposal, permits and supervision — so you are adjusting realistic numbers rather than staring at an empty table. Rename any line to match your trade, change the units, add rows and delete what does not apply. Markup and tax are separate fields so your overhead and profit stay visible while you work. The generator totals everything as you type and exports a PDF with your logo, licence number, terms and an acceptance line for the customer to sign. Your business details save in this browser, so the second estimate takes about ninety seconds. No signup, no email gate and no watermark on the file you hand over.',
  lineItems: [
    { description: 'Site visit, measurement and scope assessment', unit: 'each', defaultQty: 1, defaultRate: 250 },
    { description: 'Materials and supplies', unit: 'allowance', defaultQty: 1, defaultRate: 3500 },
    { description: 'Skilled trade labour', unit: 'hour', defaultQty: 80, defaultRate: 75 },
    { description: 'Helper and general labour', unit: 'hour', defaultQty: 40, defaultRate: 45 },
    { description: 'Equipment and tool rental', unit: 'day', defaultQty: 3, defaultRate: 185 },
    { description: 'Dumpster rental and disposal', unit: 'each', defaultQty: 1, defaultRate: 525 },
    { description: 'Permit and inspection fees', unit: 'each', defaultQty: 1, defaultRate: 350 },
    { description: 'Project supervision and coordination', unit: 'hour', defaultQty: 20, defaultRate: 85 },
  ],
  commonUnits: ['hour', 'day', 'sq ft', 'linear ft', 'each', 'allowance', 'week'],
  bodyContent: [
    {
      heading: 'What every contractor estimate needs',
      body: 'Six things, and most estimates are missing at least two. Your business name, licence number and contact details, so the customer can verify you exist. An estimate number and date, so there is no ambiguity about which version was agreed. A scope broken into lines a non-builder can read. A total with markup and tax shown separately rather than absorbed. A payment schedule. And an expiry date, because a price you gave in March is not a price you owe in September. Add a short exclusions paragraph and you have removed almost every reason a job goes sideways. The template covers all of it by default, including an acceptance line at the bottom for the customer to sign and date, which turns the estimate into a record of agreement rather than a piece of marketing.',
    },
    {
      heading: 'Pricing labour, materials and markup',
      body: 'Keep the three apart. Materials priced at cost with a visible markup lets you handle supplier increases without renegotiating labour. Labour split into skilled and helper hours reflects how crews actually work and keeps your estimate honest when a job runs long. Markup on top, as a separate percentage, is what covers your truck, insurance, phone, unbilled hours and profit — most residential contractors apply 15 to 25 percent, with smaller jobs needing more because fixed costs spread over less revenue. The mistake that kills small contractors is folding overhead into an hourly rate and then discounting that rate to win work, because it hides which jobs are actually profitable. Separate fields make the trade-off visible while you are still able to change it.',
    },
    {
      heading: 'Turning an estimate into a signed job',
      body: 'Speed matters more than polish, and polish matters more than price. Most residential customers collect two or three quotes and decide within a week; the contractor who sends a clear document the same day is frequently chosen over a cheaper bid that arrives on Friday. Include the things people are quietly worried about: how long the work takes, how many people will be on site, what happens to the mess, and who to call. Put your licence and insurance on the page. Set a deposit that funds materials without asking the customer to finance your business — 10 to 30 percent is normal, and some states cap it. Then follow up once, by phone, three days later. That single call closes more work than any change to the estimate itself.',
    },
  ],
  faq: [
    {
      q: 'Is this contractor estimate template free?',
      a: 'Yes, entirely free. No signup, no email required, no trial and no watermark on the PDF. Fill in the line items, download the file and send it to your customer. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'What should a contractor estimate include?',
      a: 'Your business name, licence and contact details; an estimate number and date; an itemised scope with quantities and rates; subtotal, markup and tax shown separately; the total; a payment schedule; an expiry date; and a short list of exclusions. The template includes all of these by default, plus an acceptance line for signature.',
    },
    {
      q: 'How much deposit should I ask for?',
      a: 'Ten to thirty percent at signing is standard for residential work, usually enough to cover material purchases without asking the customer to fund your operation. Several states cap residential deposits by law, so check your own rules. Write the schedule into the notes so it appears on the PDF and there is no argument later.',
    },
    {
      q: 'Is an estimate legally binding?',
      a: 'Generally no — an estimate is a good-faith projection, not a contract, and it can change if the scope does. A quote you present as a fixed price is closer to an offer that can be accepted. Either way, state which one you are giving, list your exclusions, and use a signed contract for the work itself.',
    },
  ],
};

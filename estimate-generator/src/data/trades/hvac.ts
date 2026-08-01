import type { Trade } from '../types';

export const hvac: Trade = {
  slug: 'hvac',
  name: 'HVAC',
  h1: 'HVAC Estimate Template',
  metaTitle: 'Free HVAC Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free HVAC estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'An HVAC changeout is one of the largest single purchases a homeowner makes without shopping around properly, and the estimate is doing most of the selling. This template arrives pre-filled for a typical residential system replacement — load calculation, a three-ton condenser and coil, a high-efficiency gas furnace, supply and return ductwork by the foot, registers, line set and charge, a smart thermostat, the permit and your technician hours. Every line is editable, so you can turn it into a straight condenser swap, a full dual-fuel system or a ductless mini-split job in under a minute. Totals update live, including your markup and tax, and the PDF carries your logo and licence number. Because equipment model numbers and efficiency ratings are what customers compare between bids, put them in the descriptions. Nothing leaves your browser and there is no signup or watermark.',
  lineItems: [
    { description: 'Manual J load calculation and system design', unit: 'each', defaultQty: 1, defaultRate: 350 },
    { description: '3-ton 16 SEER2 condenser and matched coil', unit: 'each', defaultQty: 1, defaultRate: 4800 },
    { description: 'Gas furnace, 80,000 BTU 96% AFUE', unit: 'each', defaultQty: 1, defaultRate: 2950 },
    { description: 'Supply and return ductwork, insulated', unit: 'linear ft', defaultQty: 140, defaultRate: 28 },
    { description: 'Supply registers and return grilles', unit: 'each', defaultQty: 10, defaultRate: 45 },
    { description: 'Line set, drier and refrigerant charge', unit: 'each', defaultQty: 1, defaultRate: 685 },
    { description: 'Smart thermostat, supplied and installed', unit: 'each', defaultQty: 1, defaultRate: 385 },
    { description: 'Permit, inspection and start-up report', unit: 'each', defaultQty: 1, defaultRate: 295 },
    { description: 'HVAC technician labour', unit: 'hour', defaultQty: 24, defaultRate: 115 },
  ],
  commonUnits: ['each', 'linear ft', 'ton', 'hour', 'day', 'system'],
  bodyContent: [
    {
      heading: 'What to include in an HVAC estimate',
      body: 'Put the model numbers on the page. Efficiency rating, capacity, manufacturer and warranty term are exactly what a homeowner will use to compare you against the other two bids, and leaving them off makes you look like the cheap option even when you are not. Show the load calculation as a line item — it is the single clearest signal that you sized the system rather than matched whatever was there. Break equipment, ductwork, controls and labour apart, because ductwork is frequently the difference between two bids and the customer deserves to see it. List the permit and the start-up report. In exclusions, cover asbestos-wrapped duct, undersized electrical service, returns that need to be added and any structural work needed to fit the new cabinet, each with a unit price.',
    },
    {
      heading: 'How HVAC contractors price a changeout',
      body: 'Residential replacements are usually quoted as a system price built from equipment cost, ductwork, controls and labour, with a target gross margin applied over the whole job. Typical US ranges: a three-ton 16 SEER2 air conditioner installed $6,000 to $10,000, a 96% AFUE gas furnace $4,000 to $7,500, and a complete dual-system changeout $10,000 to $18,000 depending on ductwork. Ductless mini-splits run roughly $3,500 to $6,000 per head. Technician labour typically bills at $100 to $150 an hour. The number that moves most between quotes is duct modification, because a correctly sized new system usually needs larger returns than the old one had. Pricing that separately protects you when a competitor has quietly ignored it.',
    },
    {
      heading: 'Rebates, financing and seasonality',
      body: 'HVAC buying decisions are made under pressure — usually in the first hot week or the first cold snap — and the estimate that answers the money question wins. Note any utility rebate or federal efficiency credit the specified equipment qualifies for, along with who files the paperwork. If you offer financing, put the monthly figure next to the total; a $9,000 system and a $150 month are the same thing to you and completely different things to the customer. Give the estimate a firm expiry date, because equipment pricing moves and your summer schedule fills. Offer good, better and best as separate estimates rather than a single confusing document, and let the efficiency ratings do the arguing.',
    },
  ],
  faq: [
    {
      q: 'Is this HVAC estimate template free?',
      a: 'Yes. No signup, no email required, no trial and no watermark on the PDF. Fill in your line items, download and send. It runs entirely in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge for an AC replacement?',
      a: 'A three-ton 16 SEER2 system installed in the US typically runs $6,000 to $10,000, with ductwork condition and access driving most of the spread. A full furnace and AC changeout commonly lands between $10,000 and $18,000. Set your own equipment cost and labour rate in the template rather than working from a national average.',
    },
    {
      q: 'Should I include a load calculation in the estimate?',
      a: 'Yes, and show it as a paid line item. A Manual J calculation is the difference between sizing a system and guessing, and putting it on the page tells a homeowner you did the engineering. It also protects you if the installed system is later blamed for comfort problems caused by the building envelope.',
    },
    {
      q: 'How long should an HVAC estimate stay valid?',
      a: 'Fifteen to thirty days is normal. Equipment pricing moves with supply, and refrigerant regulation changes have made older stock unpredictable. The template defaults to a valid-until date thirty days out, which prints on the PDF — shorten it during peak season if your schedule is tight.',
    },
  ],
};

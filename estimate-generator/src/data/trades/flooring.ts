import type { Trade } from '../types';

export const flooring: Trade = {
  slug: 'flooring',
  name: 'Flooring',
  h1: 'Flooring Estimate Template',
  metaTitle: 'Free Flooring Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free flooring estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Flooring quotes get compared on one number — price per square foot — which is exactly why yours should not be a single number. The customer looking at three bids cannot see that yours includes subfloor levelling, moisture barrier and new baseboard while the cheapest one is material and a fitter. This template separates all of it. It arrives pre-filled for a roughly 950 square foot luxury vinyl plank installation: removal and disposal of the existing floor, subfloor prep and levelling, underlayment, material, installation labour, baseboard and quarter round, transitions, and furniture moving. Swap the material line for hardwood, laminate or tile, adjust the area, and change any rate to your own supplier pricing. Totals update as you type and the PDF carries your logo, licence number and terms. No signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Remove and dispose of existing flooring', unit: 'sq ft', defaultQty: 950, defaultRate: 2.25 },
    { description: 'Subfloor preparation and levelling', unit: 'sq ft', defaultQty: 950, defaultRate: 1.85 },
    { description: 'Underlayment and moisture barrier', unit: 'sq ft', defaultQty: 950, defaultRate: 0.85 },
    { description: 'Luxury vinyl plank, supplied', unit: 'sq ft', defaultQty: 950, defaultRate: 4.25 },
    { description: 'Installation labour', unit: 'sq ft', defaultQty: 950, defaultRate: 3.5 },
    { description: 'Baseboard and quarter round, installed', unit: 'linear ft', defaultQty: 320, defaultRate: 4.25 },
    { description: 'Transitions and thresholds', unit: 'each', defaultQty: 8, defaultRate: 45 },
    { description: 'Furniture moving and reset', unit: 'hour', defaultQty: 4, defaultRate: 65 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'each', 'hour', 'day', 'box', 'room'],
  bodyContent: [
    {
      heading: 'What to include in a flooring estimate',
      body: 'Separate material from labour, always. It is the only way a customer can compare a mid-range plank installed properly against a premium plank installed badly, and it lets them upgrade the product without renegotiating the whole job. Name the product: manufacturer, collection, wear layer thickness and warranty. Show subfloor preparation as its own line — it is invisible when finished, it is what determines whether the floor lasts, and it is the first thing a low bid deletes. Include removal and disposal of the old floor, transitions at every doorway, and baseboard or quarter round, since a beautiful floor with a gap around the edge is a complaint waiting to happen. In exclusions, cover asbestos-containing tile in older homes, subfloor replacement, and doors that need trimming.',
    },
    {
      heading: 'How flooring is measured and priced',
      body: 'Measure room by room, add ten percent for waste on straight lays and fifteen percent on diagonal or herringbone patterns, and quote the waste openly rather than hiding it in the rate. Typical US figures: luxury vinyl plank $3 to $7 per square foot for material and $2 to $5 installed; engineered hardwood $4 to $12 material and $3 to $8 labour; tile $3 to $15 material with $5 to $12 labour depending on size and pattern. Subfloor levelling commonly runs $1 to $3 per square foot and is the line most likely to change after you lift the old floor. Price it as an estimate with a stated unit rate so a bad subfloor becomes a quantity adjustment the customer has already seen rather than an unwelcome surprise.',
    },
    {
      heading: 'Acclimatisation, subfloor and setting expectations',
      body: 'Most flooring failures are moisture failures, and most moisture disputes were avoidable with one paragraph on the estimate. State the acclimatisation period the manufacturer requires and that the material must sit in the property before installation — customers who expect delivery and installation on the same day need to hear that in advance. Note that you will test subfloor moisture and that installation over a failing reading is not something you will do. Say who moves furniture and appliances, who disconnects a gas cooker, and whether doors will need trimming. Give a realistic duration including cure time for adhesives and levelling compound. Being the contractor who explained all this before the job is also the contractor the customer recommends afterwards.',
    },
  ],
  faq: [
    {
      q: 'Is this flooring estimate template free?',
      a: 'Yes, entirely. No signup, no email required and no watermark on the PDF. Fill in your line items, download the file and send it to your customer. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much waste should I add to a flooring estimate?',
      a: 'Ten percent is standard for a straight lay in simple rooms, and fifteen percent for diagonal patterns, herringbone, or spaces with lots of cuts and angles. Quote the waste openly as part of the material quantity rather than absorbing it — running short mid-job costs far more than the extra box.',
    },
    {
      q: 'Should I quote material and labour separately?',
      a: 'Yes. It lets the customer upgrade or downgrade the product without renegotiating the installation, it protects your labour rate when material prices move, and it makes your bid readable against a competitor who has quoted a single blended figure that quietly excludes subfloor work.',
    },
    {
      q: 'What if the subfloor is worse than expected?',
      a: 'Price subfloor levelling as a line with a stated unit rate and a quantity based on what you could see, then note in the terms that the final quantity is confirmed once the old floor is lifted. That turns a bad subfloor into an agreed quantity adjustment rather than a difficult conversation on day one.',
    },
  ],
};

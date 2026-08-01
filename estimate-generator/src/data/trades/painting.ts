import type { Trade } from '../types';

export const painting: Trade = {
  slug: 'painting',
  name: 'Painting',
  h1: 'Painting Estimate Template',
  metaTitle: 'Free Painting Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free painting estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup.',
  intro:
    'Painting estimates go wrong in the prep. The coats are easy to price and easy to explain; it is the patching, caulking, masking and the third trip back for the trim that quietly eats the day. This template separates all of it, so the homeowner can see that two coats over prepared, primed drywall is a different job from two coats slapped over the old colour. It arrives pre-filled for a roughly 2,200 square foot interior repaint — surface prep, primer, two finish coats, trim and doors by the linear foot, masking and floor protection, paint by the gallon and your crew hours. Change any rate to your own numbers, add rows for ceilings, stairwells or cabinet refinishing, and delete what does not apply. Totals update as you type and the PDF carries your logo and licence number. Nothing leaves your browser, and there is no signup or watermark.',
  lineItems: [
    { description: 'Surface prep, sanding, patching and caulking', unit: 'sq ft', defaultQty: 2200, defaultRate: 0.65 },
    { description: 'Primer coat, stain-blocking', unit: 'sq ft', defaultQty: 2200, defaultRate: 0.55 },
    { description: 'First finish coat', unit: 'sq ft', defaultQty: 2200, defaultRate: 0.85 },
    { description: 'Second finish coat', unit: 'sq ft', defaultQty: 2200, defaultRate: 0.75 },
    { description: 'Trim, doors and casings, brushed', unit: 'linear ft', defaultQty: 320, defaultRate: 3.25 },
    { description: 'Masking and floor protection', unit: 'sq ft', defaultQty: 1400, defaultRate: 0.35 },
    { description: 'Paint and sundries', unit: 'gallon', defaultQty: 18, defaultRate: 58 },
    { description: 'Painting labour', unit: 'hour', defaultQty: 40, defaultRate: 55 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'gallon', 'hour', 'day', 'each', 'room'],
  bodyContent: [
    {
      heading: 'What to include in a painting estimate',
      body: 'Name the product. "Two coats of Sherwin-Williams Duration in eggshell" tells a homeowner something; "two coats of quality paint" tells them nothing and invites them to compare you against someone using contractor-grade flat. List prep as its own line, because prep is where your hours actually go and where a cheaper bid has quietly cut corners. Break out ceilings, walls, trim and doors separately — people change their minds about ceilings, and a separate line makes that a five-second conversation instead of a re-quote. Say how many coats and over what. State whether you are moving furniture or whether the room needs to be empty when you arrive. Put colour changes, wallpaper removal and repairs to damaged plaster in the exclusions, priced per unit, so an extra day is a quantity change rather than an argument.',
    },
    {
      heading: 'How painters price by the square foot',
      body: 'Most interior work is priced on wall square footage rather than floor area: perimeter multiplied by ceiling height, minus a rough allowance for windows and doors. A 2,000 square foot house typically comes out somewhere near 5,000 to 6,000 square feet of wall and ceiling once you count everything. Coverage runs about 350 to 400 square feet per gallon per coat on primed drywall, so a two-coat job with 2,200 square feet of surface needs roughly twelve to fourteen gallons before you add trim paint and touch-up. Where blended per-square-foot pricing goes wrong is heavy prep and awkward access: stairwells, high ceilings and rooms full of furniture cost the same in materials but far more in hours. Keep prep and labour on their own lines and you can see which jobs actually paid.',
    },
    {
      heading: 'Presenting the price so it holds up',
      body: 'Painting is one of the most heavily shopped trades, and homeowners routinely collect three quotes with wildly different numbers. The bid that wins is usually the one that makes the difference legible. Show what is included per room. Note the paint brand, line and sheen. Say how long the job takes and how many painters will be on site, because "four days, two painters" answers a question the homeowner has not asked out loud. Give the estimate a validity window of 15 to 30 days. Set a payment schedule — a deposit at signing, the balance on walkthrough — and say plainly that the walkthrough happens with them, in daylight, before final payment. That last sentence closes more jobs than a discount does.',
    },
  ],
  faq: [
    {
      q: 'Is this painting estimate template free?',
      a: 'Yes, completely. No signup, no email, no trial and no watermark on the PDF. Fill it in, download the file and send it to your customer. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge to paint a room?',
      a: 'A standard 12 by 12 bedroom with walls only typically runs $400 to $750 including materials, and $600 to $1,100 if you are doing ceilings, trim and doors too. Heavy prep, dark-to-light colour changes and high ceilings push it up. Set your own per-square-foot and hourly rates in the template rather than working from a blended national figure.',
    },
    {
      q: 'Should I charge for paint separately or include it?',
      a: 'Both work, but separating it is usually better. A line for paint by the gallon lets the customer upgrade to a premium product without renegotiating the whole job, and it protects your margin when material prices move. If you include it, say exactly which product the price assumes so an upgrade is a clear change order.',
    },
    {
      q: 'How long should a painting estimate stay valid?',
      a: 'Fifteen to thirty days is standard. Paint pricing moves and your schedule fills, so an open-ended quote works against you. The template sets a valid-until date thirty days out by default; change it in the date field and it appears on the PDF.',
    },
  ],
};

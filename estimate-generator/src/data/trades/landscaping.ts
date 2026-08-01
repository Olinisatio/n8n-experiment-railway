import type { Trade } from '../types';

export const landscaping: Trade = {
  slug: 'landscaping',
  name: 'Landscaping',
  h1: 'Landscaping Estimate Template',
  metaTitle: 'Free Landscaping Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free landscaping estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup.',
  intro:
    'Landscaping estimates cover an unusually wide range of units — square feet of sod, cubic yards of mulch, individual shrubs, linear feet of edging, irrigation zones and crew hours — and mixing them up is what makes a quote look amateurish. This template gives each its own line with the right unit already set. It arrives pre-filled for a typical front and side yard renovation: clearing and grading, screened topsoil, sod, planting beds, mulch, irrigation zones, steel edging and crew labour. Adjust quantities from your measurements, set rates to your own supplier pricing, and add rows for hardscape, drainage, lighting or tree work. Totals recalculate live, and the PDF carries your logo, licence number and terms, including the plant warranty language you actually want on the page. It runs entirely in your browser. No signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Site clearing, grading and soil preparation', unit: 'sq ft', defaultQty: 2500, defaultRate: 1.35 },
    { description: 'Screened topsoil, delivered and spread', unit: 'cubic yard', defaultQty: 12, defaultRate: 52 },
    { description: 'Sod, supplied and installed', unit: 'sq ft', defaultQty: 2000, defaultRate: 1.15 },
    { description: 'Shrubs and perennials, planted', unit: 'each', defaultQty: 24, defaultRate: 48 },
    { description: 'Hardwood mulch, delivered and spread', unit: 'cubic yard', defaultQty: 8, defaultRate: 65 },
    { description: 'Irrigation zone, installed and tested', unit: 'each', defaultQty: 4, defaultRate: 850 },
    { description: 'Steel landscape edging', unit: 'linear ft', defaultQty: 180, defaultRate: 8.5 },
    { description: 'Landscape crew labour', unit: 'hour', defaultQty: 32, defaultRate: 55 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'cubic yard', 'each', 'hour', 'day', 'pallet'],
  bodyContent: [
    {
      heading: 'What to include in a landscaping estimate',
      body: 'Quantities and species. "Twenty-four shrubs" is a number a client can count on delivery day; "planting as discussed" is a dispute waiting to happen. Name the plants, sizes and container grades, because a three-gallon shrub and a one-gallon shrub are the same line item and very different plants. Separate soil preparation from planting â prep is invisible once finished and is exactly what a cheaper competitor skipped. Show delivery and spreading as part of bulk material lines so a client understands why a cubic yard of mulch costs more installed than it does at the yard. Put your plant warranty in the notes with its actual terms: what is covered, for how long, and what voids it. Watering is almost always the client’s responsibility and almost never written down.',
    },
    {
      heading: 'How landscapers price by area and volume',
      body: 'Get the units right and the pricing follows. Sod, seeding and grading are square-foot work; topsoil, mulch and gravel are cubic-yard work — one cubic yard covers roughly 100 square feet at three inches deep, which is the conversion worth memorising. Plants and irrigation heads are priced individually, edging and borders by the linear foot. Typical US figures: sod installed $1 to $2 per square foot, hardwood mulch $50 to $80 per cubic yard spread, an irrigation zone $700 to $1,200 installed, and crew labour $45 to $70 per hour per person. Access drives cost more than clients expect — a back garden reachable only through a side gate can double the labour on the same volume of material, so price wheelbarrow work honestly rather than absorbing it.',
    },
    {
      heading: 'Seasonality, warranties and maintenance',
      body: 'Landscaping revenue is compressed into a short window, which means your estimate is competing for a schedule slot as much as for a budget. Say when you can start and how long the work takes. Price spring and autumn work with the knowledge that both your crew and your suppliers are stretched. Be explicit about the plant warranty, because it is the single most common source of post-job friction: a one-year warranty on shrubs and trees, conditional on the client watering as instructed, is standard and reasonable. Offer a maintenance line as an option rather than an assumption — most residential clients decline it and a few take it, and having the number on the page is the only way to find out which.',
    },
  ],
  faq: [
    {
      q: 'Is this landscaping estimate template free?',
      a: 'Yes. No signup, no email required, no trial and no watermark on the PDF. Fill in your line items, download the file and send it to your client. It runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge to install sod?',
      a: 'Across most of the US, sod supplied and installed runs $1 to $2 per square foot, with the spread driven by grading condition, access and whether topsoil is needed. Add the topsoil and clearing as separate lines rather than blending them, so a client with good soil is not paying for prep they do not need.',
    },
    {
      q: 'How do I price mulch and topsoil?',
      a: 'By the cubic yard, delivered and spread. One cubic yard covers roughly 100 square feet at three inches deep, so a 800 square foot bed area needs about eight yards. Price the material and the spreading together in one line, and note the depth in the description so there is no ambiguity about what was quoted.',
    },
    {
      q: 'Should I offer a plant warranty?',
      a: 'A one-year warranty on trees and shrubs is standard and helps close jobs, but write the conditions down. Cover replacement of the plant, exclude labour on repeat failures, and make it conditional on the client following your watering instructions. Put the terms in the notes so they print on the estimate rather than living in an email.',
    },
  ],
};

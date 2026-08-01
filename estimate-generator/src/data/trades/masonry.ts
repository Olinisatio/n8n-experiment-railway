import type { Trade } from '../types';

export const masonry: Trade = {
  slug: 'masonry',
  name: 'Masonry',
  h1: 'Masonry Estimate Template',
  metaTitle: 'Free Masonry Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free masonry estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Masonry is slow, skilled and heavy, and the estimate has to explain all three. A customer comparing a brick veneer job against a siding quote is looking at a number two or three times larger and needs to see where it goes: excavation, footings, block, brick, mortar and a great many hours of a trade that takes years to learn. This template arrives pre-filled for a typical veneer or retaining wall job — site prep, compacted base, concrete footing, block laid, brick veneer, mortar and materials, cap stones and mason hours. Adjust quantities to your take-off, swap brick for natural or manufactured stone, and add rows for lintels, weep systems, tuckpointing or chimney work. Totals recalculate live and the PDF carries your logo, licence number and terms. No signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Site preparation and excavation', unit: 'sq ft', defaultQty: 240, defaultRate: 3.85 },
    { description: 'Compacted gravel base', unit: 'cubic yard', defaultQty: 8, defaultRate: 62 },
    { description: 'Concrete footing, poured and cured', unit: 'linear ft', defaultQty: 60, defaultRate: 28 },
    { description: 'Concrete block, supplied', unit: 'each', defaultQty: 480, defaultRate: 2.9 },
    { description: 'Brick veneer, supplied', unit: 'sq ft', defaultQty: 240, defaultRate: 9 },
    { description: 'Mortar, sand, ties and flashing', unit: 'each', defaultQty: 1, defaultRate: 685 },
    { description: 'Cap stones and finishing detail', unit: 'linear ft', defaultQty: 60, defaultRate: 34 },
    { description: 'Mason labour', unit: 'hour', defaultQty: 64, defaultRate: 85 },
  ],
  commonUnits: ['sq ft', 'linear ft', 'each', 'cubic yard', 'hour', 'day', 'block'],
  bodyContent: [
    {
      heading: 'What to include in a masonry estimate',
      body: 'Footings and drainage. Every masonry failure a customer will ever see traces back to one of the two, and neither is visible in the finished wall. Show the excavation, the compacted base, the footing depth and the drainage provision as their own lines so a homeowner understands that a retaining wall is a structure rather than a stack of stone. Count block and brick individually where you can, since unit counts are checkable and build confidence. Name the material: brick type and colour, stone species, block size, mortar type and joint finish. Include ties, flashing and weep systems on veneer work. In exclusions, cover unsuitable soil requiring engineered footings, rock in excavation, structural engineering for walls above a certain height, and any repair to the existing structure the veneer attaches to.',
    },
    {
      heading: 'How masons price brick, block and stone',
      body: 'Masonry is labour dominated to a degree few other trades match — material is frequently under a third of the total. Typical US installed figures: concrete block $10 to $20 per square foot of wall, brick veneer $15 to $30, manufactured stone veneer $20 to $35, and natural stone $30 to $60. A skilled mason lays roughly 300 to 500 standard bricks or 100 to 200 blocks in a day depending on complexity, and that production rate is the single most important number in your estimate. Corners, openings, arches and any pattern work slow production dramatically without adding much area, which is why a small, detailed job can cost more per square foot than a large plain wall. Price detail work by the hour rather than the area.',
    },
    {
      heading: 'Weather, curing and matching existing work',
      body: 'Mortar will not cure properly below about 40°F or in driving rain, and pretending otherwise produces work that fails in the first winter. Put your weather conditions in the terms — the temperature range you will lay in, and that the schedule may move. Note the cure time before backfilling a wall or loading it, because an impatient customer with a digger causes more damage than the weather does. On repair and matching work, be honest in writing: new brick rarely matches weathered brick exactly, mortar colour changes as it cures, and efflorescence is normal and temporary. Saying so on the estimate costs you nothing and prevents the most common masonry complaint, which is not about workmanship at all but about a colour difference nobody warned the customer to expect.',
    },
  ],
  faq: [
    {
      q: 'Is this masonry estimate template free?',
      a: 'Yes, completely. No signup, no email required and no watermark on the PDF. Fill in the line items, download the file and send it to your customer. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge per square foot for brick?',
      a: 'Brick veneer installed typically runs $15 to $30 per square foot across the US, with manufactured stone $20 to $35 and natural stone $30 to $60. Labour is usually more than half the total. Corners, openings and detail work slow production sharply, so price those by the hour rather than by area.',
    },
    {
      q: 'How do I estimate mason production rates?',
      a: 'A skilled mason lays roughly 300 to 500 standard bricks or 100 to 200 blocks per day on straightforward runs, and considerably fewer on work with corners, openings or pattern detail. Build your hours from your own measured production rather than a published figure, then price detail work separately.',
    },
    {
      q: 'Should the estimate mention colour matching?',
      a: 'Yes, on any repair or extension work. New brick rarely matches weathered brick exactly, mortar colour shifts as it cures, and efflorescence is normal and temporary. Writing that into the notes costs nothing and prevents the most common masonry complaint, which is about appearance rather than workmanship.',
    },
  ],
};

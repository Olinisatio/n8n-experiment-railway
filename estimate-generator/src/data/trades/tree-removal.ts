import type { Trade } from '../types';

export const treeRemoval: Trade = {
  slug: 'tree-removal',
  name: 'Tree Removal',
  h1: 'Tree Removal Estimate Template',
  metaTitle: 'Free Tree Removal Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free tree removal estimate template with a built-in calculator. Edit the line items, set your rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Tree work is priced on risk, not on wood. Two identical oaks — one in an open field, one leaning over a conservatory and a neighbour’s garage — are the same tree and completely different jobs. A good estimate makes that legible, so the customer understands they are paying for rigging, access and liability rather than for chainsaw time. This template arrives pre-filled for a multi-tree residential job: site assessment and permit check, removals by size, stump grinding, chipping and haul-away, bucket truck or crane time, property protection and climbing crew hours. Adjust the counts and sizes to the walkthrough, set rates to your own numbers, and add rows for crown reduction, deadwooding or emergency storm work. Totals recalculate live and the PDF carries your business name, insurance details and terms. No signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Site assessment, utility and permit check', unit: 'each', defaultQty: 1, defaultRate: 150 },
    { description: 'Tree removal, large (over 60 ft)', unit: 'each', defaultQty: 1, defaultRate: 1650 },
    { description: 'Tree removal, medium (30–60 ft)', unit: 'each', defaultQty: 2, defaultRate: 850 },
    { description: 'Stump grinding, below grade', unit: 'each', defaultQty: 3, defaultRate: 225 },
    { description: 'Limb chipping and debris haul-away', unit: 'cubic yard', defaultQty: 12, defaultRate: 38 },
    { description: 'Bucket truck or crane time', unit: 'hour', defaultQty: 4, defaultRate: 325 },
    { description: 'Property protection and traffic control', unit: 'each', defaultQty: 1, defaultRate: 185 },
    { description: 'Climbing crew labour', unit: 'hour', defaultQty: 16, defaultRate: 85 },
  ],
  commonUnits: ['each', 'hour', 'cubic yard', 'day', 'inch diameter', 'tree'],
  bodyContent: [
    {
      heading: 'What to include in a tree removal estimate',
      body: 'Identify each tree individually — species, rough height, trunk diameter and location on the property — so there is no argument about which three of the seven trees you quoted. Separate removal from stump grinding, because a surprising number of customers want the tree gone and the stump left, and it is a meaningful cost difference. Say what happens to the wood: chipped and hauled, left in rounds, or stacked. Show crane or bucket time separately when access requires it, since that is the line that explains an otherwise startling number. In exclusions, cover permit fees if the municipality charges them, damage to lawns from equipment, root removal, and anything requiring a utility disconnect. Note that you will not work in high wind and that weather may move the date.',
    },
    {
      heading: 'How tree services price risk and access',
      body: 'Height and diameter set the baseline; everything else is a multiplier. Typical US removal pricing runs $400 to $900 for a tree under 30 feet, $800 to $1,500 for 30 to 60 feet, and $1,500 to $4,000 or more above 60 feet. Stump grinding commonly runs $150 to $400 per stump or $3 to $6 per inch of diameter. Crane hire adds $300 to $500 an hour but frequently reduces total labour on a difficult removal, and pricing it as a visible line helps a customer understand why the crane option is cheaper than the alternative. Proximity to structures, power lines and fences is the real driver — a tree that must be dismantled and lowered piece by piece can cost three times one that can simply be felled.',
    },
    {
      heading: 'Insurance and liability belong on the page',
      body: 'No trade has a larger gap between the cost of the job and the cost of getting it wrong. A customer letting someone drop a sixty-foot limb near their roof is buying insurance as much as arboriculture, so put your coverage on the estimate: general liability, workers’ compensation, carrier name and limits. Uninsured operators compete on price precisely because they have removed that cost, and the only way to win that comparison is to make it visible. Note who is responsible for checking preservation orders or protected species rules, which vary enormously by municipality. State that emergency and storm call-outs are priced differently, and give the rate up front so a customer with a tree on their garage is not negotiating in the rain.',
    },
  ],
  faq: [
    {
      q: 'Is this tree removal estimate template free?',
      a: 'Yes, entirely. No signup, no email required and no watermark on the PDF. Fill in the line items, download the file and send it to your customer. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge to remove a tree?',
      a: 'US pricing typically runs $400 to $900 for a tree under 30 feet, $800 to $1,500 for 30 to 60 feet, and $1,500 to $4,000 or more above that. Proximity to buildings and power lines matters more than size alone. Price each tree as its own line so the customer can see which one is driving the total.',
    },
    {
      q: 'Should stump grinding be a separate line?',
      a: 'Yes. Plenty of customers want the tree removed and are happy to leave the stump, and a separate line lets them choose without a new quote. Grinding commonly runs $150 to $400 per stump, or $3 to $6 per inch of trunk diameter if you prefer to price it that way.',
    },
    {
      q: 'What should the estimate say about insurance?',
      a: 'Name your general liability and workers’ compensation coverage and the carrier. Tree work carries more risk than almost any residential trade, and customers comparing you against an uninsured operator need to see what the difference buys. Put it in the notes so it prints on the PDF alongside your licence number.',
    },
  ],
};

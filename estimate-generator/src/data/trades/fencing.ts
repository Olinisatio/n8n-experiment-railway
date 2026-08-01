import type { Trade } from '../types';

export const fencing: Trade = {
  slug: 'fencing',
  name: 'Fencing',
  h1: 'Fencing Estimate Template',
  metaTitle: 'Free Fencing Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free fencing estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Fencing looks like a simple linear-foot calculation until you count the gates, the corners and the slope. This template handles all of it separately, so a customer can see why two hundred feet of fence is not simply two hundred times a number. It arrives pre-filled for a typical residential cedar privacy job: layout and utility locate, post holes set in concrete, pressure-treated posts, six-foot cedar panels, a walk gate, a double drive gate, removal of the old fence, and crew hours. Adjust the run length, swap cedar for vinyl or chain link, and add rows for slope stepping, rock in post holes or staining. Totals recalculate as you type and the PDF carries your logo, licence number and terms — including the property line and permit language that saves arguments later. No signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Layout, marking and utility locate', unit: 'each', defaultQty: 1, defaultRate: 185 },
    { description: 'Post holes dug and set in concrete', unit: 'each', defaultQty: 26, defaultRate: 65 },
    { description: 'Pressure-treated 4x4 posts', unit: 'each', defaultQty: 26, defaultRate: 28 },
    { description: 'Cedar privacy fence, 6 ft, supplied and built', unit: 'linear ft', defaultQty: 200, defaultRate: 32 },
    { description: 'Walk gate, single, with hardware', unit: 'each', defaultQty: 1, defaultRate: 485 },
    { description: 'Drive gate, double, with hardware', unit: 'each', defaultQty: 1, defaultRate: 985 },
    { description: 'Removal and disposal of existing fence', unit: 'linear ft', defaultQty: 200, defaultRate: 6.5 },
    { description: 'Fencing crew labour', unit: 'hour', defaultQty: 32, defaultRate: 60 },
  ],
  commonUnits: ['linear ft', 'each', 'hour', 'day', 'panel', 'post', 'gate'],
  bodyContent: [
    {
      heading: 'What to include in a fencing estimate',
      body: 'Gates and posts, itemised. A gate costs three to five times a comparable length of fence once you count the hardware and the extra bracing, and a customer who sees "200 linear feet" with gates buried inside it will assume they can add another one for free. Count posts explicitly, note the spacing, and say how deep they are set and whether they are concreted. Name the material and grade — western red cedar, pressure-treated pine, vinyl, galvanised chain link — with the height. Include removal and disposal of the existing fence, which is heavy, awkward and never free. Then set out the exclusions: rock or roots in post holes, sloped ground requiring stepped or racked panels, staining and sealing, and any survey work to confirm the property line.',
    },
    {
      heading: 'How fence contractors price by the foot',
      body: 'Linear foot pricing is the industry norm, but it only works if gates, corners and terrain are priced separately. Typical US installed figures: chain link $15 to $30 per linear foot, pressure-treated wood $20 to $40, cedar privacy $25 to $50, and vinyl $30 to $60. Gates commonly run $300 to $700 for a walk gate and $800 to $1,800 for a double drive gate. Posts are usually set at six to eight foot centres, and each needs roughly one to two bags of concrete depending on depth and diameter. Slope is the hidden cost: stepped panels waste material and racked panels take longer to build, so a sloping run can add twenty to thirty percent in labour on an otherwise identical fence.',
    },
    {
      heading: 'Property lines, permits and the neighbour problem',
      body: 'More fence jobs go wrong over location than over craftsmanship. Put it in the notes plainly: you build where the customer directs, the customer is responsible for confirming the property line, and a survey is available at extra cost if they want certainty. Note whether the municipality requires a permit and whether a homeowners’ association needs to approve the design and height — both are common, both are the customer’s responsibility, and both can stop a job on the morning you arrive. Say who talks to the neighbour, because a shared boundary fence involves two households and only one of them is paying you. Finally, call the utility locate service and put that on the estimate as a line; it is free in most states and hitting a gas line is not.',
    },
  ],
  faq: [
    {
      q: 'Is this fencing estimate template free?',
      a: 'Yes, completely. No signup, no email required and no watermark on the PDF. Fill in the line items, download the file and send it to your customer. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge per linear foot for a fence?',
      a: 'Installed US pricing typically runs $15 to $30 per linear foot for chain link, $20 to $40 for pressure-treated wood, $25 to $50 for cedar privacy and $30 to $60 for vinyl. Price gates, corner posts and sloped sections separately rather than blending them into the per-foot rate.',
    },
    {
      q: 'How should I price gates?',
      a: 'As individual line items, never inside the linear footage. A gate needs heavier posts, bracing and hardware, and takes far longer than the equivalent run of fence. Walk gates commonly run $300 to $700 installed and double drive gates $800 to $1,800. Itemising them also stops a customer assuming another one is free.',
    },
    {
      q: 'Who is responsible for the property line?',
      a: 'The customer, and your estimate should say so. Note that you build where directed, that confirming the boundary is their responsibility, and that a survey is available at additional cost. Also flag permit and homeowners association approval requirements, since both can halt a job on the day you arrive.',
    },
  ],
};

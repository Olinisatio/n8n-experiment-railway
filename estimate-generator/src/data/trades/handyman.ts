import type { Trade } from '../types';

export const handyman: Trade = {
  slug: 'handyman',
  name: 'Handyman',
  h1: 'Handyman Estimate Template',
  metaTitle: 'Free Handyman Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free handyman estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup needed.',
  intro:
    'Handyman work is a dozen small jobs in a trench coat, and that is exactly what makes it hard to quote. Price the whole visit as one number and every extra request becomes free; price it task by task and the customer can see what they are buying and what adding one more thing costs. This template arrives set up for a typical punch-list visit: a service call covering the first hour, general repair hours, drywall patches, door adjustments, fixture installs, shelving, a materials allowance and disposal. Rename any line to match the actual list, adjust quantities, and add rows for the three things the customer will inevitably mention while you are already on the ladder. Totals recalculate live and the PDF carries your business name, insurance and terms. Everything runs in your browser — no signup, no email gate, no watermark.',
  lineItems: [
    { description: 'Service call, includes first hour on site', unit: 'each', defaultQty: 1, defaultRate: 125 },
    { description: 'General repair labour, additional hours', unit: 'hour', defaultQty: 6, defaultRate: 85 },
    { description: 'Drywall patch and paint touch-up', unit: 'each', defaultQty: 3, defaultRate: 145 },
    { description: 'Interior door adjustment or replacement', unit: 'each', defaultQty: 2, defaultRate: 185 },
    { description: 'Fixture and hardware installation', unit: 'each', defaultQty: 4, defaultRate: 95 },
    { description: 'Shelving, mounted and levelled', unit: 'linear ft', defaultQty: 12, defaultRate: 28 },
    { description: 'Materials and hardware', unit: 'allowance', defaultQty: 1, defaultRate: 185 },
    { description: 'Debris removal and disposal', unit: 'each', defaultQty: 1, defaultRate: 95 },
  ],
  commonUnits: ['each', 'hour', 'linear ft', 'sq ft', 'allowance', 'visit', 'half day'],
  bodyContent: [
    {
      heading: 'What to include in a handyman estimate',
      body: 'List every task as its own line, even the five-minute ones. It looks like more work than writing "general repairs" but it is what stops the visit expanding for free, and it shows the customer that a door that will not latch and a light fixture swap are genuinely different jobs. Include the service call or trip charge openly. Use a materials allowance rather than pricing every screw, and say what happens to the difference. Note your minimum — most handymen charge a one or two hour minimum, and a customer who knows that up front does not call about a single loose hinge. Then state plainly what you are not licensed to do in your area: electrical panel work, gas fitting, structural changes. Naming the boundary makes you look more professional, not less.',
    },
    {
      heading: 'Pricing small jobs so they actually pay',
      body: 'The economics of handyman work are dominated by travel and setup, not by the work itself. A thirty-minute repair twenty minutes away is a ninety-minute job, and pricing it at half an hour is how a busy week produces no money. That is why a service call covering the first hour is standard practice and worth defending: typical US rates run $75 to $150 for the call-out and $60 to $110 per hour thereafter, with a one to two hour minimum. Bundle intelligently — quoting a whole punch list at a modest discount over the individual tasks is better business than three separate trips at full rate. And price the awkward jobs honestly rather than as favours; the customer with a long list is a good customer, and the one who wants one tiny thing done cheaply usually is not.',
    },
    {
      heading: 'Scope creep and the ladder problem',
      body: 'Every experienced handyman knows the moment: you are on the ladder and the customer says "while you are up there". Handled well it is extra revenue; handled badly it is an hour you never billed. The estimate is where you set that up. Put a line in the notes saying additional tasks are quoted before they start and billed at your hourly rate. Carry the estimate with you so adding a task is a visible amendment rather than a vague nod. If the extra is genuinely two minutes, do it and say you are doing it — the goodwill is worth more than the money and it makes the next boundary easier to hold. What kills margin is not generosity, it is unrecorded generosity.',
    },
  ],
  faq: [
    {
      q: 'Is this handyman estimate template free?',
      a: 'Yes, completely. No signup, no email required, no trial and no watermark on the PDF. Fill in your tasks, download the file and send it to your customer. Everything runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should a handyman charge per hour?',
      a: 'Across most of the US, handyman rates run $60 to $110 per hour, with a service call of $75 to $150 covering the trip and often the first hour. Specialised work and licensed trades bill higher. Set your own rates in the template — a national average is a starting point, not a price.',
    },
    {
      q: 'Should I charge a minimum or a trip fee?',
      a: 'Yes, almost always. Travel and setup dominate the cost of small jobs, and a one to two hour minimum makes short visits viable. Put it on the estimate and in your terms so it is agreed before you arrive, rather than explained afterwards.',
    },
    {
      q: 'How do I handle extra tasks added on the day?',
      a: 'Write it into the notes: additional work is quoted before it starts and billed at your hourly rate plus materials. Then actually amend the estimate on site rather than agreeing verbally. The template lets you add a line and regenerate the PDF in seconds, which turns an awkward conversation into a document.',
    },
  ],
};

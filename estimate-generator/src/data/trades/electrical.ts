import type { Trade } from '../types';

export const electrical: Trade = {
  slug: 'electrical',
  name: 'Electrical',
  h1: 'Electrical Estimate Template',
  metaTitle: 'Free Electrical Estimate Template (PDF) — No Signup',
  metaDescription:
    'Free electrical estimate template with a built-in calculator. Edit the line items, set your own rates and download a professional PDF estimate. No signup.',
  intro:
    'Electrical work is sold per device far more often than per hour, and a good estimate shows that. A homeowner who sees "8 outlets at $185 each" understands what they are buying; the same job written as a lump sum invites them to wonder what they are paying for. This template comes pre-filled with the items that make up most residential work — diagnostic call, outlets, switches, recessed lights, a panel upgrade, rough-in wiring by the foot, the permit and your licensed hours. Adjust the counts to the walkthrough, change any rate to your own pricing, and add rows for EV chargers, ceiling fans or generator transfer switches. The generator totals as you type and produces a PDF with your logo and licence number, which matters more in this trade than most. It runs entirely in your browser — no signup, no email, no watermark.',
  lineItems: [
    { description: 'Service call and diagnostic', unit: 'each', defaultQty: 1, defaultRate: 135 },
    { description: 'Outlet install, 15A tamper-resistant', unit: 'each', defaultQty: 8, defaultRate: 185 },
    { description: 'Switch install, single pole', unit: 'each', defaultQty: 6, defaultRate: 165 },
    { description: 'Recessed LED light, supplied and installed', unit: 'each', defaultQty: 12, defaultRate: 210 },
    { description: '200A service panel upgrade', unit: 'each', defaultQty: 1, defaultRate: 2650 },
    { description: 'Rough-in wiring, 12/2 NM cable', unit: 'linear ft', defaultQty: 350, defaultRate: 4.25 },
    { description: 'Permit and inspection fee', unit: 'each', defaultQty: 1, defaultRate: 285 },
    { description: 'Licensed electrician labour', unit: 'hour', defaultQty: 16, defaultRate: 105 },
  ],
  commonUnits: ['each', 'linear ft', 'hour', 'day', 'circuit', 'device'],
  bodyContent: [
    {
      heading: 'What to include in an electrical estimate',
      body: 'Count devices and price them individually. Outlets, switches, fixtures and circuits are what the customer can see and verify, and a per-device line makes adding two more outlets a trivial change rather than a renegotiation. Separate the diagnostic or service call so it reads as real work, not a hidden fee. Always show the permit and inspection as their own line — burying it looks like padding, and listing it signals you are doing the job properly. Note the panel size, breaker type and wire gauge in the descriptions. Put the things you cannot see behind drywall into exclusions: aluminium wiring, undersized service, knob-and-tube, or a panel brand that no longer passes inspection. Give each a per-unit price so discovering one on day two produces a change order instead of a dispute.',
    },
    {
      heading: 'How electricians price residential work',
      body: 'Most residential electricians work from a flat-rate book for common devices and fall back to time and materials for anything unpredictable. Across the US, an outlet or switch installed in existing drywall typically runs $150 to $250, recessed lights $180 to $300 each depending on access, and a 200 amp panel upgrade $2,000 to $4,000 including permit. Licensed hourly rates generally land between $85 and $130. New construction and open-wall remodels are cheaper per device because there is no fishing; a finished, insulated, two-storey wall can double the time on the same outlet. That is why the template splits rough-in wiring out by the linear foot — it lets you price the fishing honestly instead of hiding it in the device rate.',
    },
    {
      heading: 'Licence, permit and liability on the estimate',
      body: 'Your licence number belongs on every electrical estimate, and the template puts it in the header. Homeowners increasingly check it, insurers ask for it, and unpermitted electrical work shows up at resale as a problem the seller has to fix. State clearly who pulls the permit and who schedules the inspection — if that is you, it is a service worth naming rather than a cost worth hiding. Note your insurance carrier. Where the job touches the utility service, say who coordinates the disconnect and reconnect, because that scheduling is usually the longest pole in the tent. Finally, put safety-related findings in writing. A line reading "existing panel is a recalled brand, replacement quoted separately" protects you and often sells the larger job.',
    },
  ],
  faq: [
    {
      q: 'Is this electrical estimate template free?',
      a: 'Yes. No signup, no email required, no trial, and no watermark on the finished PDF. Fill in the line items, download the file and send it to your customer. It runs in your browser and the estimate is yours to use commercially.',
    },
    {
      q: 'How much should I charge to install an outlet?',
      a: 'Across most of the US, installing a new 15A outlet in existing finished wall runs $150 to $250 including the device, with the higher end reflecting long cable runs or difficult access. Adding an outlet to an open wall during a remodel is considerably less. Set your own per-device rate in the template rather than using a national average.',
    },
    {
      q: 'Should the permit fee be on the estimate?',
      a: 'Yes, as its own line. Showing it separately signals that the work will be permitted and inspected, which is a genuine selling point against an unlicensed competitor. It also keeps your pricing clean when a municipality raises its fees, because you change one number rather than rebuilding the quote.',
    },
    {
      q: 'What should an electrical estimate exclude?',
      a: 'Anything hidden until the walls are open: aluminium branch wiring, knob-and-tube, undersized service, failed junction boxes and drywall repair after fishing cable. List these in the notes with a per-unit price. That way, finding one mid-job is a quantity change your customer already agreed to in principle.',
    },
  ],
};

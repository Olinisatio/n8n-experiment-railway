import type { Dimension } from '@/data/types';

/**
 * Setting Boundaries — the first of the six Quiet Parts dimensions.
 *
 * Tone rule, absolute: nothing here pathologises. No "disorder",
 * "dysfunction", "unhealthy", "toxic", "damaged". Every pattern is described
 * as an intelligent adaptation that outlived the situation it was built for.
 * If you add copy to this file, that rule applies to it too.
 */
export const boundaries: Dimension = {
  slug: 'setting-boundaries',

  h1: 'Setting Boundaries',
  subline: 'Find where you go quiet — and what to say instead.',
  intro: [
    'Pick one person. Answer eight statements about how you are with them specifically, not in general.',
    'You get the pattern you fall into with them, and the actual sentences you could say — as a worksheet you can print.',
  ],

  metaTitle: 'Setting Boundaries — Find Where You Go Quiet | Quiet Parts',
  metaDescription:
    'A free eight-question reflection tool about one specific person in your life. Find the pattern you fall into with them, get the exact sentences you could say instead, and print the worksheet. Nothing is stored.',

  statements: (name) => [
    `I agree with ${name} when I don’t actually agree.`,
    `I work out what ${name} wants to hear before I answer.`,
    `When ${name} does something that bothers me, I decide it isn’t worth mentioning.`,
    `I say yes to ${name} when I want to say no, and deal with the cost afterwards.`,
    `I can tell when ${name}’s mood is turning, and I move to head it off.`,
    `I explain and justify far more than I need to when I ask ${name} for something.`,
    `Afterwards, I rehearse what I should have said to ${name}.`,
    `If I said what I actually thought to ${name}, I’d expect it to cost me something.`,
  ],

  bands: [
    {
      id: 'steady',
      min: 8,
      max: 18,
      tone: 'steady',
      heading: (name) => `With ${name}, you mostly stay yourself.`,
      body: () => [
        'Worth knowing that this is usually person-specific rather than a trait. Plenty of people are direct at work and disappear with a parent. If that might be you, run it again for someone harder — that comparison is where the useful information usually is.',
      ],
    },
    {
      id: 'partial',
      min: 19,
      max: 29,
      tone: 'partial',
      heading: (name) => `With ${name}, you go quiet more than you’d like.`,
      body: (name) => [
        `Not all of the time, though — and that part matters. There are conversations with ${name} where you say the thing plainly and it goes fine. Whatever this is, it isn’t a missing ability. It’s selective.`,
        `What tends to be happening is that certain subjects, or certain moods of theirs, flip a switch. Somewhere along the line you learned which topics were expensive with ${name}, and you started routing around those. That was an accurate read at the time, and mostly it still runs below the level of a decision — you don’t feel yourself choosing, you just notice afterwards that you agreed.`,
        `The advantage of being here rather than further along is that you already have the evidence. You know what it is to say a difficult thing to ${name} and have the relationship survive it. So this isn’t about learning something new. It’s about widening the set of moments where you use what you can already do.`,
      ],
    },
    {
      id: 'deep',
      min: 30,
      max: 40,
      tone: 'deep',
      heading: (name) => `With ${name}, you’ve mostly stopped showing up.`,
      body: (name) => [
        `Not in the sense of being absent. You’re probably highly attentive around ${name} — that’s the point. The part that’s missing is you: what you think, what you’d prefer, what you’re not fine with.`,
        `This usually starts somewhere reasonable. If disagreement with ${name} has historically been expensive — a mood that lasted days, warmth quietly withdrawn, a fight you couldn’t win — then working out what they wanted to hear was intelligent. It kept things steady. You got good at it because it worked.`,
        `The difficulty is that it doesn’t switch itself off. A strategy built for a situation where speaking up was genuinely costly keeps running in situations where it isn’t. And the cost moves: instead of a fight with ${name}, you get the rehearsal in the car, and a slow accumulation of things never said.`,
      ],
    },
  ],

  // Array order is the tie-break order. Do not sort this.
  subPatterns: [
    {
      id: 'pre-emption',
      name: 'Pre-emption',
      tagline: 'You manage them before anything happens',
      items: [2, 5],
      paragraph: (name) =>
        `You read the room early and adjust before there’s anything to adjust to. It’s a real skill and people often value you for it. It also means you’re solving problems that haven’t happened yet, using energy nobody sees, and ${name} has no idea any of it is going on.`,
      scripts: [
        { line: 'I’m not sure what I think yet — give me a minute.' },
        { line: 'What would you like to do?', note: 'asked genuinely, instead of guessing' },
      ],
      expect: () =>
        'discomfort in the gap. That gap is where your own opinion usually goes.',
    },
    {
      id: 'suppression',
      name: 'Suppression',
      tagline: 'You have the thought and swallow it',
      items: [1, 3],
      paragraph: () =>
        'You know what you think. You just don’t say it. This is the most reversible of the four, because the hard part — knowing your own position — is already done.',
      scripts: [
        { line: 'I’ve been sitting on something and I’d rather just say it.' },
        { line: 'I don’t see it that way, actually.' },
        { line: 'Can I push back on that?' },
      ],
      expect: (name) =>
        `a pause. You’ve changed the pattern and ${name} will notice. A pause is not a problem.`,
    },
    {
      id: 'over-accommodation',
      name: 'Over-accommodation',
      tagline: 'You over-give and over-explain',
      items: [4, 6],
      paragraph: () =>
        'You say yes first and count the cost later, and when you do ask for something you build a case for it. The justifying is the tell: it treats your own request as something that has to be earned.',
      scripts: [
        { line: 'I can’t do that one.', note: 'a full sentence, no reason attached' },
        { line: 'Let me get back to you.' },
        { line: 'I’d like to, but I’d be stretched. So no this time.' },
      ],
      expect: () =>
        'the urge to add a reason. The reason is what turns it into a negotiation.',
    },
    {
      id: 'aftermath',
      name: 'Aftermath',
      tagline: 'You pay for it afterwards',
      items: [7, 8],
      paragraph: () =>
        'In the moment it looks like nothing happened. The cost arrives later, as the conversation you replay. This one is easy to miss, because from the outside it reads as being easy-going.',
      scripts: [
        { line: 'I said I was fine about it earlier. I’ve thought about it and I’m not, really.' },
      ],
      expect: () => 'it’s allowed to be late. Most things can be reopened.',
    },
  ],

  faq: [
    {
      question: 'Why do I have trouble setting boundaries?',
      answer:
        'Usually because at some point not having them was the intelligent option. If disagreeing with someone reliably cost you — a mood that lasted days, warmth withdrawn, an argument you could not win — then reading what they wanted and giving them that was a working strategy. The problem is that it does not switch itself off when the situation changes. Most people who struggle here are not missing a skill; they are running an old one in a place it is no longer needed. It also tends to be person-specific rather than a trait: plenty of people are direct at work and go quiet with a parent.',
    },
    {
      question: 'What are the 7 types of boundaries?',
      answer:
        'The list usually given is physical, emotional, time, energy, intellectual, sexual and material. Physical covers touch and personal space. Emotional is how much of someone else’s feeling you take on. Time is what you agree to spend. Energy is what you have left afterwards. Intellectual is the right to a different opinion. Sexual is consent and comfort. Material is money and possessions. The first four are where most day-to-day difficulty sits, and they tend to fail in the same way: not by being crossed dramatically, but by never being stated.',
    },
    {
      question: 'How to set boundaries without hurting feelings?',
      answer:
        'Say the shortest true thing, early, and do not build a case for it. "I can’t do that one" is a complete sentence. The instinct to add a reason feels kinder, but it turns a decision into a negotiation and invites the other person to argue with the reason. Expect a pause the first few times — you have changed a pattern the other person is used to, and a pause is not the same as damage. You can also be late to it: "I said I was fine about it earlier. I’ve thought about it and I’m not, really" reopens almost anything.',
    },
  ],
};

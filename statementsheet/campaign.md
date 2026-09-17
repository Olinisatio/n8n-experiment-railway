# RedactReady — Google Ads campaign plan

Landing page: `pdf-redact.netlify.app`
Conversion event: `signup_success` (carries `plan` and `role`)

---

## The one rule that governs all the copy

**The ads must not imply the product works today.** The page says early access;
if the ad says "Redact your PDF now," you pay for clicks from people who bounce
the second they land, and you risk disapproval under Google's misrepresentation
policy.

This costs you click-through rate. That is the correct trade. A lower CTR on
honest ads beats a high CTR that buys you bounces and teaches you nothing.

Every ad group below has at least one early-access headline **pinned to
position 2**, so it always shows. Google will tell you this lowers your Ad
Strength score. Ignore that — Ad Strength is a guideline, not a ranking factor.

---

## Campaign settings

| Setting | Value | Why |
|---|---|---|
| Campaign type | **Search only** | |
| Search partners | **OFF** | Default is on; lower quality, harder to read |
| Display network | **OFF** | Default is on; will eat your budget fast |
| Locations | Australia | Set to *Presence: people in your locations*, not "interest" |
| Language | English | |
| Bidding | **Maximise clicks** with a max CPC cap | See note below |
| Budget | $40–50/day | See note below |
| Ad rotation | Optimise | |
| Ad schedule | All times initially | Business hours only if budget is tight |

### Why not "Maximise conversions"

It needs roughly 15–30 conversions to learn anything. You have zero. Pointed at
a cold account it will spend your budget exploring. Start on **Maximise clicks**
with a max CPC cap (try $3–4), and switch to conversion bidding once you have
15+ real signups.

### Budget reality check

At ~$3 a click, $45/day for 14 days is roughly 200 clicks. That is enough to
estimate your overall signup rate, and **not** enough to reliably tell you which
plan converts best. If 8 people sign up, a 5/2/1 split across Solo/Practice/Firm
is statistically meaningless. Treat plan-level data as a hint, not a finding.

Get real numbers from Keyword Planner before committing — I have not verified
current CPCs for these terms in the AU market, and they may be higher than $3.

---

## Ad group 1 — PDF Redaction Tool

*Intent: looking for a product.* Strongest message match — the H1 is this phrase
verbatim.

**Keywords**
```
[pdf redaction tool]
[pdf online redactor]
"redaction tool"
"online redaction"
```

⚠️ `"redaction tool"` and `"online redaction"` are the loosest terms here — they
catch non-PDF and non-software searches. Watch their search terms report for the
first three days and pause them if they are pulling junk.

**Headlines** (30 char max)
```
1.  PDF Redaction Tool                  ← pin to position 1
2.  Early Access — Not Live Yet         ← pin to position 2
3.  Text Removed, Not Covered
4.  Redaction That Actually Works
5.  Remove Text And Metadata
6.  Not Just A Black Rectangle
7.  Built For Australian Firms
8.  For Legal, HR And Finance
9.  Founding Price Held 12 Months
10. From $29/Month AUD
11. No Card Required
12. Reserve Your Spot
13. Stop Recoverable Redactions
14. Redact PDFs Properly
15. Join The Early Access List
```

**Descriptions** (90 char max)
```
1. Most redaction leaves the text under the black box. Anyone can select and copy it.
2. We remove the underlying text and document metadata — not just draw a rectangle.
3. In development for Australian legal, finance and HR teams. Early access opens soon.
4. Pick a plan and reserve your spot. No payment today, founding price held 12 months.
```

---

## Ad group 2 — Redact PDF Online

*Intent: wants to do it now.* Highest bounce risk, because they want it today and
cannot have it. Keep the early-access headline pinned.

**Keywords**
```
[redact pdf online]
[pdf online redact]
"redact info on pdf"
"best way to redact a pdf"
```

**Headlines**
```
1.  Redact PDF Online                   ← pin to position 1
2.  Early Access — Not Live Yet         ← pin to position 2
3.  The Right Way To Redact A PDF
4.  Text Gone, Not Just Hidden
5.  Black Boxes Are Not Redaction
6.  Remove Text And Metadata
7.  Redaction That Actually Works
8.  For Legal, HR And Finance
9.  Built For Australian Firms
10. From $29/Month AUD
11. No Card Required
12. Founding Price Held 12 Months
13. Reserve Your Spot
14. Properly Redacted, Every Time
15. Join The Early Access List
```

**Descriptions**
```
1. Drawing a black box leaves the text in the file. Select it, copy it, it is still there.
2. We remove the underlying text and document metadata — not just draw a rectangle.
3. In development for Australian legal, finance and HR teams. Early access opens soon.
4. Pick a plan and reserve your spot. No payment today, founding price held 12 months.
```

---

## Ad group 3 — Black Out PDF

*Intent: describing the visual action, or a specific document.* Best thematic
match to the page's hero graphic.

**Keywords**
```
[black out pdf online]
"redact bank statement pdf"
```

**Headlines**
```
1.  Black Out PDF Online                ← pin to position 1
2.  Early Access — Not Live Yet         ← pin to position 2
3.  Blacking Out Is Not Redacting
4.  Text Survives The Black Box
5.  Text Removed, Not Covered
6.  Remove Text And Metadata
7.  Redact Statements Properly
8.  For Legal, HR And Finance
9.  Built For Australian Firms
10. From $29/Month AUD
11. No Card Required
12. Founding Price Held 12 Months
13. Reserve Your Spot
14. Redaction That Actually Works
15. Join The Early Access List
```

**Descriptions**
```
1. A black rectangle hides text on screen. It does not remove it from the file.
2. We remove the underlying text and document metadata — not just draw a rectangle.
3. In development for Australian legal, finance and HR teams. Early access opens soon.
4. Pick a plan and reserve your spot. No payment today, founding price held 12 months.
```

---

## Negative keywords — add before you launch

Add these at **campaign level**. Most of your wasted spend will come from these.

```
free            freeware        open source     opensource
github          python          script          api
crack           cracked         torrent         download free
how to          tutorial        youtube         video
acrobat         adobe           foxit           nitro
word            excel           image           photo
jobs            job             salary          career
meaning         definition      what is         examples
military        classified      course          training
```

**Why these matter most:**

- **free / freeware** — huge volume on these terms, zero intent to pay
- **acrobat / adobe** — they want help using Acrobat, not a new tool. Note this
  sits oddly next to your first objection, which is *about* Acrobat. The
  objection answers people who arrive already frustrated; the negative blocks
  people searching for Acrobat instructions. Different groups.
- **how to / tutorial / youtube** — research intent, not purchase intent
- **jobs / salary / meaning** — "redaction" has non-software senses

---

## Before you switch it on

- [ ] Netlify project set to **Public**
- [ ] GTM container **Submitted** (check Versions tab shows a published version)
- [ ] Test submissions deleted from Formspree
- [ ] Search partners and Display network **off**
- [ ] Negative keyword list added at campaign level
- [ ] Final URL on every ad: your live page, with `https://`
- [ ] One real end-to-end conversion recorded in Google Ads

---

## What to check, and when

**Day 1–3 — is it working at all?**
Search terms report daily. You are hunting for junk to add as negatives, not
judging performance. Expect to add 10–20 more negatives in the first week.

**Day 3–7 — is the click worth it?**
CTR by ad group. Under 2% means the ad is not matching the search. Cost per
click vs. what you expected.

**Day 7–14 — does anyone want it?**
Signup rate = conversions ÷ clicks.

| Rate | Read |
|---|---|
| Above 5% | Strong. People want this enough to wait for it. |
| 2–5% | Promising. Worth a second test with a real domain. |
| 1–2% | Weak, but remember they cannot buy today. Not fatal. |
| Below 1% | Either the offer is wrong or the traffic is wrong. |

**Interpret the number honestly.** Everyone who lands is told they cannot have
it yet. That suppresses conversion regardless of how much they want the product.
Read your rate as a **floor**, not a verdict — the same page with a working
product behind it would convert considerably better.

The signal that matters more than the rate: **which keyword produced the
signups.** Ten clicks from `redact bank statement pdf` converting at 10% tells
you more about who to build for than 200 clicks from `redaction tool` at 1%.

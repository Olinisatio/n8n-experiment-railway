# StatementSheet — Google Ads validation landing page

A single self-contained `index.html`. No build step, no dependencies, no
framework. Open it directly in a browser and it works.

Its only job is to measure whether Australian bookkeepers will pay for a tool
that converts PDF bank statements into Xero/MYOB-ready CSV. The product does
not exist. The page never claims otherwise, takes no payment, and has no file
upload field — do not add one.

---

## Deploy checklist

### 1. Swap the four placeholders

All four are listed in the comment block at the very top of `index.html`, with
the line each one appears on.

| # | Placeholder | Where | Replace with |
|---|---|---|---|
| 1 | `GTM-PLACEHOLDER` | `<head>` snippet + `<body>` noscript iframe (2 places) | Your GTM container ID, e.g. `GTM-ABC1234` |
| 2 | `PLACEHOLDER_ID` | `FORMSPREE_ENDPOINT` in the `<script>` block (1 place) | Your Formspree form ID, e.g. `xayzabcd` |
| 3 | `StatementSheet` | `<title>`, meta description, hero subhead, how-it-works heading, footer | Final product name |
| 4 | `statementsheet.com.au` | Footer copy and the Privacy link target | Final domain |

Also publish a real privacy policy at `/privacy` (or repoint the footer link).
Google Ads requires a reachable privacy policy on any page collecting emails —
a dead link here can get the ad account flagged.

### 2. Create the Formspree form

1. Create a form at [formspree.io](https://formspree.io).
2. Copy the form ID out of the endpoint URL it gives you.
3. Paste it over `PLACEHOLDER_ID`.
4. Add your deployed domain to the form's allowed-domains list, or submissions
   from the live page will be rejected.
5. Submit a test email from the live page and confirm it arrives. Each
   submission posts JSON: `{ email, plan }`, plus a second optional post with
   `monthly_statement_volume` if the visitor answers the follow-up question.

### 3. Deploy

**Cloudflare Pages**
1. Connect the repo, or drag the folder into *Workers & Pages → Create → Pages
   → Upload assets*.
2. Build command: none. Build output directory: the folder containing
   `index.html`.
3. Add the custom domain under *Custom domains*.

**Netlify**
1. Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop),
   or connect the repo with build command empty and publish directory set to
   this folder.
2. Add the custom domain under *Domain management*.

Either host gives you HTTPS automatically. Confirm the live URL loads over
`https://` before pointing ads at it — Quality Score and user trust both
depend on it.

### 4. Create the GTM container

1. In [Google Tag Manager](https://tagmanager.google.com), create a Web
   container for your domain.
2. Copy the container ID (`GTM-XXXXXXX`) over both instances of
   `GTM-PLACEHOLDER`.
3. Redeploy, then use GTM **Preview** mode to confirm the container loads.

### 5. Create the conversion trigger

In GTM:

1. **Variables → User-Defined Variables → New → Data Layer Variable**
   - Name: `DLV - plan`
   - Data Layer Variable Name: `plan`
   - Repeat for `DLV - volume` with variable name `volume`.
2. **Triggers → New → Custom Event**
   - Name: `signup_success`
   - Event name: `signup_success` *(exact match, no regex)*
   - Fires on: All Custom Events
3. Optionally add a second Custom Event trigger for `volume_answered` if you
   want the survey answer in GA4 as well.

Verify in Preview mode: click a plan, submit an email, and confirm
`signup_success` appears in the event stream with `plan` populated
(`Solo`, `Practice` or `Firm`).

### 6. Link it to the Google Ads conversion action

1. In **Google Ads → Goals → Conversions → New conversion action → Website**,
   choose *Set up manually using code* and create the action (category: Submit
   lead form). Note the **Conversion ID** and **Conversion Label**.
2. Back in GTM: **Tags → New → Google Ads Conversion Tracking**
   - Conversion ID and Conversion Label from step 1.
   - Trigger: the `signup_success` trigger created above.
3. Add a **Google Tag** (`AW-XXXXXXXXX`) firing on *Initialization – All Pages*
   if the container doesn't already have one.
4. **Submit** the container to publish it.
5. Fire one real test conversion on the live page and confirm it appears in
   Google Ads within a few hours (status moves from *No recent conversions* to
   *Recording conversions*).

Segment reporting by the `plan` parameter — which price point converts is the
whole point of the test.

---

## What the page deliberately does not have

Each of these was left out on purpose. Adding one back changes what the test
measures:

- No navigation, header links, or footer links other than Privacy. The form is
  the only exit.
- No testimonials, logos, ratings, or signup counters. There are no customers
  yet, and invented social proof on a page collecting real emails is not
  acceptable.
- No file upload. Bank statements are sensitive client documents and there is
  no backend to receive them.
- No language implying the product is live. Everything is early-access framing.
- No external CSS, JS, fonts, or icon packs. Page weight feeds load speed,
  which feeds Quality Score, which feeds CPC.

## Testing before you spend money on clicks

- Submit with an invalid email — inline error, typed value preserved.
- Kill your network and submit — visible error, no false confirmation, no
  `signup_success` event.
- Submit successfully — the form is replaced in place; the page must not
  navigate, or the GTM event won't fire.
- Tab through the modal with the keyboard — focus stays inside, Escape closes.
- Load it on a phone — the Practice tier appears first.

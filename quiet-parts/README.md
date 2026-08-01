# Quiet Parts

Free self-reflection tools about the ways people adapt in relationships — the
patterns that made sense once and kept running.

One page is built: **Setting Boundaries**, containing the interactive tool
**The Boundary Map**. Five more dimensions are planned and will reuse the same
engine.

---

## What you need to do in a browser

Everything in the code is finished. These are the steps only you can do,
because they need an account or a card. Do them in this order.

### 1. Put the site on Vercel

1. Go to **vercel.com** and sign in with GitHub.
2. Click **Add New… → Project**.
3. Find `n8n-experiment-railway` in the list and click **Import**.
4. On the configure screen, find **Root Directory** and click **Edit**.
5. Choose the **`quiet-parts`** folder. This matters — the repository holds
   more than one project, and without this Vercel will try to build the wrong
   one.
6. Leave everything else alone and click **Deploy**.
7. Wait for it to finish, then click the screenshot it shows you. That is your
   live URL. It will look like `quiet-parts-something.vercel.app`.

At this point the site works completely, including the worksheet. Analytics
and the email signup are inert until you do steps 3 and 4, and that is fine.

### 2. Point your domain at it

**You have not given me the domain yet** — the slot in the brief was still
blank. The code reads it from one setting, so nothing needs rewriting when you
have it; you just paste it in here.

1. In Vercel, open the project → **Settings** → **Domains**.
2. Type your domain **without www** (e.g. `quietparts.co`) and click **Add**.
3. Add it a second time **with www** (e.g. `www.quietparts.co`).
4. Vercel will show a **Redirect to** option on the www one. Set it to
   redirect to the non-www version. The non-www one is the primary.
5. Follow Vercel's DNS instructions at your domain registrar. It tells you the
   exact records.
6. Now go to **Settings → Environment Variables** and add:
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** your domain in the non-www form with `https://` and no
     trailing slash — e.g. `https://quietparts.co`
7. Go to **Deployments**, click the **…** on the most recent one, and choose
   **Redeploy**. Environment variables only take effect on a new build.

**Why this matters more than it looks:** the canonical tags, the sitemap,
robots.txt and the share card are all generated from that one value. If it
disagrees with the domain Google actually crawls, Google reads the sitemap as
pointing at a different site and ignores the whole thing. The code strips
`www.` and any trailing slash defensively, so a small typo is survivable, but
get the domain itself right.

### 3. Analytics (PostHog)

1. Go to **posthog.com**, sign up, create a project.
2. **Settings → Project → Project API Key**. Copy it. It starts with `phc_`.
3. In Vercel → Settings → Environment Variables, add:
   - `NEXT_PUBLIC_POSTHOG_KEY` — the key you copied
   - `NEXT_PUBLIC_POSTHOG_HOST` — `https://us.i.posthog.com`, or
     `https://eu.i.posthog.com` if you chose EU during signup
4. Redeploy.

Leave the key unset and analytics never loads at all — no script, no cookie.

### 4. Email (Resend)

1. Go to **resend.com** and sign up.
2. **Domains → Add Domain**, enter your domain, and add the DNS records it
   gives you at your registrar. Wait for it to go green.
3. **API Keys → Create API Key**. Copy it — it is only shown once.
4. Optionally **Audiences → Create Audience**, then copy the id out of the
   browser address bar. This is where addresses are stored; without it the
   confirmation still sends but nothing is kept.
5. In Vercel → Settings → Environment Variables, add:
   - `RESEND_API_KEY` — the key
   - `RESEND_FROM` — e.g. `Quiet Parts <hello@quietparts.co>` (the domain must
     be the one you verified)
   - `RESEND_AUDIENCE_ID` — the audience id, if you made one
6. Redeploy.

Until these are set, the signup form still works and still says thank you; it
just logs instead of sending.

### 5. Tell Google it exists

Once the domain is live: **search.google.com/search-console**, add the
property, and submit `https://yourdomain.co/sitemap.xml`.

---

## The privacy rule

The page tells the user their answers never leave the browser. That is
enforced in the code, not just promised:

- Answers live in React state only. No localStorage, no sessionStorage, no
  cookies, no database. A refresh genuinely loses everything.
- Exactly six analytics events are ever sent, and **none of them carry any
  properties**: `page_view`, `inventory_started`, `inventory_completed`,
  `worksheet_downloaded`, `second_person_started`, `email_submitted`. The
  helper in `src/lib/analytics.ts` has no properties argument at all, so
  attaching a score or a name is a TypeScript error rather than a decision
  someone has to remember to get right.
- PostHog autocapture and session recording are both off. Autocapture would
  otherwise record the text of whatever was clicked, which here includes the
  statements and the answers.
- `/api/subscribe` reads `email` from the request body and nothing else.

If you change any of this, change the promise on the page too.

---

## Running it locally

```bash
cd quiet-parts
npm install
npm run dev
```

Then open http://localhost:3000. No environment variables are needed — every
integration degrades to a no-op without its key.

```bash
npm run build   # production build, catches type errors
npm start       # serve the production build
```

## How it is put together

```
src/
  app/
    page.tsx              the page: h1, intro, schema, and the essay below
    layout.tsx            fonts and site-wide metadata
    globals.css           the whole design system, including the print sheet
    api/subscribe/        Resend
    opengraph-image.tsx   the share card, generated at build time
  components/
    BoundaryMap.tsx       state machine: name → eight statements → results
    Results.tsx           band, pattern, scripts, comparison
    PrintSheet.tsx        the worksheet (print-only DOM)
    Texture.tsx           paper grain, hand-drawn rules and underlines
  data/
    types.ts              the engine: scoring, banding, sub-patterns
    dimensions/
      boundaries.ts       all Setting Boundaries copy lives here
```

**Adding one of the five remaining dimensions** means writing a new file in
`src/data/dimensions/` shaped like `boundaries.ts`, registering it in
`dimensions/index.ts`, and adding its URL to `sitemap.ts`. Nothing in the
engine, the components or the stylesheet knows anything about boundaries
specifically.

**The tone rule is not optional.** Nothing pathologises — no "disorder",
"dysfunction", "unhealthy", "toxic", "damaged". Every pattern is described as
an intelligent adaptation that outlived the situation it was built for. That
applies to any copy added later.

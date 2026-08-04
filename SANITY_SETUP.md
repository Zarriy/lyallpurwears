# Sanity Studio setup

This app ships with a Sanity Studio (v4) config at the project root
(`sanity.config.js`, `basePath: '/studio'`) and a data layer under
`src/sanity/`. The storefront is fully wired to it: pages read from
`src/sanity/useStore.js`, which falls back to the static catalogue in
`src/data/products.js` whenever Sanity is unconfigured or unreachable — so
the site builds and runs even before you complete the steps below.

The Studio is mounted in the app's router at **`/studio`**, code-split so
the admin bundle never loads for shoppers.

Nothing below has been run for you. `sanity login` / `sanity init` are
interactive and need your browser, so you'll need to run these yourself.

## 1. Log in

```bash
npx sanity login
```

## 2. Create (or reuse) a Sanity project

If you don't have a project yet:

```bash
npx sanity init --project-plan free
```

- When asked whether to use the existing schema in this folder, say **yes**
  (schemas already live in `sanity/schemas/`).
- When asked for a dataset name, use `production` (or update
  `VITE_SANITY_DATASET` below to match whatever you choose).

If you already have a project, skip `init` and just grab its **Project ID**
from https://www.sanity.io/manage.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Paste your project ID into `.env`:

```
VITE_SANITY_PROJECT_ID=xxxxxxxx
VITE_SANITY_DATASET=production
```

## 4. Mint a write token (for seeding + the review submission API)

1. Go to https://www.sanity.io/manage → your project → **API** → **Tokens**.
2. Click **Add API token**.
3. Name it (e.g. "storefront-write"), set permissions to **Editor**.
4. Copy the token — Sanity only shows it once — and paste it into `.env`:

```
SANITY_WRITE_TOKEN=sk...
```

This token is server-side only (`SANITY_WRITE_TOKEN`, no `VITE_` prefix) and
is never bundled into browser JS. It's used by `scripts/seed.mjs` and by
`api/submit-review.js` (also usable under `npm run dev` via the middleware
plugin in `vite.config.js`).

## 5. Seed sample content

```bash
npm run seed
```

This imports the 12 products / 4 collections / 4 colours from
`src/data/products.js`, a handful of approved sample reviews, and the
`siteSettings` singleton, using deterministic document IDs — safe to re-run.

The script refuses to run (and tells you exactly what's missing) if
`VITE_SANITY_PROJECT_ID` or `SANITY_WRITE_TOKEN` aren't set.

## 6. Add CORS origins

Sanity's API blocks browser requests from origins it doesn't know about.
Go to manage.sanity.io → your project → **API** → **CORS origins** → **Add
CORS origin**, and add:

- `http://localhost:5173` (dev — do NOT allow credentials, this app uses no
  cookies/session auth against Sanity)
- your production domain, once you have one (e.g. `https://lyallpurwear.pk`)

## 7. Open the Studio

```bash
npm run dev
```

Then visit `http://localhost:5173/studio` — same dev server as the
storefront, no second process. You'll see Products, Collections, Colours,
Reviews (split into **Pending approval** / **Approved** for moderation), and
the Site Settings singleton.

`POST /api/submit-review` also works under `npm run dev` via the middleware
plugin in `vite.config.js`, so the PDP review form is testable locally.

A standalone `npx sanity dev` on port 3333 still works if you prefer it, and
`npx sanity build && npx sanity deploy` will publish a hosted Studio at
`<project>.sanity.studio`. Neither is required.

## Moderating reviews

Reviews submitted from the product page are always created with
`approved: false` — the API hardcodes it server-side, so a crafted request
cannot self-approve. They appear under **Reviews → Pending approval**. Tick
`approved` to publish one; it then counts toward the product's star rating,
review count, and the 5/4/3/2/1 distribution bars, all of which are computed
from approved reviews rather than stored.

## Remaining manual steps

- **No product images are seeded** — the static catalogue has none checked
  in, so all 12 products import with empty image arrays and keep rendering
  the generative placeholder art. Add real photos per product under
  Studio → Products → *item* → Images. Each image takes a `view` label
  (FRONT / BACK / DETAIL / TEXTILE / STYLED) that drives the PDP thumb strip.
- **Social links in Site Settings are placeholders** (`instagram.com/lyallpurwear`
  etc.) — the footer icons previously linked to `#`, so these were guessed.
- **The PDP delivery-estimate strip** ("Order in 4hrs 22min · Delivery by…")
  has no CMS field behind it; it's computed client-side from a 6pm cutoff
  plus a 3-day estimate. Add a `siteSettings` field if you want it editable.

# Al Safwa Trading — Production Website

Professional B2B catalogue and lead-generation website for **Al Safwa Trading**, an
Oman-based industrial trading company supplying power tools, safety equipment,
motors & pumps and machinery — with rental, repair and maintenance support.

## Stack

- **Vite + React 18 + TypeScript** (static build — GitHub Pages friendly)
- **Tailwind CSS v4**
- **react-router-dom** with `BrowserRouter` and pre-generated route documents for GitHub Pages
- **Supabase** for the live catalogue, media library, admin authentication and enquiry processing

## Getting started

```bash
npm install
npm run dev      # local development
npm run build    # production build → dist/
npm run typecheck
```

## Project structure

```
src/
  lib/
    business.ts          ← single business config (name, phone, WhatsApp, email…)
    whatsapp.ts          ← WhatsApp link + message builders
    submissions.ts       ← Supabase-ready submission adapter (localStorage for MVP)
    seo.ts               ← per-page title / meta / canonical
    data/
      types.ts           ← Product / Brand / Category / RentalItem / Service models
      products/          ← one file per division (power-tools, safety, motors…)
        index.ts         ← aggregates records + fetch adapters (swap for Supabase later)
      brands.ts
      categories.ts
      rental.ts
      services.ts
      images.ts
  components/            ← Layout, ProductCard, UI kit, custom SVG icon set
  pages/                 ← Home, Products, Brands, Rental, Services, Forms, Contact
```

## Data layer → Supabase

Catalogue data is consumed through async adapters in `src/lib/data/` and reads active records from Supabase. The public enquiry forms submit through the `public-enquiry` Edge Function; private customer and enquiry records are not exposed as public catalogue data.

Every product record keeps the research fields: `source_url`, `source_company`,
`verified`, `last_verified`, `price_type`, `availability`.

## Business identity and production settings

`src/lib/business.ts` is the source for the public contact details, map links, address and opening-hours display. Do not change the business phone, WhatsApp number, address, Google Maps place ID or map URL without explicit approval from the business owner.

Use only verified operating hours. The current website hours are based on the published Google Business Profile schedule; recheck the business profile before changing them.

## SEO, deployment and release checks

GitHub Actions deploys the site to GitHub Pages on pushes to `main`. The production workflow generates English and Arabic route documents, canonicals, page metadata, hreflang links and the sitemap from active catalogue records. It fails when an active product is missing a short or full description, then audits generated routes and checks live public URLs after deployment.

GA4 event tracking is implemented in `src/lib/analytics.ts`. To enable production analytics, add the actual GA4 measurement ID as the GitHub Actions repository secret `VITE_GA_MEASUREMENT_ID` (`G-XXXXXXXXXX`). The workflow deliberately leaves analytics inactive when no real ID is supplied.

## Product and content integrity

- Unknown prices remain quote-only; do not publish guessed prices.
- Unknown stock remains unconfirmed; product pages must not promise current inventory.
- Do not claim authorized-dealer status, certifications, warranties, reviews or company history unless verified.
- Product specifications must be checked against the exact model and manufacturer source.

## Conversion points

WhatsApp · Phone call · Request a Quote · Request Rental Quote · Request Repair ·
Request Maintenance — every product, rental item and service page wires into these.

## Deployment (GitHub Pages)

Push changes to `main`; `.github/workflows/deploy.yml` installs dependencies, builds the application, generates static English and Arabic routes, validates the sitemap/canonicals/hreflang, and deploys to `https://alsafwaoman.com/`. The workflow then checks the main live routes, sitemap, robots file and key product URLs.

**Adding inventory:** see [`INVENTORY_GUIDE.md`](./INVENTORY_GUIDE.md) — paste a
record into the matching division file and push; the site updates automatically.

## Security

Never commit API keys, Supabase service-role keys, database passwords, private
credentials or customer information. `.env.example` documents the expected variables.

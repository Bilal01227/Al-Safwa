# Al Safwa Trading — Industrial Equipment Website (MVP)

Professional B2B catalogue and lead-generation website for **Al Safwa Trading**, an
Oman-based industrial trading company supplying power tools, safety equipment,
motors & pumps and machinery — with rental, repair and maintenance support.

## Stack

- **Vite + React 18 + TypeScript** (static build — GitHub Pages friendly)
- **Tailwind CSS v4**
- **react-router-dom** with `HashRouter` (all routes work on any static host, no server config needed)
- **No paid services** — forms store submissions locally (Supabase-ready adapter)

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

All catalogue data is consumed through **async adapter functions**
(`fetchProducts()`, `fetchProductBySlug()`, …) in `src/lib/data/products.ts`.
To migrate, replace the adapter bodies with Supabase queries — the UI does not change.

Every product record keeps the research fields: `source_url`, `source_company`,
`verified`, `last_verified`, `price_type`, `availability`.

## ⚠ Before going live — replace placeholders

All unverified details live in **`src/lib/business.ts`** (search `TODO(verify)`):

- Official Oman business **phone**
- Official **WhatsApp** number (digits only, with country code)
- Official business **email**
- Registered **address** + exact **Google Maps** URL
- Opening **hours**

**Content policy (strict):**

- No invented prices — unknown pricing uses `price_type: "request_quote"`.
- No invented stock claims — unknown availability reads "Contact for availability".
- No invented certifications, dealer status, warranties, reviews or company history.
- Product specs are compiled from public manufacturer data and flagged
  `verified: false` until checked by the business owner.
- All product brand names and trademarks belong to their respective owners;
  the site does not claim authorized-dealer status unless verified.

## Conversion points

WhatsApp · Phone call · Request a Quote · Request Rental Quote · Request Repair ·
Request Maintenance — every product, rental item and service page wires into these.

## Deployment (GitHub Pages) — push to go live

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and publishes
the site automatically on every push to `main`.

**One-time setup:**

1. Create a new (empty) repository on GitHub, e.g. `al-safwa-trading`.
2. In your project folder:

   ```bash
   git init
   git add .
   git commit -m "Al Safwa Trading website MVP"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/al-safwa-trading.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
4. After the workflow finishes, the site is live at
   `https://YOUR-USERNAME.github.io/al-safwa-trading` (hash routing means
   `#/products`, `#/rental`, etc. work with no server rewrites).
5. Later, add your own domain: **Pages → Custom domain**.

**Adding inventory:** see [`INVENTORY_GUIDE.md`](./INVENTORY_GUIDE.md) — paste a
record into the matching division file and push; the site updates automatically.

## Security

Never commit API keys, Supabase service-role keys, database passwords, private
credentials or customer information. `.env.example` documents the expected variables.

# Inventory Guide — Al Safwa Trading

How to add products, rental items and brands to the website.

## Where the data lives

```
src/lib/data/products/
  power-tools.ts        ← drills, grinders, saws, hammers…
  safety-equipment.ts   ← PPE
  motors-pumps.ts       ← Texmo motors & pumps
  hand-tools.ts         ← spanners, pliers, hammers…
  spare-parts.ts        ← consumables & replacement parts
  index.ts              ← aggregates everything (do not add records here)
src/lib/data/rental.ts  ← rental fleet
src/lib/data/brands.ts  ← brands (only brands you actually supply)
```

## Adding a product (60 seconds)

Open the matching division file and paste this template at the end of the array:

```ts
p({
  slug: "bosch-gsb-16-re-impact-drill",        // unique, lowercase, dashes only
  productName: "Bosch GSB 16 RE Impact Drill",
  brand: "Bosch",
  brandSlug: "bosch",                           // must match src/lib/data/brands.ts
  modelNumber: "GSB 16 RE",
  category: "power-tools",                      // power-tools | safety-equipment | motors-pumps | hand-tools | spare-parts
  subcategory: "Drills",                        // free text — becomes a filter automatically
  shortDescription: "One or two original sentences — never copy manufacturer marketing text.",
  specifications: {
    "Chuck capacity": "13 mm",
    Application: "Masonry, wood, metal",
  },
  imageUrl: IMG.drill,                          // IMG.drill | grinder | safety | motor | machinery | generator | welder | compressor | hands | hero
  // featured: true,                            // optional — shows in homepage featured grid
}),
```

That is all. Search, filters, brand pages, related products, SEO and WhatsApp
messages pick the item up automatically. No other file needs editing.

## The rules (strict — these are business policy)

| Field            | Rule                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `price`          | Leave `null` unless the owner confirms a real price. Never invent.    |
| `priceType`      | `"request_quote"` when unknown. `"fixed"` only with a confirmed price.|
| `availability`   | Defaults to `"Contact for availability"`. Never claim "In stock" unverified. |
| `verified`       | Stays `false` until the owner checks the record against the manufacturer. |
| `lastVerified`   | Set a date (`"2026-01-15"`) only together with `verified: true`.      |
| `sourceUrl`      | If you copied specs from another company's site, put that URL here (internal provenance, never shown as endorsement). |
| Descriptions     | Write original short sentences based on factual specs. No verbatim copied text. |

When a record is confirmed by the business owner:

```ts
verified: true,
lastVerified: "2026-02-01",
price: 24.5,            // only if a real price was confirmed
priceType: "fixed",     // or "starting_from"
availability: "In stock — Muscat counter",   // only if actually verified
```

## Adding a rental item

In `src/lib/data/rental.ts`, add to `rentalItems`:

```ts
{
  id: "rt-vibrating-plate",
  name: "Vibrating Plate Compactor",
  brand: "TBC",
  model: "TBC",
  category: "Construction Equipment",   // one of the 8 rental categories
  description: "Short original description.",
  condition: "Confirmed per unit before dispatch",
  availability: "Contact for availability",
  dailyRate: null,     // never invent rates — null shows "On quote / Request Rental Quote"
  weeklyRate: null,
  monthlyRate: null,
  imageUrl: IMG.machinery,
},
```

## Adding a brand

Only add brands you actually supply. In `src/lib/data/brands.ts` add a slug,
name, 2-letter monogram (we do not use third-party logos), divisions and one
original sentence. Products with a matching `brandSlug` appear on the brand
page automatically.

## Bulk import later (Supabase)

The site consumes products only through the adapter functions in
`src/lib/data/products/index.ts` (`fetchProducts()`, `fetchProductBySlug()`…).
When moving to Supabase, create a `products` table with the exact same columns
as the `Product` type in `src/lib/types.ts` and replace the adapter bodies —
the UI does not change at all.

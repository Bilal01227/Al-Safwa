/**
 * Product catalogue + data adapters.
 * ─────────────────────────────────────────────────────────────────
 *  RULES ENFORCED IN THIS FILE
 *  · No invented prices → price: null, priceType: "request_quote"
 *  · No invented stock  → availability: "Contact for availability"
 *  · Specs compiled from public manufacturer data → verified: false
 *    until the business owner confirms (lastVerified stays null).
 *  · Short descriptions are written originally — never copied text.
 * ─────────────────────────────────────────────────────────────────
 *  SUPABASE PHASE: replace the adapter function bodies below with
 *  supabase.from("products") queries. Signatures stay identical.
 */
import type { Product } from "../types";
import { IMG } from "./images";

const CONTACT = "Contact for availability";
const SRC = "Compiled from public manufacturer data — pending verification";

const p = (
  d: Omit<Product, "sourceUrl" | "sourceCompany" | "availability" | "price" | "currency" | "priceType" | "verified" | "lastVerified">,
): Product => ({
  ...d,
  sourceUrl: "",
  sourceCompany: SRC,
  availability: CONTACT,
  price: null,
  currency: "OMR",
  priceType: "request_quote",
  verified: false,
  lastVerified: null,
});

export const products: Product[] = [
  p({
    slug: "bosch-gsb-13-re-impact-drill",
    productName: "Bosch GSB 13 RE Impact Drill",
    brand: "Bosch",
    brandSlug: "bosch",
    modelNumber: "GSB 13 RE",
    category: "power-tools",
    subcategory: "Drills",
    shortDescription: "Compact 13 mm impact drill for masonry, wood and steel — a site staple for contractors.",
    specifications: {
      "Chuck capacity": "13 mm",
      "Drilling modes": "Rotary / impact",
      "Speed control": "Variable-speed trigger",
      "Reversing": "Yes",
      "Application": "Masonry, wood, metal",
    },
    imageUrl: IMG.drill,
    featured: true,
  }),
  p({
    slug: "bosch-gws-800-angle-grinder",
    productName: "Bosch GWS 800 Angle Grinder",
    brand: "Bosch",
    brandSlug: "bosch",
    modelNumber: "GWS 800",
    category: "power-tools",
    subcategory: "Grinders",
    shortDescription: "115 mm angle grinder balanced for grinding and cutting metal in fabrication work.",
    specifications: {
      "Disc diameter": "115 mm",
      "Spindle thread": "M14",
      "Auxiliary handle": "2-position",
      "Application": "Grinding & cutting metal",
    },
    imageUrl: IMG.grinder,
    featured: true,
  }),
  p({
    slug: "bosch-gws-carbon-brush-set",
    productName: "Carbon Brush Set — GWS Series Grinders",
    brand: "Bosch",
    brandSlug: "bosch",
    modelNumber: "GWS-SERIES-CB",
    category: "spare-parts",
    subcategory: "Grinder parts",
    shortDescription: "Replacement carbon brushes for GWS-class angle grinders — fitted in minutes.",
    specifications: {
      "Fits": "GWS-class angle grinders",
      "Type": "Carbon brush pair",
      "Supplied": "Per set",
    },
    imageUrl: IMG.grinder,
    featured: true,
  }),
  p({
    slug: "makita-hp1630-hammer-drill",
    productName: "Makita HP1630 Hammer Drill",
    brand: "Makita",
    brandSlug: "makita",
    modelNumber: "HP1630",
    category: "power-tools",
    subcategory: "Drills",
    shortDescription: "13 mm hammer drill with variable speed and reversing for general construction drilling.",
    specifications: {
      "Chuck capacity": "13 mm",
      "Modes": "Drilling / hammer drilling",
      "Speed": "Variable + reversing",
      "Application": "Masonry, wood, steel",
    },
    imageUrl: IMG.drill,
    featured: true,
  }),
  p({
    slug: "makita-ga4030-angle-grinder",
    productName: "Makita GA4030 Angle Grinder",
    brand: "Makita",
    brandSlug: "makita",
    modelNumber: "GA4030",
    category: "power-tools",
    subcategory: "Grinders",
    shortDescription: "100 mm angle grinder with a slim body for one-hand control in tight spaces.",
    specifications: {
      "Disc diameter": "100 mm",
      "Body": "Slim-grip housing",
      "Side handle": "Included",
      "Application": "Grinding & cutting",
    },
    imageUrl: IMG.grinder,
  }),
  p({
    slug: "dewalt-dwe4120-angle-grinder",
    productName: "DeWalt DWE4120 Angle Grinder",
    brand: "DeWalt",
    brandSlug: "dewalt",
    modelNumber: "DWE4120",
    category: "power-tools",
    subcategory: "Grinders",
    shortDescription: "115 mm slide-switch grinder built for sustained metal grinding in workshops.",
    specifications: {
      "Disc diameter": "115 mm",
      "Switch type": "Slide switch",
      "Application": "Metal grinding & cutting",
    },
    imageUrl: IMG.grinder,
    featured: true,
  }),
  p({
    slug: "dewalt-dwd112-drill",
    productName: "DeWalt DWD112 Pistol-Grip Drill",
    brand: "DeWalt",
    brandSlug: "dewalt",
    modelNumber: "DWD112",
    category: "power-tools",
    subcategory: "Drills",
    shortDescription: "10 mm variable-speed drill for precise fastening and light drilling tasks.",
    specifications: {
      "Chuck capacity": "10 mm",
      "Speed": "Variable speed",
      "Form": "Pistol grip",
    },
    imageUrl: IMG.drill,
  }),
  p({
    slug: "stanley-stgs6100-angle-grinder",
    productName: "Stanley STGS6100 Angle Grinder",
    brand: "Stanley",
    brandSlug: "stanley",
    modelNumber: "STGS6100",
    category: "power-tools",
    subcategory: "Grinders",
    shortDescription: "100 mm compact grinder for trade use — dependable daily grinding at a value price point.",
    specifications: {
      "Disc diameter": "100 mm",
      "Housing": "Compact",
      "Application": "Grinding & cutting",
    },
    imageUrl: IMG.grinder,
  }),
  p({
    slug: "dongcheng-dsm04-100-angle-grinder",
    productName: "Dongcheng DSM04-100 Angle Grinder",
    brand: "Dongcheng",
    brandSlug: "dongcheng",
    modelNumber: "DSM04-100",
    category: "power-tools",
    subcategory: "Grinders",
    shortDescription: "100 mm heavy-duty grinder popular on Gulf construction and steel-fixing crews.",
    specifications: {
      "Disc diameter": "100 mm",
      "Duty class": "Heavy-duty",
      "Application": "Grinding & cutting",
    },
    imageUrl: IMG.grinder,
  }),
  p({
    slug: "ongco-oc13-impact-drill",
    productName: "Ongco 13 mm Impact Drill",
    brand: "Ongco",
    brandSlug: "ongco",
    modelNumber: "OC-13",
    category: "power-tools",
    subcategory: "Drills",
    shortDescription: "Budget-friendly 13 mm impact drill for site and workshop general drilling.",
    specifications: {
      "Chuck capacity": "13 mm",
      "Type": "Impact drill",
      "Use case": "General site drilling",
    },
    imageUrl: IMG.drill,
  }),
  p({
    slug: "dalilee-dl26-rotary-hammer",
    productName: "Dalilee 26 mm Rotary Hammer",
    brand: "Dalilee",
    brandSlug: "dalilee",
    modelNumber: "DL-26",
    category: "power-tools",
    subcategory: "Rotary hammers",
    shortDescription: "SDS-plus rotary hammer in the 26 mm class with drill, hammer and chisel modes.",
    specifications: {
      "Chuck": "SDS-plus",
      "Capacity class": "26 mm",
      "Modes": "Drill / hammer / chisel",
    },
    imageUrl: IMG.drill,
  }),
  p({
    slug: "ideal-mc110-marble-cutter",
    productName: "Ideal 110 mm Marble Cutter",
    brand: "Ideal",
    brandSlug: "ideal",
    modelNumber: "MC-110",
    category: "power-tools",
    subcategory: "Cutting",
    shortDescription: "110 mm marble and tile cutter for finish work in tiling and stone fitting.",
    specifications: {
      "Blade diameter": "110 mm",
      "Material": "Tile, marble, stone",
      "Cutting": "Dry cut",
    },
    imageUrl: IMG.grinder,
  }),
  p({
    slug: "ideal-is0632-spanner-set",
    productName: "Ideal Combination Spanner Set 6–32 mm",
    brand: "Ideal",
    brandSlug: "ideal",
    modelNumber: "IS-0632",
    category: "hand-tools",
    subcategory: "Spanners & sockets",
    shortDescription: "Full-range combination spanner set in a roll pouch for mechanical and maintenance crews.",
    specifications: {
      "Range": "6–32 mm",
      "Type": "Combination (ring + open)",
      "Packing": "Roll pouch",
    },
    imageUrl: IMG.hands,
    featured: true,
  }),
  p({
    slug: "flap-disc-100mm-assorted",
    productName: "Flap Disc Pack — 100 mm Assorted",
    brand: "Multi-fit",
    brandSlug: "multi-fit",
    modelNumber: "FD-100-ASS",
    category: "spare-parts",
    subcategory: "Abrasives",
    shortDescription: "Assorted 100 mm flap discs for blending and finishing steel surfaces.",
    specifications: {
      "Disc diameter": "100 mm",
      "Type": "Flap disc",
      "Application": "Blending & finishing steel",
    },
    imageUrl: IMG.grinder,
  }),
  p({
    slug: "texmo-3hp-induction-motor",
    productName: "Texmo 3 HP Three-Phase Induction Motor",
    brand: "Texmo",
    brandSlug: "texmo",
    modelNumber: "TMO-3HP",
    category: "motors-pumps",
    subcategory: "Motors",
    shortDescription: "3 HP three-phase induction motor for compressors, pumps and light industrial drives.",
    specifications: {
      "Rated output": "3 HP",
      "Supply": "Three-phase",
      "Mounting": "IEC foot mount",
      "Duty": "Continuous duty class",
    },
    imageUrl: IMG.motor,
    featured: true,
  }),
  p({
    slug: "texmo-water-pump-set",
    productName: "Texmo Water Pump Set",
    brand: "Texmo",
    brandSlug: "texmo",
    modelNumber: "TP-05",
    category: "motors-pumps",
    subcategory: "Pumps",
    shortDescription: "Centrifugal water pump set for domestic and light commercial water supply.",
    specifications: {
      "Type": "Centrifugal pump set",
      "Priming": "Self-priming class",
      "Application": "Domestic & light commercial",
    },
    imageUrl: IMG.motor,
    featured: true,
  }),
  p({
    slug: "imperial-vented-safety-helmet",
    productName: "Imperial Vented Safety Helmet",
    brand: "Imperial",
    brandSlug: "imperial",
    modelNumber: "IMP-H2",
    category: "safety-equipment",
    subcategory: "Head protection",
    shortDescription: "HDPE safety helmet with ratchet suspension and vented crown for hot-site comfort.",
    specifications: {
      "Shell": "HDPE",
      "Suspension": "Adjustable ratchet",
      "Crown": "Vented",
      "Colours": "White, yellow, red",
    },
    imageUrl: IMG.safety,
    featured: true,
  }),
  p({
    slug: "haible-hi-vis-vest",
    productName: "Haible Export Hi-Vis Reflective Vest",
    brand: "Haible Export",
    brandSlug: "haible-export",
    modelNumber: "HH-VEST",
    category: "safety-equipment",
    subcategory: "Workwear",
    shortDescription: "Lightweight hi-vis vest with reflective strips for site and road-side visibility.",
    specifications: {
      "Visibility": "Reflective strips",
      "Material": "Polyester mesh",
      "Closure": "Velcro front",
      "Colours": "Orange / yellow",
    },
    imageUrl: IMG.safety,
  }),
  p({
    slug: "american-safety-full-body-harness",
    productName: "American Safety Full-Body Harness",
    brand: "American Safety",
    brandSlug: "american-safety",
    modelNumber: "AS-FBH",
    category: "safety-equipment",
    subcategory: "Fall protection",
    shortDescription: "Full-body fall-arrest harness with dorsal D-ring and adjustable chest and leg straps.",
    specifications: {
      "Type": "Full-body harness",
      "Attachment": "Dorsal D-ring",
      "Adjustability": "Chest & leg adjusters",
    },
    imageUrl: IMG.safety,
    featured: true,
  }),
  p({
    slug: "prakash-steel-toe-safety-shoes",
    productName: "Prakash Steel-Toe Safety Shoes",
    brand: "Prakash",
    brandSlug: "prakash",
    modelNumber: "PS-STEEL",
    category: "safety-equipment",
    subcategory: "Footwear",
    shortDescription: "Steel-toe safety shoes with anti-slip soles for construction and industrial sites.",
    specifications: {
      "Toe cap": "Steel",
      "Sole": "Anti-slip",
      "Use": "Construction & industrial",
    },
    imageUrl: IMG.safety,
  }),
];

/* ── Adapters (Supabase-swappable) ─────────────────────────────── */

const tick = () => new Promise<void>((r) => setTimeout(r, 120));

export async function fetchProducts(): Promise<Product[]> {
  await tick();
  return [...products];
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  await tick();
  return products.find((pr) => pr.slug === slug);
}

export async function fetchProductsByBrand(brandSlug: string): Promise<Product[]> {
  await tick();
  return products.filter((pr) => pr.brandSlug === brandSlug);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  await tick();
  return products.filter((pr) => pr.featured);
}

export async function fetchRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  await tick();
  return products
    .filter((pr) => pr.slug !== product.slug && pr.category === product.category)
    .concat(products.filter((pr) => pr.slug !== product.slug && pr.category !== product.category))
    .slice(0, limit);
}

export function productCountByCategory(categorySlug: string): number {
  if (categorySlug === "rental-equipment") return 0; // rental is a separate catalogue
  return products.filter((pr) => pr.category === categorySlug).length;
}

export function productCountByBrand(brandSlug: string): number {
  return products.filter((pr) => pr.brandSlug === brandSlug).length;
}

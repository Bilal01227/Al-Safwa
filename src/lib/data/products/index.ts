/**
 * Product catalogue — aggregator + Supabase-swappable adapters.
 * ─────────────────────────────────────────────────────────────────
 *  Add inventory by editing the division files in this folder
 *  (power-tools.ts, safety-equipment.ts, motors-pumps.ts,
 *   hand-tools.ts, spare-parts.ts) — see INVENTORY_GUIDE.md.
 *  RULES: no invented prices (request_quote), no invented stock
 *  ("Contact for availability"), verified: false until the business
 *  owner confirms a record.
 * ─────────────────────────────────────────────────────────────────
 *  SUPABASE PHASE: replace the adapter function bodies below with
 *  supabase.from("products") queries. Signatures stay identical.
 */
import type { Product } from "../../types";
import { powerTools } from "./power-tools";
import { safetyEquipment } from "./safety-equipment";
import { motorsPumps } from "./motors-pumps";
import { handTools } from "./hand-tools";
import { spareParts } from "./spare-parts";

export const products: Product[] = [
  ...powerTools,
  ...safetyEquipment,
  ...motorsPumps,
  ...handTools,
  ...spareParts,
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

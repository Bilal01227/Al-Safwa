import type { Product } from "../../types";
import { supabase } from "../../supabase";
import { IMG } from "../images";
import { powerTools } from "./power-tools";
import { safetyEquipment } from "./safety-equipment";
import { motorsPumps } from "./motors-pumps";
import { handTools } from "./hand-tools";
import { spareParts } from "./spare-parts";

/**
 * Legacy catalogue data is retained only as an emergency fallback if the
 * database cannot be reached. Once Supabase is available, the database is
 * authoritative so Admin CRUD (create/edit/delete/active) controls the site.
 */
export const products: Product[] = [
  ...powerTools,
  ...safetyEquipment,
  ...motorsPumps,
  ...handTools,
  ...spareParts,
];

type DbProduct = {
  id: string;
  name: string;
  slug: string;
  brand_id: string | null;
  category_id: string | null;
  model_number: string | null;
  short_description: string | null;
  specifications: Record<string, string> | null;
  price: number | null;
  currency: string;
  price_type: string;
  availability_status: string;
  featured: boolean;
  verified: boolean;
  source_url: string | null;
  source_company: string | null;
  last_verified_at: string | null;
  active: boolean;
};

type Ref = { id: string; name: string; slug: string };
type ImageRef = { product_id: string; storage_path: string; is_primary: boolean; sort_order: number };

const fallbackImage = (category: string) => {
  if (category === "power-tools") return IMG.drill;
  if (category === "safety-equipment") return IMG.safety;
  if (category === "motors-pumps") return IMG.motor;
  if (category === "hand-tools") return IMG.hands;
  if (category === "spare-parts") return IMG.grinder;
  return IMG.hero;
};

async function fromSupabase(): Promise<Product[]> {
  const [p, b, c, i] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id,name,slug,brand_id,category_id,model_number,short_description,specifications,price,currency,price_type,availability_status,featured,verified,source_url,source_company,last_verified_at,active",
      )
      .eq("active", true),
    supabase.from("brands").select("id,name,slug"),
    supabase.from("categories").select("id,name,slug"),
    supabase.from("product_images").select("product_id,storage_path,is_primary,sort_order").order("sort_order"),
  ]);

  if (p.error) throw p.error;
  if (b.error) throw b.error;
  if (c.error) throw c.error;
  if (i.error) throw i.error;

  const brandRefs = (b.data || []) as Ref[];
  const categoryRefs = (c.data || []) as Ref[];
  const images = (i.data || []) as ImageRef[];

  return ((p.data || []) as DbProduct[]).map((x) => {
    const brand = brandRefs.find((v) => v.id === x.brand_id);
    const category = categoryRefs.find((v) => v.id === x.category_id);
    const image = images
      .filter((v) => v.product_id === x.id)
      .sort((a, z) => Number(z.is_primary) - Number(a.is_primary) || a.sort_order - z.sort_order)[0];

    const imageUrl = image
      ? supabase.storage.from("product-images").getPublicUrl(image.storage_path).data.publicUrl
      : fallbackImage(category?.slug || "");

    return {
      slug: x.slug,
      productName: x.name,
      brand: brand?.name || "Al Safwa",
      brandSlug: brand?.slug || "al-safwa",
      modelNumber: x.model_number || "—",
      category: category?.slug || "industrial-equipment",
      subcategory: category?.name || "Industrial Equipment",
      shortDescription: x.short_description || "",
      specifications: x.specifications || {},
      imageUrl,
      sourceUrl: x.source_url || "",
      sourceCompany: x.source_company || "",
      availability: x.availability_status,
      currency: x.currency,
      price: x.price,
      priceType: (x.price_type || "request_quote") as Product["priceType"],
      verified: x.verified,
      lastVerified: x.last_verified_at,
      featured: x.featured,
    };
  });
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    // Supabase is authoritative. This is what makes Admin CRUD control the
    // public catalogue instead of silently resurrecting deleted React items.
    return await fromSupabase();
  } catch {
    // Only use the old catalogue if the database itself is unavailable.
    return products;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await fetchProducts();
  return all.find((p) => p.slug === slug);
}

export async function fetchProductsByBrand(brandSlug: string): Promise<Product[]> {
  return (await fetchProducts()).filter((p) => p.brandSlug === brandSlug);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return (await fetchProducts()).filter((p) => p.featured);
}

export async function fetchRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await fetchProducts();
  return all
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .concat(all.filter((p) => p.slug !== product.slug && p.category !== product.category))
    .slice(0, limit);
}

export function productCountByCategory(categorySlug: string): number {
  if (categorySlug === "rental-equipment") return 0;
  return products.filter((p) => p.category === categorySlug).length;
}

export function productCountByBrand(brandSlug: string): number {
  return products.filter((p) => p.brandSlug === brandSlug).length;
}

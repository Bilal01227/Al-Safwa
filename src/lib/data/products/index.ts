import type { Product } from "../../types";
import { supabase } from "../../supabase";
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
  subcategory_id: string | null;
  model_number: string | null;
  short_description: string | null;
  full_description: string | null;
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

type Ref = { id: string; name: string; slug: string; image_path?: string | null };
type ImageRef = { product_id: string; storage_path: string; is_primary: boolean; sort_order: number };

async function fetchAllRows<T>(query: any): Promise<T[]> {
  const rows: T[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await query.range(offset, offset + pageSize - 1);
    if (error) throw error;
    const page = (data || []) as T[];
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

async function fromSupabase(): Promise<Product[]> {
  const [p, b, c, i] = await Promise.all([
    fetchAllRows<DbProduct>(supabase.from("products").select(
      "id,name,slug,brand_id,category_id,subcategory_id,model_number,short_description,full_description,specifications,price,currency,price_type,availability_status,featured,verified,source_url,source_company,last_verified_at,active",
    )),
    fetchAllRows<Ref>(supabase.from("brands").select("id,name,slug")),
    fetchAllRows<Ref>(supabase.from("categories").select("id,name,slug,image_path,parent_id")),
    fetchAllRows<ImageRef>(supabase.from("product_images").select("product_id,storage_path,is_primary,sort_order").order("sort_order")),
  ]);

  const brandRefs = b;
  const categoryRefs = c;
  const images = i;

  return (p || []).map((x) => {
    const brand = brandRefs.find((v) => v.id === x.brand_id);
    const category = categoryRefs.find((v) => v.id === x.category_id);
    const subcategory = x.subcategory_id ? categoryRefs.find((v) => v.id === x.subcategory_id) : undefined;
    const parentCategory = category?.parent_id ? categoryRefs.find((v) => v.id === category.parent_id) : undefined;
    const primaryCategory = parentCategory || category;
    const image = images
      .filter((v) => v.product_id === x.id)
      .sort((a, z) => Number(z.is_primary) - Number(a.is_primary) || a.sort_order - z.sort_order)[0];

    // Exact product photo wins. Otherwise use the image managed on its category
    // in Admin > Categories, then fall back to the existing local category art.
    const categoryImage = category?.image_path
      ? supabase.storage.from("category-images").getPublicUrl(category.image_path).data.publicUrl
      : null;
    const imageUrl = image
      ? ((image.storage_path.startsWith("https://") || image.storage_path.startsWith("http://")) ? image.storage_path : supabase.storage.from("product-images").getPublicUrl(image.storage_path).data.publicUrl)
      : categoryImage || "";

    return {
      slug: x.slug,
      productName: x.name,
      brand: brand?.name || "Al Safwa",
      brandSlug: brand?.slug || "al-safwa",
      modelNumber: x.model_number || "—",
      category: primaryCategory?.slug || "industrial-equipment",
      subcategory: subcategory?.name || (parentCategory ? category?.name : category?.name) || "Industrial Equipment",
      shortDescription: x.short_description || "",
      description: x.full_description || x.short_description || "",
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
    // Supabase is authoritative. Every database product is retained in the public catalogue;
    // pagination prevents the default PostgREST row cap from truncating larger imports.
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

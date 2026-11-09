import type { Brand } from "../types";
import { supabase } from "../supabase";

export const brands: Brand[] = [
  { slug: "bosch", name: "Bosch", monogram: "BO", logoPath: "brands/dc267a2b-7a7b-4319-9eb7-cf4e0a869055.jpg", divisions: ["Power Tools"], about: "German manufacturer of professional power tools, accessories and measuring equipment." },
  { slug: "makita", name: "Makita", monogram: "MA", logoPath: "brands/e9397bd2-0e39-4d72-aca3-41dd2cb41849.png", divisions: ["Power Tools"], about: "Japanese manufacturer of professional-grade corded and cordless power tools." },
  { slug: "dewalt", name: "DeWalt", monogram: "DW", logoPath: "/images/dewalt.jpg", divisions: ["Power Tools"], about: "American brand of professional power tools and accessories for heavy trade use." },
  { slug: "stanley", name: "Stanley", monogram: "ST", logoPath: "/images/Stanley.jpg", divisions: ["Power Tools", "Hand Tools"], about: "American manufacturer of hand tools and professional trade equipment." },
  { slug: "dongcheng", name: "Dongcheng", monogram: "DC", logoPath: "/images/dong%20chong.png", divisions: ["Power Tools"], about: "Chinese manufacturer of professional power tools widely used across Gulf construction sites." },
  { slug: "Ingco", name: "INGCO", monogram: "IN", logoPath: "/images/ingco.png", divisions: ["Power Tools"], about: "Global power tools and hand tools brand supplied across Oman and regional Gulf markets." },
  { slug: "dalilee", name: "Dalilee", monogram: "DA", logoPath: "/images/Dalilee.jpg", divisions: ["Power Tools"], about: "Equipment brand supplying drilling and construction tools to regional distributors." },
  { slug: "ideal", name: "Ideal", monogram: "ID", logoPath: "/images/ideal.jpg", divisions: ["Power Tools", "Hand Tools"], about: "Trade tools brand covering hand tools and power tools for workshops and contractors." },
  { slug: "imperial", name: "Imperial", monogram: "IM", logoPath: "/images/imperial.png", divisions: ["Safety Equipment"], about: "Supplier of personal protective equipment and industrial safety products." },
  { slug: "haible-export", name: "Haible Export", monogram: "HE", logoPath: "/images/haible%20export.jpg", divisions: ["Safety Equipment"], about: "Export house supplying safety equipment and industrial consumables." },
  { slug: "american-safety", name: "American Safety", monogram: "AS", logoPath: "/images/americansafety_logo.jpg", divisions: ["Safety Equipment"], about: "Brand of personal protective equipment for industrial and construction environments." },
  { slug: "prakash", name: "Prakash", monogram: "PR", logoPath: "/images/prakashpump_logo.jpg", divisions: ["Safety Equipment"], about: "Manufacturer of safety footwear and protective workwear." },
  { slug: "texmo-motors", name: "Texmo Motors", monogram: "TX", logoPath: "/images/Texmo.png", divisions: ["Motors & Pumps"], about: "Indian manufacturer of electric motors and water pumps for industrial and agricultural use." },
  { slug: "multi-fit", name: "Multi-fit", monogram: "MF", logoPath: "/images/multifit.jpg", divisions: ["Spare Parts"], about: "Multi-fit consumables and replacement parts supplied by Al Safwa Trading." },
];

export const getBrandLogoUrl = (path?: string) => !path ? "" : (path.startsWith("/") || path.startsWith("https://") || path.startsWith("http://") ? path : supabase.storage.from("brand-images").getPublicUrl(path).data.publicUrl);

function mapLiveBrand(row: any): Brand {
  const fallback = brands.find((b) => b.slug === row.slug);
  return { slug: row.slug, name: row.name, monogram: fallback?.monogram || row.name.slice(0, 2).toUpperCase(), divisions: fallback?.divisions || ["Industrial Equipment"], about: row.description || fallback?.about || `${row.name} products supplied by Al Safwa Trading in Oman.`, logoPath: row.logo_path || fallback?.logoPath };
}

export async function fetchBrands(): Promise<Brand[]> {
  const { data, error } = await supabase.from("brands").select("name,slug,logo_path,description,active,sort_order").eq("active", true).order("sort_order", { ascending: true }).order("name", { ascending: true });
  return error || !data?.length ? brands : data.map(mapLiveBrand);
}

export async function fetchBrand(slug: string): Promise<Brand | undefined> {
  const { data, error } = await supabase.from("brands").select("name,slug,logo_path,description,active,sort_order").eq("slug", slug).eq("active", true).maybeSingle();
  if (error || !data) return brands.find((b) => b.slug === slug);
  return mapLiveBrand(data);
}

export const getBrand = (slug: string): Brand | undefined => brands.find((b) => slug !== undefined && b.slug === slug);

export const TRADEMARK_NOTE = "All brand names and trademarks shown on this website are the property of their respective owners. Al Safwa Trading supplies genuine products through verified sourcing; authorized-dealer status is stated only where formally confirmed.";

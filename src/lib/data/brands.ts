import type { Brand } from "../types";
import { supabase } from "../supabase";
import "./brands-home.css";

export const brands: Brand[] = [
  { slug: "bosch", name: "Bosch", monogram: "BO", divisions: ["Power Tools"], about: "German manufacturer of professional power tools, accessories and measuring equipment." },
  { slug: "makita", name: "Makita", monogram: "MA", divisions: ["Power Tools"], about: "Japanese manufacturer of professional-grade corded and cordless power tools." },
  { slug: "dewalt", name: "DeWalt", monogram: "DW", divisions: ["Power Tools"], about: "American brand of professional power tools and accessories for heavy trade use." },
  { slug: "stanley", name: "Stanley", monogram: "ST", divisions: ["Power Tools", "Hand Tools"], about: "American manufacturer of hand tools and professional trade equipment." },
  { slug: "dongcheng", name: "Dongcheng", monogram: "DC", divisions: ["Power Tools"], about: "Chinese manufacturer of professional power tools widely used across Gulf construction sites." },
  { slug: "ongco", name: "Ongco", monogram: "ON", divisions: ["Power Tools"], about: "Tools and equipment brand supplied across Oman and regional Gulf markets." },
  { slug: "dalilee", name: "Dalilee", monogram: "DA", divisions: ["Power Tools"], about: "Equipment brand supplying drilling and construction tools to regional distributors." },
  { slug: "ideal", name: "Ideal", monogram: "ID", divisions: ["Power Tools", "Hand Tools"], about: "Trade tools brand covering hand tools and power tools for workshops and contractors." },
  { slug: "imperial", name: "Imperial", monogram: "IM", divisions: ["Safety Equipment"], about: "Supplier of personal protective equipment and industrial safety products." },
  { slug: "haible-export", name: "Haible Export", monogram: "HE", divisions: ["Safety Equipment"], about: "Export house supplying safety equipment and industrial consumables." },
  { slug: "american-safety", name: "American Safety", monogram: "AS", divisions: ["Safety Equipment"], about: "Brand of personal protective equipment for industrial and construction environments." },
  { slug: "prakash", name: "Prakash", monogram: "PR", divisions: ["Safety Equipment"], about: "Manufacturer of safety footwear and protective workwear." },
  { slug: "texmo-motors", name: "Texmo Motors", monogram: "TX", divisions: ["Motors & Pumps"], about: "Indian manufacturer of electric motors and water pumps for industrial and agricultural use." },
  { slug: "multi-fit", name: "Multi-fit", monogram: "MF", divisions: ["Spare Parts"], about: "Multi-fit consumables and replacement parts supplied by Al Safwa Trading." },
];

function mapLiveBrand(row: any): Brand {
  const fallback = brands.find((b) => b.slug === row.slug);
  return { slug: row.slug, name: row.name, monogram: fallback?.monogram || row.name.slice(0, 2).toUpperCase(), divisions: fallback?.divisions || ["Industrial Equipment"], about: row.description || fallback?.about || `${row.name} products supplied by Al Safwa Trading in Oman.`, logoPath: row.logo_path || undefined };
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

/** One live logo layer for the legacy homepage cards. !important deliberately wins over any older cached/static logo rule. */
async function syncHomepageBrandLogos() {
  const { data, error } = await supabase.from("brands").select("slug,logo_path").eq("active", true);
  if (error || !data?.length || typeof document === "undefined") return;
  const styleId = "live-homepage-brand-logos";
  document.getElementById(styleId)?.remove();
  const rules = data.filter((row) => row.slug && row.logo_path).map((row) => {
    const publicUrl = supabase.storage.from("brand-images").getPublicUrl(row.logo_path!).data.publicUrl;
    if (!publicUrl) return "";
    const slug = CSS.escape(row.slug);
    const url = JSON.stringify(publicUrl);
    return `a[href*="/brands/${slug}"] span.grid{font-size:0!important;color:transparent!important;background-image:url(${url})!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important;background-color:transparent!important;}a[href*="/brands/${slug}"] span.grid>img{display:none!important;}`;
  }).filter(Boolean).join("\n");
  if (!rules) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = rules;
  document.head.appendChild(style);
}

void syncHomepageBrandLogos();

export const getBrand = (slug: string): Brand | undefined => brands.find((b) => slug !== undefined && b.slug === slug);

export const TRADEMARK_NOTE = "All brand names and trademarks shown on this website are the property of their respective owners. Al Safwa Trading supplies genuine products through verified sourcing; authorized-dealer status is stated only where formally confirmed.";

import type { Category, IconKey } from "../types";
import { supabase } from "../supabase";
import { IMG } from "./images";

/** Curated fallback catalogue divisions. Supabase is authoritative when available. */
export const categories: Category[] = [
  { slug: "power-tools", name: "Power Tools", blurb: "Drills, impact tools, rotary hammers, sanders and professional electric tools.", imageUrl: "/images/01-power-tools.png", icon: "drill" },
  { slug: "heavy-machinery", name: "Heavy Machinery", blurb: "Excavators, loaders and construction machinery for demanding site work.", imageUrl: "/images/02-heavy-machinery.png", icon: "crane" },
  { slug: "welding-equipment", name: "Welding Equipment", blurb: "Welders, welding machines and fabrication equipment for workshops and sites.", imageUrl: "/images/03-welding-equipment.png", icon: "bolt" },
  { slug: "generators", name: "Generators", blurb: "Diesel and portable power generation equipment for backup and job sites.", imageUrl: "/images/04-generators.png", icon: "bolt" },
  { slug: "air-compressors", name: "Air Compressors", blurb: "Industrial compressors and compressed-air equipment for pneumatic tools.", imageUrl: "/images/05-air-compressors.png", icon: "motor" },
  { slug: "safety-equipment", name: "Safety Equipment", blurb: "Helmets, gloves, high-vis wear, eye protection, footwear and fall protection.", imageUrl: "/images/06-safety-equipment.png", icon: "helmet" },
  { slug: "hand-tools", name: "Hand Tools", blurb: "Wrenches, pliers, screwdrivers, hammers and workshop hand tools.", imageUrl: "/images/07-hand-tools.png", icon: "wrench" },
  { slug: "motors-pumps", name: "Motors & Pumps", blurb: "Electric motors, water pumps, pressure pumps and industrial pumping equipment.", imageUrl: "/images/08-motors-and-pumps.png", icon: "motor" },
  { slug: "cutting-tools", name: "Cutting & Grinding", blurb: "Angle grinders, cutting tools, saws and abrasive equipment for fabrication.", imageUrl: "/images/09-cutting-and-grinding.png", icon: "gear" },
  { slug: "measuring-tools", name: "Measuring & Testing", blurb: "Digital multimeters and professional tools for electrical and technical testing.", imageUrl: "/images/10-measuring-and-testing.png", icon: "bolt" },
  { slug: "spare-parts", name: "Spare Parts", blurb: "Replacement components, wear parts and consumables for industrial equipment.", imageUrl: "/images/11-spare-parts.png", icon: "gear" },
  { slug: "lifting-equipment", name: "Lifting & Material Handling", blurb: "Site equipment for lifting, moving and handling heavy materials safely.", imageUrl: "/images/12-lifting-and-material-handling.png", icon: "hook" },
  { slug: "cleaning-equipment", name: "Cleaning Equipment", blurb: "Pressure washers and industrial cleaning equipment for facilities and sites.", imageUrl: "/images/13-cleaning-equipment.png", icon: "hook" },
  { slug: "electrical-equipment", name: "Electrical Equipment", blurb: "Electrical testing and job-site equipment for contractors and technicians.", imageUrl: "/images/14-electrical-equipment.png", icon: "bolt" },
  { slug: "agricultural-equipment", name: "Agricultural Equipment", blurb: "Tractors and machinery supporting agricultural, irrigation and field operations.", imageUrl: "/images/15-agricultural-equipment.png", icon: "crane" },
  { slug: "rental-equipment", name: "Rental Equipment", blurb: "Generators, welding sets, power tools and site equipment available for rent.", imageUrl: "/images/16-rental-equipment.png", icon: "hook" },
];

const uploadedCategoryImages: Record<string, string> = {
  "drills": "categories/acc65516-f66a-4e30-a93e-b76863d147e3.jpg",
  "helmets": "categories/592bcd3f-0290-412e-853b-8c732f39d034.jpg",
  "water-pumps": "categories/6fd03fcc-1b44-445b-b408-49ef761f75e4.jpg",
};

function categoryImage(slug: string, fallback: string) {
  const path = uploadedCategoryImages[slug];
  return path ? supabase.storage.from("category-images").getPublicUrl(path).data.publicUrl : fallback;
}

// Preserve admin-uploaded subcategory images; the 16 homepage divisions use their
// explicitly named repository images above.
for (const category of categories) {
  category.imageUrl = categoryImage(category.slug, category.imageUrl);
}

function mapLiveCategory(row: any): Category {
  const fallback = categories.find((c) => c.slug === row.slug);
  const icon = (row.icon || fallback?.icon || "gear") as IconKey;
  const imageUrl = row.image_path
    ? supabase.storage.from("category-images").getPublicUrl(row.image_path).data.publicUrl
    : fallback?.imageUrl || IMG.hero;
  return {
    slug: row.slug,
    name: row.name,
    blurb: row.blurb || row.description || fallback?.blurb || `${row.name} supplied by Al Safwa Trading in Oman.`,
    imageUrl,
    icon,
    homepageVisible: row.homepage_visible ?? true,
    parentId: row.parent_id || null,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description,parent_id,image_path,active,sort_order,blurb,icon,homepage_visible")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error || !data?.length) return categories;
  return data.map(mapLiveCategory);
}

export const getCategory = (slug: string): Category | undefined => categories.find((c) => c.slug === slug);

import type { Category } from "../types";
import { IMG } from "./images";

/**
 * Curated top-level divisions shown across the site.
 *
 * Keep these broad enough for future catalogue growth while retaining the
 * existing Supabase category slugs used by the current 54-item catalogue.
 */
export const categories: Category[] = [
  {
    slug: "power-tools",
    name: "Power Tools",
    blurb: "Drills, impact tools, rotary hammers, sanders and professional electric tools.",
    imageUrl: IMG.drill,
    icon: "drill",
  },
  {
    slug: "heavy-machinery",
    name: "Heavy Machinery",
    blurb: "Excavators, loaders and construction machinery for demanding site work.",
    imageUrl: IMG.machinery,
    icon: "crane",
  },
  {
    slug: "welding-equipment",
    name: "Welding Equipment",
    blurb: "Welders, welding machines and fabrication equipment for workshops and sites.",
    imageUrl: IMG.welder,
    icon: "bolt",
  },
  {
    slug: "generators",
    name: "Generators",
    blurb: "Diesel and portable power generation equipment for backup and job sites.",
    imageUrl: IMG.generator,
    icon: "bolt",
  },
  {
    slug: "air-compressors",
    name: "Air Compressors",
    blurb: "Industrial compressors and compressed-air equipment for pneumatic tools.",
    imageUrl: IMG.compressor,
    icon: "motor",
  },
  {
    slug: "safety-equipment",
    name: "Safety Equipment",
    blurb: "Helmets, gloves, high-vis wear, eye protection, footwear and fall protection.",
    imageUrl: IMG.safety,
    icon: "helmet",
  },
  {
    slug: "hand-tools",
    name: "Hand Tools",
    blurb: "Wrenches, pliers, screwdrivers, hammers and workshop hand tools.",
    imageUrl: IMG.hands,
    icon: "wrench",
  },
  {
    slug: "motors-pumps",
    name: "Motors & Pumps",
    blurb: "Electric motors, water pumps, pressure pumps and industrial pumping equipment.",
    imageUrl: IMG.pump,
    icon: "motor",
  },
  {
    slug: "cutting-tools",
    name: "Cutting & Grinding",
    blurb: "Angle grinders, cutting tools, saws and abrasive equipment for fabrication.",
    imageUrl: IMG.cutting,
    icon: "gear",
  },
  {
    slug: "measuring-tools",
    name: "Measuring & Testing",
    blurb: "Digital multimeters and professional tools for electrical and technical testing.",
    imageUrl: IMG.measuring,
    icon: "bolt",
  },
  {
    slug: "spare-parts",
    name: "Spare Parts",
    blurb: "Replacement components, wear parts and consumables for industrial equipment.",
    imageUrl: IMG.spareParts,
    icon: "gear",
  },
  {
    slug: "lifting-equipment",
    name: "Lifting & Material Handling",
    blurb: "Site equipment for lifting, moving and handling heavy materials safely.",
    imageUrl: IMG.lifting,
    icon: "hook",
  },
  {
    slug: "cleaning-equipment",
    name: "Cleaning Equipment",
    blurb: "Pressure washers and industrial cleaning equipment for facilities and sites.",
    imageUrl: IMG.cleaning,
    icon: "hook",
  },
  {
    slug: "electrical-equipment",
    name: "Electrical Equipment",
    blurb: "Electrical testing and job-site equipment for contractors and technicians.",
    imageUrl: IMG.electrical,
    icon: "bolt",
  },
  {
    slug: "agricultural-equipment",
    name: "Agricultural Equipment",
    blurb: "Tractors and machinery supporting agricultural, irrigation and field operations.",
    imageUrl: IMG.agricultural,
    icon: "crane",
  },
  {
    slug: "rental-equipment",
    name: "Rental Equipment",
    blurb: "Generators, welding sets, power tools and site equipment available for rent.",
    imageUrl: IMG.generator,
    icon: "hook",
  },
];

export const getCategory = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

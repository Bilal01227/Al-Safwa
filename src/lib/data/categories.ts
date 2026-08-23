import type { Category } from "../types";
import { IMG } from "./images";

/** The seven divisions shown across the site. */
export const categories: Category[] = [
  {
    slug: "power-tools",
    name: "Power Tools",
    blurb: "Drills, grinders, rotary hammers and cutting tools from leading brands.",
    imageUrl: IMG.drill,
    icon: "drill",
  },
  {
    slug: "heavy-machinery",
    name: "Heavy Machinery",
    blurb: "Earthmoving and construction machinery — supply and rental planning.",
    imageUrl: IMG.machinery,
    icon: "crane",
  },
  {
    slug: "safety-equipment",
    name: "Safety Equipment",
    blurb: "PPE for head, body, hands and feet — helmets, vests, harnesses, footwear.",
    imageUrl: IMG.safety,
    icon: "helmet",
  },
  {
    slug: "hand-tools",
    name: "Hand Tools",
    blurb: "Spanner sets, pliers and workshop hand tools for trade professionals.",
    imageUrl: IMG.hands,
    icon: "wrench",
  },
  {
    slug: "motors-pumps",
    name: "Motors & Pumps",
    blurb: "Texmo electric motors and water pumps for industrial and commercial use.",
    imageUrl: IMG.motor,
    icon: "motor",
  },
  {
    slug: "spare-parts",
    name: "Spare Parts",
    blurb: "Consumables and replacement parts to keep equipment running.",
    imageUrl: IMG.grinder,
    icon: "gear",
  },
  {
    slug: "rental-equipment",
    name: "Rental Equipment",
    blurb: "Machinery, generators, welding sets and power tools available for rent.",
    imageUrl: IMG.generator,
    icon: "hook",
  },
];

export const getCategory = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

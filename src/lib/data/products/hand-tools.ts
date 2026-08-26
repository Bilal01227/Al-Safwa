import type { Product } from "../../types";
import { IMG } from "../images";
import { p } from "./_factory";

export const handTools: Product[] = [
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
      Range: "6–32 mm",
      Type: "Combination (ring + open)",
      Packing: "Roll pouch",
    },
    imageUrl: IMG.hands,
    featured: true,
  }),
  p({
    slug: "ideal-is-sc8-screwdriver-set",
    productName: "Ideal Screwdriver Set 8 pc",
    brand: "Ideal",
    brandSlug: "ideal",
    modelNumber: "IS-SC8",
    category: "hand-tools",
    subcategory: "Screwdrivers",
    shortDescription: "Eight-piece slotted and Phillips screwdriver set with magnetic tips.",
    specifications: {
      Pieces: "8",
      Tips: "Slotted & Phillips",
      Feature: "Magnetic tips",
    },
    imageUrl: IMG.hands,
  }),
  p({
    slug: "ideal-ib-set-ball-peen-hammers",
    productName: "Ideal Ball-Peen Hammer Set",
    brand: "Ideal",
    brandSlug: "ideal",
    modelNumber: "IB-SET",
    category: "hand-tools",
    subcategory: "Hammers",
    shortDescription: "Ball-peen engineering hammers with fibre handles for workshop and fabrication work.",
    specifications: {
      Type: "Ball-peen hammer",
      Handle: "Fibre / steel shaft class",
      Use: "Workshop & fabrication",
    },
    imageUrl: IMG.hands,
  }),
  p({
    slug: "stanley-st-pl3-pliers-set",
    productName: "Stanley Pliers Set 3 pc",
    brand: "Stanley",
    brandSlug: "stanley",
    modelNumber: "ST-PL3",
    category: "hand-tools",
    subcategory: "Pliers & cutters",
    shortDescription: "Three-piece pliers set — combination, long-nose and side cutters — for electrical and trade work.",
    specifications: {
      Pieces: "3",
      Contents: "Combination, long-nose, side cutter",
      Use: "Electrical & trade",
    },
    imageUrl: IMG.hands,
  }),
];

import type { Brand } from "../types";
import "./brands-home.css";

/**
 * Brands supplied by Al Safwa Trading.
 * Text-based monograms are used intentionally: third-party logos are not
 * reproduced unless usage is verified as legally appropriate.
 */
export const brands: Brand[] = [
  {
    slug: "bosch",
    name: "Bosch",
    monogram: "BO",
    divisions: ["Power Tools"],
    about: "German manufacturer of professional power tools, accessories and measuring equipment.",
  },
  {
    slug: "makita",
    name: "Makita",
    monogram: "MA",
    divisions: ["Power Tools"],
    about: "Japanese manufacturer of professional-grade corded and cordless power tools.",
  },
  {
    slug: "dewalt",
    name: "DeWalt",
    monogram: "DW",
    divisions: ["Power Tools"],
    about: "American brand of professional power tools and accessories for heavy trade use.",
  },
  {
    slug: "stanley",
    name: "Stanley",
    monogram: "ST",
    divisions: ["Power Tools", "Hand Tools"],
    about: "American manufacturer of hand tools and professional trade equipment.",
  },
  {
    slug: "dongcheng",
    name: "Dongcheng",
    monogram: "DC",
    divisions: ["Power Tools"],
    about: "Chinese manufacturer of professional power tools widely used across Gulf construction sites.",
  },
  {
    slug: "ongco",
    name: "Ongco",
    monogram: "ON",
    divisions: ["Power Tools"],
    about: "Tools and equipment brand supplied across Oman and regional Gulf markets.",
  },
  {
    slug: "dalilee",
    name: "Dalilee",
    monogram: "DA",
    divisions: ["Power Tools"],
    about: "Equipment brand supplying drilling and construction tools to regional distributors.",
  },
  {
    slug: "ideal",
    name: "Ideal",
    monogram: "ID",
    divisions: ["Power Tools", "Hand Tools"],
    about: "Trade tools brand covering hand tools and power tools for workshops and contractors.",
  },
  {
    slug: "imperial",
    name: "Imperial",
    monogram: "IM",
    divisions: ["Safety Equipment"],
    about: "Supplier of personal protective equipment and industrial safety products.",
  },
  {
    slug: "haible-export",
    name: "Haible Export",
    monogram: "HE",
    divisions: ["Safety Equipment"],
    about: "Export house supplying safety equipment and industrial consumables.",
  },
  {
    slug: "american-safety",
    name: "American Safety",
    monogram: "AS",
    divisions: ["Safety Equipment"],
    about: "Brand of personal protective equipment for industrial and construction environments.",
  },
  {
    slug: "prakash",
    name: "Prakash",
    monogram: "PR",
    divisions: ["Safety Equipment"],
    about: "Manufacturer of safety footwear and protective workwear.",
  },
  {
    slug: "texmo",
    name: "Texmo",
    monogram: "TX",
    divisions: ["Motors & Pumps"],
    about: "Indian manufacturer of electric motors and water pumps for industrial and agricultural use.",
  },
];

export const getBrand = (slug: string): Brand | undefined =>
  brands.find((b) => slug !== undefined && b.slug === slug);

export const TRADEMARK_NOTE =
  "All brand names and trademarks shown on this website are the property of their respective owners. Al Safwa Trading supplies genuine products through verified sourcing; authorized-dealer status is stated only where formally confirmed.";

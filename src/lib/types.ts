/** Shared data-model types — mirrors the future Supabase schema. */

export type PriceType =
  | "fixed"
  | "starting_from"
  | "request_quote"
  | "request_rental_quote";

export interface Product {
  slug: string;
  productName: string;
  brand: string;
  brandSlug: string;
  modelNumber: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  specifications: Record<string, string>;
  imageUrl: string;
  sourceUrl: string;
  sourceCompany: string;
  availability: string;
  price: number | null;
  currency: string;
  priceType: PriceType;
  verified: boolean;
  lastVerified: string | null;
  featured?: boolean;
}

export interface Brand {
  slug: string;
  name: string;
  monogram: string;
  divisions: string[];
  about: string;
  /** Relative path in the Supabase brand-images bucket. */
  logoPath?: string;
}

export interface Category {
  slug: string;
  name: string;
  blurb: string;
  imageUrl: string;
  icon: IconKey;
}

export interface RentalItem {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  condition: string;
  availability: string;
  dailyRate: string | null;
  weeklyRate: string | null;
  monthlyRate: string | null;
  imageUrl: string;
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  scope: string[];
  process: { title: string; detail: string }[];
  imageUrl: string;
  cta: "repair" | "maintenance" | "quote";
}

export type IconKey =
  | "drill"
  | "crane"
  | "helmet"
  | "wrench"
  | "motor"
  | "gear"
  | "hook"
  | "bolt";

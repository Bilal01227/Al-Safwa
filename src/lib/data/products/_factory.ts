/**
 * Internal record factory — applies the "no invented data" defaults
 * to every product record so a new entry only needs real fields.
 */
import type { Product } from "../../types";

export const CONTACT = "Contact for availability";
export const SRC = "Compiled from public manufacturer data — pending verification";

export const p = (
  d: Omit<
    Product,
    | "sourceUrl"
    | "sourceCompany"
    | "availability"
    | "price"
    | "currency"
    | "priceType"
    | "verified"
    | "lastVerified"
  >,
): Product => ({
  ...d,
  sourceUrl: "",
  sourceCompany: SRC,
  availability: CONTACT,
  price: null,
  currency: "OMR",
  priceType: "request_quote",
  verified: false,
  lastVerified: null,
});

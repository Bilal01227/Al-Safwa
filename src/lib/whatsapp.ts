/**
 * WhatsApp integration — every message is built from the configured
 * official number in business.ts. Never hard-coded per component.
 */
import { business } from "./business";
import type { Product, RentalItem } from "./types";

export function waHref(message?: string): string {
  const digits = business.whatsappNumber.replace(/\D/g, "");
  const base = digits ? `https://wa.me/${digits}` : "#/contact";
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const waGeneralMessage = (): string =>
  `Hello ${business.name}, I would like to enquire about industrial equipment supply in Oman.`;

export const waProductMessage = (p: Pick<Product, "productName" | "modelNumber">): string =>
  `Hello, I am interested in ${p.productName}, model ${p.modelNumber}. Please provide price and availability from ${business.name}.`;

export const waBrandMessage = (brandName: string): string =>
  `Hello, I would like to enquire about ${brandName} products available from ${business.name} in Oman.`;

export const waRentalMessage = (r: Pick<RentalItem, "name" | "model">): string =>
  `Hello, I would like a rental quote for ${r.name} (${r.model}) from ${business.name}. Please share availability and rental terms.`;

export const waRepairMessage = (): string =>
  `Hello, I would like to request an equipment repair through ${business.name}.`;

export const waServiceMessage = (serviceName: string): string =>
  `Hello, I would like to enquire about your ${serviceName} service at ${business.name}.`;

export const waQuoteMessage = (product?: string, model?: string): string =>
  product
    ? `Hello, please provide a quotation for ${product}${model ? ` (model ${model})` : ""} from ${business.name}.`
    : `Hello, I would like to request a quotation from ${business.name}.`;

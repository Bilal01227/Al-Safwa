/**
 * ─────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH for business identity & contact details.
 *  Replace every TODO(verify) placeholder with official verified
 *  information before launch. Nothing here is invented silently —
 *  unverified fields are explicitly marked.
 * ─────────────────────────────────────────────────────────────────
 */
export const business = {
  name: "Al Safwa Trading",
  country: "Oman",
  tagline: "Industrial Tools, Equipment & Machinery",
  descriptor:
    "Industrial equipment supply, rental, repair and maintenance for contractors, workshops and industrial businesses across Oman.",

  // TODO(verify): official Oman business phone
  phone: "+968 9200 0000",

  // TODO(verify): official WhatsApp number — digits only, with country code
  whatsappNumber: "96892000000",

  // TODO(verify): official business email
  email: "sales@alsafwa-trading.example",

  // TODO(verify): registered physical address
  addressLine1: "[Registered address pending verification]",
  addressLine2: "Muscat, Sultanate of Oman",

  // TODO(verify): official opening hours
  hours: "Sat–Thu 08:00–18:00 · Fri closed (placeholder)",

  // Generic Muscat embed until the exact verified location is published.
  googleMapsEmbedUrl: "https://www.google.com/maps?q=Muscat,Oman&output=embed",
  // TODO(verify): exact location URL
  googleMapsUrl: "",

  // TODO(verify): commercial registration — publish only if verified
  registration: "",

  /** True while placeholder contact details are still in place. */
  placeholdersPending: true,
} as const;

export const telHref = `tel:${business.phone.replace(/[^+\d]/g, "")}`;
export const mailHref = `mailto:${business.email}`;

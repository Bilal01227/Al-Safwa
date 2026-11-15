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

  // Official Oman business phone / WhatsApp
  phone: "+968 90167345",
  whatsappNumber: "96890167345",

  // TODO(verify): official business email
  email: "",

  // TODO(verify): registered physical address
  addressLine1: "Karsha",
  addressLine2: "Nizwa, Al Dakhiliyah Governorate, Sultanate of Oman",

  // TODO(verify): official opening hours
  hours: "Contact us for current opening hours",

  // Locality-level map only; exact shop pin has not been supplied.
  googleMapsEmbedUrl: "https://www.google.com/maps?q=Karsha%2C+Nizwa%2C+Al+Dakhiliyah%2C+Oman&output=embed",
  // Exact street-level pin not supplied; link resolves the verified locality.
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Karsha%2C+Nizwa%2C+Al+Dakhiliyah%2C+Oman",

  // TODO(verify): commercial registration — publish only if verified
  registration: "",

  /** True while placeholder contact details are still in place. */
  placeholdersPending: true,
} as const;

export const telHref = `tel:${business.phone.replace(/[^+\d]/g, "")}`;
export const mailHref = `mailto:${business.email}`;

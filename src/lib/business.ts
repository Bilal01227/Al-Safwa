/**
 * Single source of truth for public business identity and contact details.
 * The website's direct-call and WhatsApp contact is the original customer line.
 * Google Maps is used only to identify the physical shop location.
 */
export const business = {
  name: "Al Safwa Trading",
  country: "Oman",
  tagline: "Industrial Tools, Equipment & Machinery",
  descriptor:
    "Industrial equipment supply, rental, repair and maintenance for contractors, workshops and industrial businesses across Oman.",

  // Original business contact line: direct calls and WhatsApp.
  phone: "+968 9016 7345",
  whatsappNumber: "96890167345",

  email: "",

  // Exact locality and pin from the confirmed Google Maps listing.
  addressLine1: "RGVW+9WM, Nizwa, Sinaya",
  addressLine2: "Al Dakhiliyah Governorate, Sultanate of Oman",

  // Public directory sources conflict on Friday hours; do not publish guessed hours.
  hours: "Contact us for current opening hours",

  googleMapsEmbedUrl: "https://www.google.com/maps?output=embed&q=place_id%3AChIJJ2Frsf77jj4RyRewZBd2WIY",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=place_id%3AChIJJ2Frsf77jj4RyRewZBd2WIY",

  registration: "",
  placeholdersPending: false,
} as const;

export const telHref = `tel:${business.phone.replace(/[^+\d]/g, "")}`;
export const mailHref = `mailto:${business.email}`;

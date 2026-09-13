/**
 * Durable public image registry.
 *
 * Product-specific images are managed through Supabase Storage. These URLs
 * are durable visual fallbacks for catalogue/category items that do not have
 * an uploaded image yet. Each fallback is deliberately matched to the
 * equipment type so a drill never falls back to a hammer/rotary tool image.
 */
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`;

const commons = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;

export const IMG = {
  hero: img("photo-1504307651254-35680f356dfd"),

  // Exact equipment fallbacks
  drill: commons("Cordless Electric Drill.jpg"),
  grinder: "https://images.unsplash.com/photo-1530939027401-cca9976c77f7?auto=format&fit=crop&w=1600&q=82",
  safety: commons("Industrial helmet.jpg"),
  motor: commons("Industrial Electric Motor and Drive Mechanism.jpg"),
  pump: commons("Water pump.png"),
  machinery: commons("Construction site excavator and truck.jpg"),
  generator: commons("Dieselgenerator.jpg"),
  welder: commons("CO2 welding machine.jpg"),
  compressor: commons("Air Compressor.JPG"),
  hands: "https://images.unsplash.com/photo-1497218770144-3fea6dbc33fe?auto=format&fit=crop&w=1600&q=82",
  spareParts: commons("Heavy-machinery-parts.jpg"),
  measuring: commons("All multimeters.jpg"),

  // Broader catalogue divisions
  cutting: commons("Cordless Electric Drill.jpg"),
  lifting: commons("Construction site excavator and truck.jpg"),
  cleaning: img("photo-1527515637462-cff94eecc1ac"),
  electrical: commons("All multimeters.jpg"),
  agricultural: commons("Construction site excavator and truck.jpg"),
} as const;

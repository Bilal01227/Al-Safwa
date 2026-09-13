/**
 * Durable public image registry.
 *
 * The previous catalogue used Qwen-generated image URLs. Those generated
 * result URLs are temporary, so they were unsuitable for a production site.
 * Product-specific images are now managed through Supabase Storage; these
 * URLs are only the durable visual fallback for pages/items without an
 * uploaded image yet.
 */
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=82`;

export const IMG = {
  hero: img("photo-1504307651254-35680f356dfd"),
  drill: img("photo-1586864387967-d02ef85d93e8"),
  grinder: img("photo-1581092160607-ee22621dd758"),
  safety: img("photo-1541888946425-d81bb19240f5"),
  motor: img("photo-1518770660439-4636190af475"),
  machinery: img("photo-1504307651254-35680f356dfd"),
  generator: img("photo-1509390144018-eeaf65052242"),
  welder: img("photo-1504917595217-d4dc5ebe6122"),
  compressor: img("photo-1581094794329-c8112a89af12"),
  hands: img("photo-1581092160562-40aa08e78837"),
} as const;

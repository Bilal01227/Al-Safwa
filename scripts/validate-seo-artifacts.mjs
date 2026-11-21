import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const sitemapPath = path.join(dist, "sitemap.xml");
const xml = await readFile(sitemapPath, "utf8");
const urls = Array.from(xml.matchAll(/<loc>(https:\/\/alsafwaoman\.com[^<]*)<\/loc>/g), (m) => m[1]);
const unique = new Set(urls);
if (!urls.length) throw new Error("Sitemap is empty.");
if (unique.size !== urls.length) throw new Error("Sitemap contains duplicate URLs.");

for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.origin !== "https://alsafwaoman.com" || parsed.search || parsed.hash) {
    throw new Error("Non-canonical URL in sitemap: " + url);
  }
  const route = parsed.pathname === "/" ? "" : parsed.pathname.replace(/^\/+|\/+$/g, "");
  const file = path.join(dist, route, "index.html");
  try { await stat(file); } catch { throw new Error("Sitemap URL has no generated HTML: " + url); }
  const html = await readFile(file, "utf8");
  const canonicals = Array.from(html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?\s*>/gi), (m) => m[1]);
  if (canonicals.length !== 1 || canonicals[0] !== url) {
    throw new Error("Canonical mismatch or duplicate canonical: " + url + " -> " + canonicals.join(", "));
  }
  if (!/<title>[^<]+<\/title>/i.test(html)) throw new Error("Missing title: " + url);
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) throw new Error("Missing meta description: " + url);
  if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) throw new Error("Noindex URL listed in sitemap: " + url);
  const hreflangCount = (html.match(/rel="alternate" hreflang=/g) || []).length;
  if (hreflangCount < 3) throw new Error("Missing complete hreflang set: " + url);
  if (parsed.pathname.startsWith("/ar/") && !/<html lang="ar-OM" dir="rtl">/i.test(html)) {
    throw new Error("Arabic route missing Arabic language and RTL attributes: " + url);
  }
}

const productDir = path.join(dist, "products");
const productEntries = await import("node:fs/promises").then(({ readdir }) => readdir(productDir, { withFileTypes: true }));
const productSlugs = [];
for (const entry of productEntries) {
  if (!entry.isDirectory()) continue;
  try { await stat(path.join(productDir, entry.name, "index.html")); productSlugs.push(entry.name); } catch {}
}
if (!productSlugs.length) throw new Error("No static product pages were generated.");
for (const slug of productSlugs) {
  const en = "https://alsafwaoman.com/products/" + slug + "/";
  const ar = "https://alsafwaoman.com/ar/products/" + slug + "/";
  if (!unique.has(en) || !unique.has(ar)) throw new Error("English/Arabic product URL pair missing from sitemap: " + slug);
}
console.log("SEO artifact audit passed: " + urls.length + " canonical sitemap URLs, " + productSlugs.length + " English product pages and matching Arabic product URLs.");

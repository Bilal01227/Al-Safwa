import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const site = "https://alsafwaoman.com";
const pages = new Map([
  ["/products", ["Industrial Products Catalogue — Al Safwa Trading Oman", "Browse industrial power tools, safety equipment, motors, pumps and spare parts supplied by Al Safwa Trading in Oman."]],
  ["/brands", ["Industrial Brands We Supply — Al Safwa Trading Oman", "Explore industrial brands supplied by Al Safwa Trading in Oman."]],
  ["/rental", ["Industrial Equipment Rental — Al Safwa Trading Oman", "Explore equipment rental options for contractors and industrial operations across Oman."]],
  ["/services", ["Equipment Repair & Maintenance Services — Al Safwa Trading Oman", "Equipment repair, power tool repair, preventive maintenance and spare parts support in Oman."]],
  ["/repair", ["Equipment Repair Request — Al Safwa Trading Oman", "Request equipment inspection, repair and maintenance support from Al Safwa Trading in Oman."]],
  ["/request-quote", ["Request an Industrial Equipment Quote — Al Safwa Trading Oman", "Request pricing and availability for industrial tools, machinery, rental and spare parts in Oman."]],
  ["/contact", ["Contact Al Safwa Trading — Oman", "Contact Al Safwa Trading for industrial equipment supply, rental, repair and maintenance enquiries."]],
]);

async function collectTs(dir) {
  const files = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...await collectTs(full));
    else if (item.isFile() && item.name.endsWith(".ts")) files.push(full);
  }
  return files;
}
async function collectSlugs(dir) {
  const slugs = new Set();
  for (const file of await collectTs(dir)) {
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(/\bslug\s*:\s*["']([a-z0-9-]+)["']/g)) slugs.add(match[1]);
  }
  return slugs;
}
async function fetchSlugs(table) {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return [];
  const result = [];
  for (let offset = 0; offset < 10000; offset += 1000) {
    const url = new URL(base.replace(/\/$/, "") + "/rest/v1/" + table);
    url.searchParams.set("select", "slug");
    url.searchParams.set("active", "eq.true");
    url.searchParams.set("limit", "1000");
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, {
      headers: { apikey: key, Authorization: "Bearer " + key, Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(table + " returned HTTP " + response.status);
    const rows = await response.json();
    result.push(...rows.map((row) => row.slug).filter((slug) => typeof slug === "string" && /^[a-z0-9-]+$/.test(slug)));
    if (rows.length < 1000) break;
  }
  return result;
}
const humanize = (slug) => slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const brands = await collectSlugs(path.resolve("src/lib/data/brands.ts").replace(/brands\.ts$/, ""));
const services = await collectSlugs(path.resolve("src/lib/data/services.ts").replace(/services\.ts$/, ""));
const products = await collectSlugs(path.resolve("src/lib/data/products"));
for (const [table, target] of [["brands", brands], ["products", products]]) {
  try { for (const slug of await fetchSlugs(table)) target.add(slug); console.log("Loaded active " + table + " slugs."); }
  catch (error) { console.warn("Could not fetch " + table + " slugs; using repository fallback: " + error.message); }
}
for (const slug of brands) pages.set("/brands/" + slug, [humanize(slug) + " Products — Al Safwa Trading Oman", humanize(slug) + " products supplied by Al Safwa Trading in Oman. Request pricing and availability."]);
for (const slug of services) pages.set("/services/" + slug, [humanize(slug) + " — Al Safwa Trading Oman", humanize(slug) + " and industrial equipment services arranged by Al Safwa Trading in Oman."]);
for (const slug of products) pages.set("/products/" + slug, [humanize(slug) + " — Al Safwa Trading Oman", humanize(slug) + " supplied by Al Safwa Trading in Oman. Request product pricing and availability."]);

const rootHtml = await readFile(path.join(dist, "index.html"), "utf8");
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function meta(html, key, value, attr = "name") {
  const expression = new RegExp('(<meta\\s+[^>]*' + attr + '=["\\']' + key + '["\\'][^>]*content=["\\'])[^"\\']*(["\\'][^>]*>)', "i");
  return html.replace(expression, "$1" + esc(value) + "$2");
}
for (const [route, [title, description]] of pages) {
  const output = path.join(dist, route.slice(1), "index.html");
  await mkdir(path.dirname(output), { recursive: true });
  const canonical = site + route + "/";
  let html = rootHtml.replace(/<title>[\\s\\S]*?<\\/title>/i, "<title>" + esc(title) + "</title>");
  html = html.replace(/<link\\s+rel=["']canonical["']\\s+href=["'][^"']*["']\\s*\\/?\\s*>/i, '<link rel="canonical" href="' + canonical + '" />');
  html = meta(html, "description", description);
  html = meta(html, "og:title", title, "property");
  html = meta(html, "og:description", description, "property");
  html = meta(html, "og:url", canonical, "property");
  html = meta(html, "twitter:title", title);
  html = meta(html, "twitter:description", description);
  await writeFile(output, html, "utf8");
}
const urls = [site + "/", ...Array.from(pages.keys(), (route) => site + route + "/")];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map((url) => "  <url><loc>" + url + "</loc></url>").join("\n") + "\n</urlset>\n";
if (urls.length > 50000) throw new Error("Sitemap exceeds the 50,000 URL limit.");
await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
console.log("Generated " + pages.size + " route pages and " + urls.length + " sitemap URLs.");

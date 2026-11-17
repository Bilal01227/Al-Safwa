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
  ["/request-quote", ["Request an Industrial Equipment Quote — Al Safwa Trading Oman", "Request pricing for industrial tools, machinery, rental and spare parts in Oman."]],
  ["/contact", ["Contact Al Safwa Trading — Oman", "Contact Al Safwa Trading for industrial equipment supply, rental, repair and maintenance enquiries."]],
  ["/ar", ["الصفوة للتجارة | الأدوات والمعدات والآلات الصناعية في عُمان", "الصفوة للتجارة في عُمان: توريد الأدوات والمعدات الصناعية ومستلزمات السلامة والمحركات والمضخات، مع خيارات التأجير والإصلاح والصيانة."]],
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
    for (const match of source.matchAll(/\bslug\s*:\s*["']([A-Za-z0-9-]+)["']/g)) slugs.add(match[1]);
  }
  return slugs;
}
async function collectOneFile(file) {
  const source = await readFile(file, "utf8");
  return new Set(Array.from(source.matchAll(/\bslug\s*:\s*["']([A-Za-z0-9-]+)["']/g), (match) => match[1]));
}
async function fetchSlugs(table) {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) throw new Error('Supabase URL and publishable key are required for complete sitemap generation.');
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
    if (!response.ok) throw new Error(table + " HTTP " + response.status);
    const rows = await response.json();
    result.push(...rows.map((row) => row.slug).filter((slug) => typeof slug === "string" && /^[A-Za-z0-9-]+$/.test(slug)));
    if (rows.length < 1000) break;
  }
  return result;
}

async function fetchProductRecords() {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) throw new Error("Supabase credentials are required for product metadata generation.");
  const records = [];
  for (let offset = 0; ; offset += 1000) {
    const url = new URL(base.replace(/\/$/, "") + "/rest/v1/products");
    url.searchParams.set("select", "slug,name,model_number,short_description,full_description");
    url.searchParams.set("active", "eq.true");
    url.searchParams.set("limit", "1000");
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, {
      headers: { apikey: key, Authorization: "Bearer " + key, Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Product metadata HTTP " + response.status);
    const rows = await response.json();
    records.push(...rows.filter((row) => typeof row.slug === "string" && /^[A-Za-z0-9-]+$/.test(row.slug)));
    if (rows.length < 1000) break;
  }
  return records;
}
const humanize = (slug) => slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const brands = new Set();
const services = await collectOneFile("src/lib/data/services.ts");
const products = new Set();
for (const [table, target] of [["brands", brands], ["products", products]]) {
  try {
    for (const slug of await fetchSlugs(table)) target.add(slug);
    console.log("Loaded active " + table + " slugs.");
  } catch (error) {
    throw new Error("Could not fetch complete " + table + " slugs; refusing to publish an incomplete sitemap: " + error.message);
  }
}
for (const slug of brands) pages.set("/brands/" + slug, [humanize(slug) + " Products — Al Safwa Trading Oman", humanize(slug) + " products supplied by Al Safwa Trading in Oman. Request pricing and availability."]);
for (const slug of services) pages.set("/services/" + slug, [humanize(slug) + " — Al Safwa Trading Oman", humanize(slug) + " and industrial equipment services arranged by Al Safwa Trading in Oman."]);
const productRecords = await fetchProductRecords();
for (const record of productRecords) {
  products.add(record.slug);
  const name = String(record.name || humanize(record.slug));
  const description = String(record.full_description || record.short_description || name + " supplied by Al Safwa Trading in Oman. Request product pricing and availability.").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
  const route = "/products/" + record.slug;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    model: record.model_number || undefined,
  };
  pages.set(route, [name + " — Al Safwa Trading Oman", description, structuredData]);
}
for (const slug of products) {
  if (!pages.has("/products/" + slug)) pages.set("/products/" + slug, [humanize(slug) + " — Al Safwa Trading Oman", humanize(slug) + " supplied by Al Safwa Trading in Oman. Request product pricing and availability."]);
}

const arabicStaticPages = new Map([
  ["/ar/products", ["كتالوج المنتجات الصناعية | الصفوة للتجارة", "تصفح الأدوات والمعدات الصناعية. تواصل معنا لمعرفة الأسعار وطلب عرض سعر."]],
  ["/ar/brands", ["العلامات التجارية | الصفوة للتجارة", "العلامات التجارية المدرجة في كتالوج الصفوة للتجارة في سلطنة عُمان."]],
  ["/ar/rental", ["تأجير المعدات والآليات | الصفوة للتجارة", "خيارات تأجير المعدات للمشاريع والمواقع والورش. تواصل معنا لمعرفة الأسعار." ]],
  ["/ar/services", ["خدمات المعدات | الصفوة للتجارة", "خدمات إصلاح المعدات والصيانة وقطع الغيار والدعم الميداني في سلطنة عُمان."]],
  ["/ar/repair", ["طلب إصلاح أو صيانة | الصفوة للتجارة", "أرسل تفاصيل المعدة والعطل لطلب خدمات الإصلاح والصيانة."]],
  ["/ar/request-quote", ["طلب عرض سعر | الصفوة للتجارة", "اطلب عرض سعر للأدوات والمعدات الصناعية وقطع الغيار وخيارات التأجير."]],
  ["/ar/contact", ["تواصل معنا | الصفوة للتجارة", "تواصل مع الصفوة للتجارة في كرشة، نزوى، سلطنة عُمان."]],
]);
for (const [route, details] of arabicStaticPages) pages.set(route, details);

const serviceArabicTitles = {
  "equipment-repair": "إصلاح المعدات",
  "power-tool-repair": "إصلاح الأدوات الكهربائية",
  "preventive-maintenance": "الصيانة الوقائية",
  "machinery-maintenance": "صيانة الآلات",
  "field-service": "الخدمة الميدانية",
  "spare-parts": "توريد قطع الغيار",
};
for (const [route, details] of Array.from(pages.entries())) {
  if (route === "/ar" || route.startsWith("/ar/")) continue;
  const arRoute = route === "/" ? "/ar" : "/ar" + route;
  if (pages.has(arRoute)) continue;
  let title = details[0];
  let description = "الصفوة للتجارة في سلطنة عُمان. تواصل معنا لمعرفة الأسعار وطلب عرض سعر.";
  if (route.startsWith("/products/")) {
    const productName = title.split(" — Al Safwa")[0];
    title = productName + " | تفاصيل المنتج - الصفوة للتجارة";
    description = "اطلب معلومات السعر والمواصفات الفنية لهذا المنتج من الصفوة للتجارة في عُمان.";
  } else if (route.startsWith("/brands/")) {
    const brandName = title.split(" Products")[0];
    title = "منتجات " + brandName + " | الصفوة للتجارة";
    description = "تصفح المنتجات المدرجة لهذه العلامة التجارية وتواصل معنا لمعرفة الأسعار.";
  } else if (route.startsWith("/services/")) {
    const serviceSlug = route.split("/").pop();
    title = (serviceArabicTitles[serviceSlug] || "خدمات المعدات") + " | الصفوة للتجارة";
    description = "تواصل مع الصفوة للتجارة لتأكيد نطاق الخدمة والتكلفة.";
  }
  pages.set(arRoute, [title, description, details[2]]);
}

const rootHtml = await readFile(path.join(dist, "index.html"), "utf8");
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function replaceMeta(html, key, value, attribute = "name") {
  const expression = new RegExp('(<meta[^>]*' + attribute + '="' + key + '"[^>]*content=")[^"]*(")', "i");
  return html.replace(expression, "$1" + escapeHtml(value) + "$2");
}
for (const [route, details] of pages) {
  const title = details[0];
  const description = details[1];
  const structuredData = details[2];
  const output = path.join(dist, route.slice(1), "index.html");
  await mkdir(path.dirname(output), { recursive: true });
  const canonical = site + route + "/";
  const isArabicRoute = route === "/ar" || route.startsWith("/ar/");
  const englishRoute = isArabicRoute ? (route.replace(/^\/ar(?=\/|$)/, "") || "/") : route;
  const arabicRoute = isArabicRoute ? route : (route === "/" ? "/ar" : "/ar" + route);
  const alternateLinks = [
    '<link rel="alternate" hreflang="en-OM" href="' + site + (englishRoute === "/" ? "/" : englishRoute + "/") + '" />',
    '<link rel="alternate" hreflang="ar-OM" href="' + site + (arabicRoute === "/" ? "/" : arabicRoute + "/") + '" />',
    '<link rel="alternate" hreflang="x-default" href="' + site + (englishRoute === "/" ? "/" : englishRoute + "/") + '" />',
  ].join("\n    ");
  let html = rootHtml.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>/g, "");
  if (isArabicRoute) {
    html = html.replace('<html lang="en-OM">', '<html lang="ar-OM" dir="rtl">');
    html = replaceMeta(html, "og:locale", "ar_OM", "property");
  }

  html = html.replace(/<title>[\s\S]*?<\/title>/i, "<title>" + escapeHtml(title) + "</title>");
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/i, '<link rel="canonical" href="' + canonical + '" />');
  html = replaceMeta(html, "description", description);
  html = replaceMeta(html, "og:title", title, "property");
  html = replaceMeta(html, "og:description", description, "property");
  html = replaceMeta(html, "og:url", canonical, "property");
  html = replaceMeta(html, "twitter:title", title);
  html = replaceMeta(html, "twitter:description", description);
  if (structuredData) {
    const safeJson = JSON.stringify(structuredData).replaceAll("</", "<\\/");
    html = html.replace("</head>", '<script id="route-jsonld" type="application/ld+json">' + safeJson + "</script></head>");
  }
  html = html.replace("</head>", alternateLinks + "</head>");
  await writeFile(output, html, "utf8");
}
const sitemapRoutes = ["/", ...Array.from(pages.keys())];
const urls = sitemapRoutes.map((route) => site + (route === "/" ? "/" : route + "/"));
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  sitemapRoutes.map((route) => {
    const isArabicRoute = route === "/ar" || route.startsWith("/ar/");
    const englishRoute = isArabicRoute ? (route.replace(/^\/ar(?=\/|$)/, "") || "/") : route;
    const arabicRoute = isArabicRoute ? route : (route === "/" ? "/ar" : "/ar" + route);
    const englishUrl = site + (englishRoute === "/" ? "/" : englishRoute + "/");
    const arabicUrl = site + (arabicRoute === "/" ? "/" : arabicRoute + "/");
    const url = site + (route === "/" ? "/" : route + "/");
    return '  <url><loc>' + url + '</loc><xhtml:link rel="alternate" hreflang="en-OM" href="' + englishUrl + '" /><xhtml:link rel="alternate" hreflang="ar-OM" href="' + arabicUrl + '" /><xhtml:link rel="alternate" hreflang="x-default" href="' + englishUrl + '" /></url>';
  }).join("\n") + "\n</urlset>\n";
if (urls.length > 50000) throw new Error("Sitemap exceeds the 50,000 URL limit.");
await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
console.log("Generated " + pages.size + " route pages and " + urls.length + " sitemap URLs.");

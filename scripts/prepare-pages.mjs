import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const site = "https://alsafwaoman.com";
const pages = new Map([
  ["/products", ["Power Tools & Industrial Equipment Catalogue in Nizwa, Oman — Al Safwa Trading", "Browse industrial power tools, safety equipment, motors, pumps and spare parts in Nizwa, Oman. Al Safwa Trading supplies contractors across the Sultanate."]],
  ["/brands", ["Industrial & Power Tool Brands in Oman — Al Safwa Trading", "Explore power tool and industrial equipment brands listed by Al Safwa Trading in Nizwa, Oman. Contact the shop to confirm model availability and request a quotation."]],
  ["/rental", ["Equipment Rental in Nizwa & Oman — Al Safwa Trading", "Ask about power tool, generator and site equipment rental from Al Safwa Trading in Nizwa, Oman, for projects across the Sultanate."]],
  ["/services", ["Industrial Equipment Repair & Maintenance in Nizwa — Al Safwa Trading", "Arrange equipment repair, power tool repair, preventive maintenance, field service and spare parts support in Nizwa, Oman."]],
  ["/repair", ["Power Tool & Equipment Repair in Nizwa, Oman — Al Safwa Trading", "Request equipment diagnosis and repair from Al Safwa Trading in Nizwa, Oman. Send the model and fault details for a service quotation."]],
  ["/request-quote", ["Request an Industrial Equipment Quote in Oman — Al Safwa Trading", "Request pricing for industrial tools, machinery, rental and spare parts from Al Safwa Trading in Nizwa, Oman. Prices are confirmed per enquiry."]],
  ["/contact", ["Contact Al Safwa Trading — Nizwa, Sinaya, Oman", "Contact Al Safwa Trading in Nizwa, Al Dakhiliyah, Oman by phone or WhatsApp, or open the verified Google Maps shop location for product, rental and repair enquiries."]],
  ["/ar", ["الصفوة للتجارة | الأدوات والمعدات والآلات الصناعية في عُمان", "الصفوة للتجارة في الصناعية، نزوى، سلطنة عُمان: توريد الأدوات والمعدات الصناعية ومستلزمات السلامة والمحركات والمضخات، مع خيارات التأجير والإصلاح والصيانة."]],
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
  for (let offset = 0; offset < 10000; offset += 250) {
    const url = new URL(base.replace(/\/$/, "") + "/rest/v1/" + table);
    url.searchParams.set("select", "slug");
    url.searchParams.set("active", "eq.true");
    url.searchParams.set("limit", "250");
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, {
      headers: { apikey: key, Authorization: "Bearer " + key, Accept: "application/json" },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(table + " HTTP " + response.status);
    const rows = await response.json();
    result.push(...rows.map((row) => row.slug).filter((slug) => typeof slug === "string" && /^[A-Za-z0-9-]+$/.test(slug)));
    if (rows.length < 250) break;
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
for (const slug of brands) {
  if (slug.toLowerCase() === "makita") {
    pages.set("/brands/" + slug, [
      "Makita Power Tools in Nizwa, Oman | Al Safwa Trading",
      "Browse listed Makita power tools and models from Al Safwa Trading in Nizwa, Oman. Send the model number and quantity for a quotation; pricing and availability are confirmed per enquiry.",
    ]);
  } else {
    pages.set("/brands/" + slug, [humanize(slug) + " Products — Al Safwa Trading, Nizwa Oman", humanize(slug) + " products supplied by Al Safwa Trading in Nizwa, Oman. Contact us for a quotation and current availability."]);
  }
}
for (const slug of services) pages.set("/services/" + slug, [humanize(slug) + " — Al Safwa Trading Oman", humanize(slug) + " and industrial equipment services arranged by Al Safwa Trading in Oman."]);
const productRecords = await fetchProductRecords();
const incompleteDescriptions = productRecords.filter((record) => !String(record.short_description || '').trim() || !String(record.full_description || '').trim());
if (incompleteDescriptions.length) {
  throw new Error('Refusing to publish product pages with missing catalogue descriptions: ' + incompleteDescriptions.map((record) => record.slug).join(', '));
}
for (const record of productRecords) {
  products.add(record.slug);
  const name = String(record.name || humanize(record.slug));
  const model = String(record.model_number || "").trim();
  const productTitle = model ? name + " (" + model + ")" : name;
  const productSummary = String(record.short_description || record.full_description || name)
    .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 185).replace(/[\s.,;:!?-]+$/, "");
  const description = (productSummary + ". Listed by Al Safwa Trading in Nizwa, Oman. Contact us for a quotation; price and availability are confirmed per enquiry.").slice(0, 300);
  const route = "/products/" + record.slug;
  // Do not emit Product rich-result markup until this catalogue has a real,
  // publicly verifiable price or genuine review data. Quote-only products must
  // not be given fabricated Offer prices or review signals.
  pages.set(route, [productTitle + " — Al Safwa Trading, Nizwa Oman", description]);
}
for (const slug of products) {
  if (!pages.has("/products/" + slug)) pages.set("/products/" + slug, [humanize(slug) + " — Al Safwa Trading, Nizwa Oman", humanize(slug) + " listed by Al Safwa Trading in Nizwa, Oman. Contact us for a quotation."]);
}

const arabicStaticPages = new Map([
  ["/ar/products", ["كتالوج الأدوات والمعدات الصناعية في نزوى | الصفوة للتجارة", "تصفح الأدوات الكهربائية ومعدات السلامة والمحركات والمضخات وقطع الغيار في نزوى، سلطنة عُمان. تواصل معنا لطلب عرض سعر."]],
  ["/ar/brands", ["العلامات التجارية للأدوات الصناعية في عُمان | الصفوة للتجارة", "تصفح العلامات التجارية للأدوات والمعدات الصناعية المدرجة لدى الصفوة للتجارة في نزوى، سلطنة عُمان."]],
  ["/ar/rental", ["تأجير المعدات في نزوى وعُمان | الصفوة للتجارة", "استفسر عن تأجير الأدوات والمولدات ومعدات المواقع من الصفوة للتجارة في نزوى، سلطنة عُمان، لمشاريعك في مختلف المحافظات."]],
  ["/ar/services", ["إصلاح المعدات والصيانة في نزوى | الصفوة للتجارة", "خدمات إصلاح المعدات والأدوات الكهربائية والصيانة الوقائية وقطع الغيار والدعم الميداني في نزوى، سلطنة عُمان."]],
  ["/ar/repair", ["إصلاح الأدوات والمعدات في نزوى | الصفوة للتجارة", "أرسل طراز المعدة وتفاصيل العطل لطلب التشخيص والإصلاح من الصفوة للتجارة في نزوى، سلطنة عُمان."]],
  ["/ar/request-quote", ["طلب عرض سعر للمعدات الصناعية في عُمان | الصفوة للتجارة", "اطلب تسعير الأدوات والمعدات الصناعية وقطع الغيار والتأجير من الصفوة للتجارة في نزوى، سلطنة عُمان."]],
  ["/ar/contact", ["تواصل مع الصفوة للتجارة في نزوى، عُمان", "تواصل مع الصفوة للتجارة في نزوى، محافظة الداخلية، سلطنة عُمان عبر الهاتف أو واتساب أو موقع المتجر على خرائط Google."]],
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
    const productSlug = route.slice("/products/".length);
    const productRecord = productRecords.find((record) => record.slug === productSlug);
    const productName = String(productRecord?.name || title.split(" — Al Safwa")[0]).trim();
    const model = String(productRecord?.model_number || "").trim();
    const productLabel = productName + (model ? "، موديل " + model : "");
    title = productLabel + " | مواصفات المنتج - الصفوة للتجارة";
    description = "تعرف على تفاصيل " + productLabel + " واطلب المواصفات الفنية والسعر والتوافر من الصفوة للتجارة في نزوى، سلطنة عُمان.";
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

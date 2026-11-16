import { ChangeEvent, useState } from "react";
import { supabase } from "../lib/supabase";
import { parseExcelCatalogue, type ExcelCatalogueRow } from "../lib/xlsxCatalogue";

type Ref = { id: string; name: string; slug: string; parent_id?: string | null };
type PreparedRow = { source: ExcelCatalogueRow; product: Record<string, unknown>; slug: string };
type PreviewRow = ExcelCatalogueRow & { previewUrl?: string };

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const truthy = (value: string, fallback: boolean) => value === "" ? fallback : ["true", "1", "yes", "y"].includes(value.trim().toLowerCase());
const normalize = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const aliases: Record<string, string[]> = {
  name: ["product_name", "item_name", "equipment_name", "name_of_product"],
  brand: ["brand_name", "manufacturer", "make"],
  category: ["category_name", "product_category", "main_category"],
  subcategory: ["sub_category", "subcategory_name", "sub_category_name"],
  sku: ["item_code", "product_code", "part_number", "article_number", "code"],
  model_number: ["model", "model_no", "model_number"],
  short_description: ["short_desc", "summary", "brief_description"],
  full_description: ["full_desc", "description", "product_description", "details"],
  price: ["unit_price", "selling_price", "list_price"],
  stock_quantity: ["stock", "quantity", "qty"],
  availability_status: ["availability", "status"],
  source_url: ["product_url", "website_url", "source_link"],
  source_company: ["supplier", "vendor", "source"],
  specifications: ["specs", "technical_specifications", "attributes"],
};
function readValue(values: Record<string, string>, key: string) {
  const normalized = Object.fromEntries(Object.entries(values).map(([k, v]) => [normalize(k), v]));
  for (const candidate of [key, ...(aliases[key] || [])]) {
    const value = normalized[normalize(candidate)];
    if (value !== undefined && value !== "") return value;
  }
  return "";
}
function parseSpecs(value: string) {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch { /* Plain text specifications are retained as a single field. */ }
  return { Details: value };
}
const knownHeaders = new Set(
  ["name", "brand", "category", "subcategory", "slug", "sku", "model_number", "short_description", "full_description", "price", "currency", "price_type", "stock_quantity", "minimum_stock_level", "availability_status", "featured", "active", "verified", "source_url", "source_company", "specifications"]
    .flatMap((key) => [key, ...(aliases[key] || [])])
    .map(normalize)
);
function extractSpecifications(values: Record<string, string>) {
  const specs = parseSpecs(readValue(values, "specifications"));
  for (const [header, value] of Object.entries(values)) {
    if (value.trim() && !knownHeaders.has(normalize(header))) specs[header.trim()] = value.trim();
  }
  return specs;
}

export default function AdminExcelImport() {
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [prepared, setPrepared] = useState<PreparedRow[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  function clear() {
    rows.forEach((row) => { if (row.previewUrl) URL.revokeObjectURL(row.previewUrl); });
    setRows([]); setPrepared([]); setIssues([]); setFileName(""); setMessage(""); setError(""); setProgress("");
  }

  async function inspect(file: File) {
    setBusy(true); setError(""); setMessage(""); setProgress(""); setIssues([]); setPrepared([]);
    try {
      const parsed = await parseExcelCatalogue(file);
      const withPreviews = parsed.map((row) => ({ ...row, previewUrl: row.image ? URL.createObjectURL(row.image) : undefined }));
      setRows(withPreviews);
      setFileName(file.name);

      const [{ data: brands, error: brandError }, { data: categories, error: categoryError }, { data: existing, error: existingError }] = await Promise.all([
        supabase.from("brands").select("id,name,slug"),
        supabase.from("categories").select("id,name,slug,parent_id"),
        supabase.from("products").select("id,slug,sku,name,brand_id,category_id,subcategory_id,model_number,short_description,full_description,specifications,price,currency,price_type,stock_quantity,minimum_stock_level,availability_status,featured,active,verified,source_url,source_company"),
      ]);
      if (brandError) throw brandError;
      if (categoryError) throw categoryError;
      if (existingError) throw existingError;

      const brandMap = new Map<string, Ref>();
      (brands || []).forEach((b: Ref) => { brandMap.set(b.name.toLowerCase(), b); brandMap.set(b.slug.toLowerCase(), b); });
      const categoryMap = new Map<string, Ref>();
      (categories || []).forEach((c: Ref) => { categoryMap.set(c.name.toLowerCase(), c); categoryMap.set(c.slug.toLowerCase(), c); });
      const existingSku = new Map<string, string>();
      const existingBySlug = new Map<string, Record<string, any>>();
      (existing || []).forEach((p: Record<string, any>) => {
        existingBySlug.set(p.slug, p);
        if (p.sku) existingSku.set(String(p.sku).toLowerCase(), p.slug);
      });

      const next: PreparedRow[] = [];
      const problems: string[] = [];
      const seenSlugs = new Set<string>();
      const seenSkus = new Set<string>();
      withPreviews.forEach((source) => {
        const v = source.values;
        const name = readValue(v, "name");
        const brandName = readValue(v, "brand");
        const categoryName = readValue(v, "category");
        const sku = readValue(v, "sku");
        const line = `${source.sheet} row ${source.excelRow}`;
        if (!name || !brandName || !categoryName) {
          problems.push(`${line}: required fields missing (product name, brand or category).`);
          return;
        }
        const brand = brandMap.get(brandName.toLowerCase()) || brandMap.get(slugify(brandName));
        const category = categoryMap.get(categoryName.toLowerCase()) || categoryMap.get(slugify(categoryName));
        if (!brand) problems.push(`${line}: brand not found in Admin > Brands: ${brandName}.`);
        if (!category) problems.push(`${line}: category not found in Admin > Categories: ${categoryName}.`);
        const slugValue = readValue(v, "slug") || slugify(name);
        const slug = slugValue || (sku ? slugify(`${name}-${sku}`) : "");
        if (seenSlugs.has(slug)) problems.push(`${line}: duplicate product slug in workbook: ${slug}.`);
        if (sku && seenSkus.has(sku.toLowerCase())) problems.push(`${line}: duplicate SKU in workbook: ${sku}.`);
        const conflictingSlug = sku ? existingSku.get(sku.toLowerCase()) : undefined;
        if (conflictingSlug && conflictingSlug !== slug) problems.push(`${line}: SKU ${sku} already belongs to product slug ${conflictingSlug}.`);
        const priceText = readValue(v, "price");
        const price = priceText ? Number(priceText.replace(/,/g, "")) : null;
        if (priceText && !Number.isFinite(price)) problems.push(`${line}: invalid price ${priceText}.`);
        const stockText = readValue(v, "stock_quantity");
        const stock = stockText ? Number(stockText.replace(/,/g, "")) : 0;
        if (stockText && (!Number.isInteger(stock) || stock < 0)) problems.push(`${line}: stock quantity must be a non-negative integer.`);
        const minText = readValue(v, "minimum_stock_level");
        const minStock = minText ? Number(minText) : 0;
        if (minText && (!Number.isInteger(minStock) || minStock < 0)) problems.push(`${line}: minimum stock must be a non-negative integer.`);
        let specs: Record<string, unknown> = {};
        try { specs = parseSpecs(readValue(v, "specifications")); } catch { problems.push(`${line}: invalid specifications.`); }
        const existingProduct = existingBySlug.get(slug);
        if (source.image && (source.image.size > 5 * 1024 * 1024 || !["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"].includes(source.image.type))) {
          problems.push(`${line}: embedded image exceeds the 5 MB limit or uses an unsupported format (JPG, PNG, WEBP or GIF only).`);
        }
        if (brand && category && !seenSlugs.has(slug)) {
          const subcategoryName = readValue(v, "subcategory");
          const subcategory = subcategoryName ? categoryMap.get(subcategoryName.toLowerCase()) || categoryMap.get(slugify(subcategoryName)) : undefined;
          next.push({
            source,
            slug,
            product: {
              name: name.trim(), slug, brand_id: brand.id, category_id: category.id,
              subcategory_id: subcategory ? (subcategory.parent_id === category.id ? subcategory.id : existingProduct?.subcategory_id ?? null) : existingProduct?.subcategory_id ?? null,
              sku: sku.trim() || existingProduct?.sku || null,
              model_number: readValue(v, "model_number") || existingProduct?.model_number || null,
              short_description: readValue(v, "short_description") || existingProduct?.short_description || null,
              full_description: readValue(v, "full_description") || existingProduct?.full_description || null,
              specifications: Object.keys(specs).length ? specs : existingProduct?.specifications || {},
              price: priceText ? price : existingProduct?.price ?? null,
              currency: readValue(v, "currency") || existingProduct?.currency || "OMR",
              price_type: readValue(v, "price_type") || existingProduct?.price_type || "request_quote",
              stock_quantity: stockText ? stock : existingProduct?.stock_quantity ?? 0,
              minimum_stock_level: minText ? minStock : existingProduct?.minimum_stock_level ?? 0,
              availability_status: readValue(v, "availability_status") || existingProduct?.availability_status || "contact_for_availability",
              featured: readValue(v, "featured") ? truthy(readValue(v, "featured"), false) : existingProduct?.featured ?? false,
              active: readValue(v, "active") ? truthy(readValue(v, "active"), true) : existingProduct?.active ?? true,
              verified: readValue(v, "verified") ? truthy(readValue(v, "verified"), false) : existingProduct?.verified ?? false,
              source_url: readValue(v, "source_url") || existingProduct?.source_url || null,
              source_company: readValue(v, "source_company") || existingProduct?.source_company || null,
            },
          });
        }
        seenSlugs.add(slug);
        if (sku) seenSkus.add(sku.toLowerCase());
      });
      const extraImages = withPreviews.filter((r) => r.imageCount > 1).map((r) => `${r.sheet} row ${r.excelRow}: ${r.imageCount} embedded images; first image will be assigned and extras need manual review.`);
      const allIssues = [...problems, ...extraImages];
      setPrepared(next); setIssues(allIssues);
      if (allIssues.length) {
        setError("The workbook was read, but publishing is paused because some rows need correction. Fix the listed issues and upload the corrected workbook.");
      } else {
        await publishCatalogue(next);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not inspect this Excel workbook.");
    } finally { setBusy(false); }
  }

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void inspect(file);
  }

  async function publishCatalogue(rowsToImport: PreparedRow[]) {
    if (!rowsToImport.length) return;
    setBusy(true); setError(""); setMessage(""); setProgress("Validation passed. Publishing products to the live catalogue…");
    let productCount = 0, imageCount = 0;
    const imageErrors: string[] = [];
    try {
      const products = rowsToImport.map((r) => r.product);
      for (let offset = 0; offset < products.length; offset += 100) {
        const batch = products.slice(offset, offset + 100);
        const { error: upsertError } = await supabase.from("products").upsert(batch, { onConflict: "slug" });
        if (upsertError) throw upsertError;
        productCount += batch.length;
        setProgress(`Saved ${productCount} of ${products.length} products…`);
      }

      const slugs = rowsToImport.map((r) => r.slug);
      const { data: saved, error: lookupError } = await supabase.from("products").select("id,slug").in("slug", slugs);
      if (lookupError) throw lookupError;
      const idBySlug = new Map<string, string>((saved || []).map((p: { id: string; slug: string }) => [p.slug, p.id] as [string, string]));

      const imageRows = rowsToImport.filter((r) => r.source.image);
      for (let index = 0; index < imageRows.length; index++) {
        const item = imageRows[index];
        const productId = idBySlug.get(item.slug);
        if (!productId || !item.source.image) {
          imageErrors.push(`${item.source.sheet} row ${item.source.excelRow}: saved product ID or image is missing.`);
          continue;
        }
        const ext = item.source.image.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeName = item.source.image.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);
        const path = `products/${productId}/excel-row-${item.source.excelRow}-${safeName}`;
        const upload = await supabase.storage.from("product-images").upload(path, item.source.image, {
          upsert: true, cacheControl: "31536000", contentType: item.source.image.type || "image/jpeg",
        });
        if (upload.error) {
          imageErrors.push(`${item.source.sheet} row ${item.source.excelRow}: ${upload.error.message}`);
          continue;
        }
        const { error: clearError } = await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
        if (clearError) {
          imageErrors.push(`${item.source.sheet} row ${item.source.excelRow}: could not change primary image: ${clearError.message}`);
          continue;
        }
        const { error: imageInsertError } = await supabase.from("product_images").insert({
          product_id: productId, storage_path: path, alt_text: readValue(item.source.values, "name"),
          sort_order: 0, is_primary: true,
        });
        if (imageInsertError) imageErrors.push(`${item.source.sheet} row ${item.source.excelRow}: ${imageInsertError.message}`);
        else imageCount++;
        setProgress(`Saved products. Uploaded ${index + 1} of ${imageRows.length} embedded images…`);
      }
      setMessage(`Published to the website: ${productCount} product records processed and ${imageCount} embedded images linked. Existing matching product slugs were updated. ${imageErrors.length ? `${imageErrors.length} image issue(s) need attention; see the issue list.` : "The catalogue is now saved in the database."}`);
      if (imageErrors.length) setIssues(imageErrors);
      setProgress("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Catalogue import failed.");
    } finally { setBusy(false); }
  }

  const withImages = rows.filter((r) => !!r.image).length;

  return <section className="mx-auto mt-8 max-w-7xl border border-black/10 bg-white p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-safety">Excel catalogue ingestion</p><h2 className="mt-1 font-display text-3xl font-semibold uppercase">Excel + Embedded Images</h2>
        <p className="mt-1 max-w-3xl text-sm text-smoke">Reads product rows and embedded worksheet images. Images are mapped by their Excel row anchor, previewed, then uploaded to Supabase Storage and linked to the matching product.</p>
      </div>
      <button type="button" onClick={clear} className="border border-black/20 px-4 py-2 text-sm">Reset importer</button>
    </div>
    {message && <div className="mt-4 border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
    {error && <div className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {progress && <p className="mt-3 text-sm text-smoke">{progress}</p>}
    <div className="mt-5 border border-dashed border-black/20 p-5">
      <label className="block text-sm font-medium">Select original Excel workbook (.xlsx)<input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={onFile} className="mt-2 block w-full text-sm"/></label>
      <p className="mt-2 text-xs text-smoke">{fileName || "Keep original rows, column headings and embedded images unchanged."}</p>
      <p className="mt-2 text-sm">{rows.length} product rows detected · {withImages} rows with embedded images · {prepared.length} rows mapped to existing brands/categories</p>
      <p className="mt-4 border border-black/10 bg-paper-2 p-3 text-sm">{busy ? "Publishing…" : message ? "Publishing completed. Products and linked images have been saved to the live catalogue." : issues.length ? "Publishing is paused until the listed validation issues are corrected." : rows.length ? "Workbook validated. Products and embedded images will publish automatically when validation passes." : "Choose the workbook to validate and publish its products to the website."}</p>
    </div>
    {issues.length > 0 && <div className="mt-4 max-h-56 overflow-auto border border-red-100 bg-red-50 p-4 text-xs text-red-700">{issues.slice(0, 200).map((issue, i) => <p key={i}>{issue}</p>)}{issues.length > 200 && <p>Showing first 200 issues.</p>}</div>}
    <div className="mt-5 max-h-[520px] overflow-auto border border-black/10">
      <table className="w-full min-w-[900px] text-left text-xs">
        <thead className="sticky top-0 bg-paper-2 font-mono uppercase"><tr><th className="p-2">Sheet / Row</th><th className="p-2">Image</th><th className="p-2">Product</th><th className="p-2">Brand</th><th className="p-2">Category</th><th className="p-2">SKU</th><th className="p-2">Model</th></tr></thead>
        <tbody>{rows.slice(0, 150).map((row, i) => <tr key={i} className="border-t border-black/10"><td className="p-2">{row.sheet} / {row.excelRow}</td><td className="p-2">{row.previewUrl ? <img src={row.previewUrl} alt="" className="h-14 w-16 object-contain"/> : <span className="text-smoke">No embedded image</span>}</td><td className="p-2">{readValue(row.values, "name") || "—"}</td><td className="p-2">{readValue(row.values, "brand") || "—"}</td><td className="p-2">{readValue(row.values, "category") || "—"}</td><td className="p-2">{readValue(row.values, "sku") || "—"}</td><td className="p-2">{readValue(row.values, "model_number") || "—"}</td></tr>)}</tbody>
      </table>
      {rows.length > 150 && <p className="p-3 text-xs text-smoke">Showing first 150 rows; all {rows.length} rows are included in validation.</p>}
    </div>
  </section>;
}

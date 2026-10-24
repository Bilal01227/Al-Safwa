import { ChangeEvent, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Row = Record<string, string>;
type Ref = { id: string; name: string; slug: string; parent_id?: string | null };
type Prepared = Record<string, unknown>;

const headers = [
  "name", "slug", "brand", "category", "subcategory", "sku", "model_number",
  "short_description", "full_description", "price", "currency", "price_type",
  "stock_quantity", "minimum_stock_level", "availability_status", "featured", "active",
  "verified", "source_url", "source_company", "specifications"
];

const required = ["name", "brand", "category"];
const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const bool = (v: string, fallback: boolean) => v === "" ? fallback : ["true", "1", "yes", "y"].includes(v.trim().toLowerCase());
const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function parseCSV(text: string): Row[] {
  const input = text.replace(/^\uFEFF/, "");
  const records: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i], next = input[i + 1];
    if (ch === '"') {
      if (quoted && next === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell.trim()); cell = "";
      if (row.some(Boolean)) records.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell.trim()); if (row.some(Boolean)) records.push(row); }
  if (!records.length) return [];
  const h = records[0].map(x => x.toLowerCase().replace(/\s+/g, "_").trim());
  return records.slice(1).map(values => Object.fromEntries(h.map((key, i) => [key, values[i] || ""])));
}

function download(name: string, text: string) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminBulkImport() {
  const [rows, setRows] = useState<Row[]>([]);
  const [prepared, setPrepared] = useState<Prepared[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [fileName, setFileName] = useState("");

  const valid = errors.length === 0 && prepared.length === rows.length && rows.length > 0;
  const statusText = useMemo(() => {
    if (!rows.length) return "No file loaded";
    if (errors.length) return `${errors.length} validation issue${errors.length === 1 ? "" : "s"}`;
    return `${prepared.length} rows ready to import`;
  }, [rows.length, errors.length, prepared.length]);

  function reset() {
    setRows([]); setPrepared([]); setErrors([]); setFileName(""); setConfirmed(false); setMsg(""); setErr("");
  }

  async function validate(inputRows: Row[]) {
    setBusy(true); setErr(""); setMsg(""); setConfirmed(false); setPrepared([]); setErrors([]);
    try {
      const [{ data: brands, error: be }, { data: categories, error: ce }] = await Promise.all([
        supabase.from("brands").select("id,name,slug"),
        supabase.from("categories").select("id,name,slug,parent_id")
      ]);
      if (be) throw be; if (ce) throw ce;
      const brandMap = new Map<string, Ref>((brands || []).flatMap(b => [[b.slug.toLowerCase(), b], [b.name.toLowerCase(), b]]));
      const categoryMap = new Map<string, Ref>((categories || []).flatMap(c => [[c.slug.toLowerCase(), c], [c.name.toLowerCase(), c]]));
      const next: Prepared[] = [], issues: string[] = [];
      const seenSlugs = new Set<string>();
      const seenSkus = new Set<string>();

      inputRows.forEach((r, index) => {
        const line = index + 2;
        const missing = required.filter(k => !r[k]?.trim());
        if (missing.length) { issues.push(`Row ${line}: missing ${missing.join(", ")}`); return; }
        const slug = (r.slug || slugify(r.name)).trim();
        const brand = brandMap.get(r.brand.trim().toLowerCase()) || brandMap.get(slugify(r.brand));
        const category = categoryMap.get(r.category.trim().toLowerCase()) || categoryMap.get(slugify(r.category));
        if (!brand) issues.push(`Row ${line}: brand not found: ${r.brand}`);
        if (!category) issues.push(`Row ${line}: category not found: ${r.category}`);
        if (seenSlugs.has(slug)) issues.push(`Row ${line}: duplicate slug in CSV: ${slug}`);
        if (r.sku && seenSkus.has(r.sku.trim().toLowerCase())) issues.push(`Row ${line}: duplicate SKU in CSV: ${r.sku}`);
        if (r.price && !Number.isFinite(Number(r.price))) issues.push(`Row ${line}: price must be numeric`);
        if (r.stock_quantity && (!Number.isInteger(Number(r.stock_quantity)) || Number(r.stock_quantity) < 0)) issues.push(`Row ${line}: stock_quantity must be a non-negative integer`);
        if (r.minimum_stock_level && (!Number.isInteger(Number(r.minimum_stock_level)) || Number(r.minimum_stock_level) < 0)) issues.push(`Row ${line}: minimum_stock_level must be a non-negative integer`);
        let specifications: Record<string, unknown> = {};
        if (r.specifications) { try { const parsed = JSON.parse(r.specifications); if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(); specifications = parsed; } catch { issues.push(`Row ${line}: specifications must be a JSON object`); } }
        if (brand && category && !seenSlugs.has(slug)) {
          next.push({
            name: r.name.trim(), slug, brand_id: brand.id, category_id: category.id,
            subcategory_id: r.subcategory ? (categoryMap.get(r.subcategory.trim().toLowerCase())?.parent_id === category.id ? categoryMap.get(r.subcategory.trim().toLowerCase())?.id : null) : null,
            sku: r.sku?.trim() || null, model_number: r.model_number?.trim() || null,
            short_description: r.short_description?.trim() || null, full_description: r.full_description?.trim() || null,
            specifications, price: r.price === "" ? null : Number(r.price), currency: r.currency?.trim() || "OMR",
            price_type: r.price_type?.trim() || "request_quote", stock_quantity: Number(r.stock_quantity || 0),
            minimum_stock_level: Number(r.minimum_stock_level || 0), availability_status: r.availability_status?.trim() || "contact_for_availability",
            featured: bool(r.featured, false), active: bool(r.active, true), verified: bool(r.verified, false),
            source_url: r.source_url?.trim() || null, source_company: r.source_company?.trim() || null
          });
        }
        seenSlugs.add(slug); if (r.sku) seenSkus.add(r.sku.trim().toLowerCase());
      });
      setPrepared(next); setErrors(issues);
    } catch (e) { setErr(e instanceof Error ? e.message : "Validation failed."); }
    finally { setBusy(false); }
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setFileName(file.name); setMsg(""); setErr("");
    const reader = new FileReader();
    reader.onload = () => { try { const parsed = parseCSV(String(reader.result || "")); if (!parsed.length) { setErr("No CSV rows found."); return; } setRows(parsed); void validate(parsed); } catch { setErr("Could not parse this CSV file."); } };
    reader.readAsText(file);
  }

  async function importRows() {
    if (!valid || confirmed) return;
    setConfirmed(true); setBusy(true); setErr(""); setMsg("");
    try {
      const result = await supabase.from("products").upsert(prepared, { onConflict: "slug" });
      if (result.error) throw result.error;
      setMsg(`Imported ${prepared.length} products. Existing matching slugs were updated.`);
    } catch (e) { setConfirmed(false); setErr(e instanceof Error ? e.message : "Import failed."); }
    finally { setBusy(false); }
  }

  return <section className="mx-auto mt-8 max-w-7xl border border-black/10 bg-white p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-safety">Bulk catalogue ingestion</p><h2 className="mt-1 font-display text-3xl font-semibold uppercase">Import Products</h2><p className="mt-1 max-w-3xl text-sm text-smoke">Upload → validate → preview → confirm → import. Nothing is written to the database while the CSV is only being previewed.</p></div>
      <button onClick={() => download("al-safwa-products-template.csv", `${headers.join(",")}\n${headers.map(() => "").join(",")}\n`)} className="border border-black/20 px-4 py-2 text-sm font-medium">Download CSV Template</button>
    </div>
    {msg && <div className="mt-4 border border-green-200 bg-green-50 p-3 text-sm text-green-700">{msg}</div>}
    {err && <div className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
    <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="border border-dashed border-black/20 p-6">
        <input type="file" accept=".csv,text/csv" onChange={onFile} className="block w-full text-sm" />
        <p className="mt-3 text-xs text-smoke">{fileName || "Choose a CSV file"}</p>
        <p className={`mt-3 text-sm ${errors.length ? "text-red-600" : "text-green-700"}`}>{statusText}</p>
        {errors.length > 0 && <div className="mt-4 max-h-48 overflow-auto border border-red-100 bg-red-50 p-3 text-xs text-red-700">{errors.slice(0, 100).map((x, i) => <div key={i}>{x}</div>)}{errors.length > 100 && <div className="mt-2">Showing first 100 issues.</div>}</div>}
        <div className="mt-5 flex gap-3"><button disabled={!valid || busy || confirmed} onClick={importRows} className="flex-1 bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{busy ? "Working…" : confirmed ? "Imported" : `Confirm & Import ${prepared.length || 0}`}</button><button onClick={reset} className="border border-black/20 px-4 py-3 text-sm">Reset</button></div>
      </div>
      <div className="border border-black/10 bg-paper p-5">
        <div className="flex items-center justify-between"><h3 className="font-display text-xl font-semibold uppercase">Preview</h3><span className="font-mono text-xs text-smoke">{rows.length} rows</span></div>
        <div className="mt-4 max-h-96 overflow-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-paper-2 font-mono uppercase"><tr><th className="p-2">#</th><th className="p-2">Name</th><th className="p-2">Brand</th><th className="p-2">Category</th><th className="p-2">SKU</th><th className="p-2">Price</th><th className="p-2">Stock</th></tr></thead><tbody>{rows.slice(0, 100).map((r, i) => <tr key={i} className="border-t border-black/10"><td className="p-2">{i + 2}</td><td className="p-2">{r.name || "—"}</td><td className="p-2">{r.brand || "—"}</td><td className="p-2">{r.category || "—"}</td><td className="p-2">{r.sku || "—"}</td><td className="p-2">{r.price || "—"}</td><td className="p-2">{r.stock_quantity || "0"}</td></tr>)}</tbody></table>{rows.length > 100 && <p className="mt-3 text-xs text-smoke">Showing first 100 rows only.</p>}</div>
      </div>
    </div>
  </section>;
}

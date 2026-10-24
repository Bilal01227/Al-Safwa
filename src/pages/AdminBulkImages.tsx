import { ChangeEvent, useMemo, useState } from "react";
import { unzipSync } from "fflate";
import { supabase } from "../lib/supabase";

type Product = { id: string; name: string; slug: string; sku: string | null };
type Mapping = { file: File; filename: string; sku: string; product: Product | null; reason?: string };

const imageExt = /\.(jpe?g|png|webp|gif|avif)$/i;
const mimeFor = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();
  return ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : ext === "avif" ? "image/avif" : "image/jpeg";
};
const stem = (name: string) => name.replace(/\.[^.]+$/i, "");
const normalizeSku = (value: string) => value.trim().toLowerCase();

function parseCSV(text: string): { sku: string; image: string }[] {
  const input = text.replace(/^\uFEFF/, "");
  const records: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i], next = input[i + 1];
    if (ch === '"') { if (quoted && next === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (ch === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) { if (ch === "\r" && next === "\n") i++; row.push(cell.trim()); cell = ""; if (row.some(Boolean)) records.push(row); row = []; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell.trim()); if (row.some(Boolean)) records.push(row); }
  if (!records.length) return [];
  const headers = records[0].map(x => x.toLowerCase().replace(/\s+/g, "_"));
  const skuIndex = headers.indexOf("sku"), imageIndex = headers.indexOf("image");
  if (skuIndex < 0 || imageIndex < 0) throw new Error("Image CSV must contain exactly these required columns: SKU and Image.");
  return records.slice(1).map(r => ({ sku: r[skuIndex] || "", image: r[imageIndex] || "" }));
}

function downloadTemplate() {
  const blob = new Blob(["SKU,Image\nMAKITA-DHP486,MAKITA-DHP486.jpg\n"], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "al-safwa-image-map-template.csv"; a.click(); URL.revokeObjectURL(url);
}

async function unzipImages(file: File): Promise<File[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const entries = unzipSync(bytes);
  return Object.entries(entries).filter(([name]) => imageExt.test(name) && !name.endsWith("/")).map(([name, data]) => {
    const clean = name.split("/").pop() || name;
    return new File([data], clean, { type: mimeFor(clean), lastModified: Date.now() });
  });
}

export default function AdminBulkImages() {
  const [csvRows, setCsvRows] = useState<{ sku: string; image: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const matched = mappings.filter(x => x.product && !x.reason).length;
  const ready = mappings.length > 0 && issues.length === 0 && matched === mappings.length;
  const unmatchedFiles = useMemo(() => files.filter(file => !mappings.some(m => m.file === file)), [files, mappings]);

  function reset() { setCsvRows([]); setFiles([]); setMappings([]); setIssues([]); setMsg(""); setErr(""); setConfirmed(false); }

  async function buildPreview(rows = csvRows, selectedFiles = files) {
    setBusy(true); setErr(""); setMsg(""); setConfirmed(false); setMappings([]); setIssues([]);
    try {
      if (!rows.length) throw new Error("Upload the image-map CSV first.");
      if (!selectedFiles.length) throw new Error("Upload a ZIP or select the image folder/files first.");
      const { data, error } = await supabase.from("products").select("id,name,slug,sku");
      if (error) throw error;
      const products = (data || []) as Product[];
      const productMap = new Map(products.filter(p => p.sku).map(p => [normalizeSku(p.sku!), p]));
      const fileMap = new Map(selectedFiles.map(f => [f.name.toLowerCase(), f]));
      const next: Mapping[] = [], nextIssues: string[] = [];
      const seenSku = new Set<string>();
      const referenced = new Set<string>();
      rows.forEach((row, i) => {
        const line = i + 2, sku = row.sku.trim(), image = row.image.trim();
        if (!sku || !image) { nextIssues.push(`CSV row ${line}: SKU and Image are required.`); return; }
        if (seenSku.has(normalizeSku(sku))) { nextIssues.push(`CSV row ${line}: duplicate SKU: ${sku}`); return; }
        seenSku.add(normalizeSku(sku));
        const product = productMap.get(normalizeSku(sku));
        const file = fileMap.get(image.toLowerCase());
        if (!product) { nextIssues.push(`CSV row ${line}: no product exists with SKU ${sku}.`); return; }
        if (!file) { nextIssues.push(`CSV row ${line}: image file not found: ${image}.`); return; }
        if (normalizeSku(stem(file.name)) !== normalizeSku(sku)) { nextIssues.push(`CSV row ${line}: filename ${file.name} does not exactly match SKU ${sku}.`); return; }
        referenced.add(file.name.toLowerCase()); next.push({ file, filename: file.name, sku, product });
      });
      selectedFiles.forEach(file => { if (!referenced.has(file.name.toLowerCase())) nextIssues.push(`Unmatched image: ${file.name}`); });
      setMappings(next); setIssues(nextIssues);
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not build image preview."); }
    finally { setBusy(false); }
  }

  function onCSV(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = () => { try { const rows = parseCSV(String(reader.result || "")); setCsvRows(rows); void buildPreview(rows, files); } catch (e) { setErr(e instanceof Error ? e.message : "Invalid image CSV."); } }; reader.readAsText(file);
  }

  async function onFiles(e: ChangeEvent<HTMLInputElement>) {
    try {
      const selected = Array.from(e.target.files || []);
      const expanded: File[] = [];
      for (const file of selected) { if (file.name.toLowerCase().endsWith(".zip")) expanded.push(...await unzipImages(file)); else if (imageExt.test(file.name)) expanded.push(file); }
      setFiles(expanded); setErr(""); if (csvRows.length) void buildPreview(csvRows, expanded);
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not read the image files."); }
  }

  async function upload() {
    if (!ready || confirmed) return;
    setBusy(true); setErr(""); setMsg(""); setConfirmed(true);
    try {
      let uploaded = 0;
      for (const item of mappings) {
        const path = `products/${item.product!.id}/${item.filename}`;
        const up = await supabase.storage.from("product-images").upload(path, item.file, { upsert: true, cacheControl: "31536000", contentType: item.file.type || mimeFor(item.filename) });
        if (up.error) throw up.error;
        const existing = await supabase.from("product_images").select("id,sort_order").eq("product_id", item.product!.id).order("sort_order", { ascending: true });
        if (existing.error) throw existing.error;
        const current = existing.data || [];
        const existingPath = await supabase.from("product_images").select("id").eq("storage_path", path).maybeSingle();
        if (existingPath.error) throw existingPath.error;
        if (existingPath.data?.id) {
          const update = await supabase.from("product_images").update({ alt_text: item.product!.name }).eq("id", existingPath.data.id);
          if (update.error) throw update.error;
        } else {
          const insert = await supabase.from("product_images").insert({ product_id: item.product!.id, storage_path: path, alt_text: item.product!.name, sort_order: current.length, is_primary: current.length === 0 });
          if (insert.error) throw insert.error;
        }
        uploaded++;
      }
      setMsg(`Uploaded and associated ${uploaded} product image${uploaded === 1 ? "" : "s"}.`);
    } catch (e) { setConfirmed(false); setErr(e instanceof Error ? e.message : "Bulk image upload failed."); }
    finally { setBusy(false); }
  }

  return <section className="mx-auto mt-8 max-w-7xl border border-black/10 bg-white p-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-safety">Bulk media ingestion</p><h2 className="mt-1 font-display text-3xl font-semibold uppercase">Bulk Product Images</h2><p className="mt-1 max-w-3xl text-sm text-smoke">CSV defines the authoritative SKU → filename mapping. ZIP/folder files are matched exactly; nothing is uploaded until you confirm.</p></div><button onClick={downloadTemplate} className="border border-black/20 px-4 py-2 text-sm font-medium">Download Image CSV Template</button></div>
    {msg && <div className="mt-4 border border-green-200 bg-green-50 p-3 text-sm text-green-700">{msg}</div>}{err && <div className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="border border-dashed border-black/20 p-5"><p className="font-medium">1. Mapping CSV</p><input type="file" accept=".csv,text/csv" onChange={onCSV} className="mt-3 block w-full text-sm"/><p className="mt-2 text-xs text-smoke">Required columns: SKU, Image</p><p className="mt-2 text-xs">{csvRows.length} mapping rows</p></div>
      <div className="border border-dashed border-black/20 p-5"><p className="font-medium">2. Images / ZIP</p><input type="file" multiple accept=".zip,image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={onFiles} className="mt-3 block w-full text-sm"/><p className="mt-2 text-xs text-smoke">A ZIP is expanded in-browser. You can also select a folder's files.</p><p className="mt-2 text-xs">{files.length} image files</p></div>
      <div className="border border-black/10 bg-paper p-5"><p className="font-medium">3. Validation</p><p className={`mt-2 text-sm ${issues.length ? "text-red-600" : ready ? "text-green-700" : "text-smoke"}`}>{issues.length ? `${issues.length} issue${issues.length === 1 ? "" : "s"}` : ready ? `${matched} exact matches ready` : "Waiting for CSV + images"}</p><button disabled={!csvRows.length || !files.length || busy} onClick={() => void buildPreview()} className="mt-4 w-full border border-black/20 px-4 py-2 text-sm">{busy ? "Validating…" : "Validate & Preview"}</button></div>
    </div>
    {issues.length > 0 && <div className="mt-5 max-h-48 overflow-auto border border-red-100 bg-red-50 p-4 text-xs text-red-700">{issues.slice(0, 150).map((x, i) => <div key={i}>{x}</div>)}</div>}
    <div className="mt-6 border border-black/10 bg-paper p-5"><div className="flex items-center justify-between"><h3 className="font-display text-xl font-semibold uppercase">Preview</h3><span className="font-mono text-xs text-smoke">{mappings.length} exact matches</span></div><div className="mt-4 max-h-80 overflow-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-paper-2 font-mono uppercase"><tr><th className="p-2">SKU</th><th className="p-2">Product</th><th className="p-2">Image</th><th className="p-2">Result</th></tr></thead><tbody>{mappings.map((m, i) => <tr key={i} className="border-t border-black/10"><td className="p-2">{m.sku}</td><td className="p-2">{m.product?.name}</td><td className="p-2">{m.filename}</td><td className="p-2 text-green-700">Exact match</td></tr>)}{!mappings.length && <tr><td colSpan={4} className="p-6 text-center text-smoke">No validated matches yet.</td></tr>}</tbody></table></div><div className="mt-5 flex flex-wrap gap-3"><button disabled={!ready || busy || confirmed} onClick={() => void upload()} className="bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{busy ? "Uploading…" : confirmed ? "Uploaded" : `Confirm & Upload ${matched} Images`}</button><button onClick={reset} className="border border-black/20 px-5 py-3 text-sm">Reset</button></div>{unmatchedFiles.length > 0 && <p className="mt-3 text-xs text-red-600">Unmatched files: {unmatchedFiles.map(f => f.name).join(", ")}</p>}</div>
  </section>;
}

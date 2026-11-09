import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type MediaRow = {
  id: string;
  media_key: string;
  label: string;
  page: string;
  bucket_id: string;
  storage_path: string;
  alt_text: string | null;
  active: boolean;
  sort_order: number;
  updated_at: string;
};

const BUCKETS = ["business-assets", "brand-images", "category-images", "product-images", "rental-images"] as const;
const slug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const publicUrl = (row: Pick<MediaRow, "bucket_id" | "storage_path">) =>
  row.storage_path.startsWith("/") || row.storage_path.startsWith("https://") || row.storage_path.startsWith("http://")
    ? row.storage_path
    : supabase.storage.from(row.bucket_id).getPublicUrl(row.storage_path).data.publicUrl;

const empty = {
  id: "", media_key: "", label: "", page: "General", bucket_id: "business-assets",
  storage_path: "", alt_text: "", active: true, sort_order: "0",
};

export default function AdminMediaLibrary() {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [pageFilter, setPageFilter] = useState("All");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const { data, error } = await supabase.from("site_media").select("*").order("page").order("sort_order").order("label");
    if (error) setError(error.message);
    else setRows((data || []) as MediaRow[]);
  }
  useEffect(() => { void load(); }, []);

  const pages = useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.page))).sort()], [rows]);
  const filtered = rows.filter((r) =>
    (pageFilter === "All" || r.page === pageFilter) &&
    (!query || `${r.label} ${r.media_key} ${r.alt_text || ""}`.toLowerCase().includes(query.toLowerCase()))
  );

  function edit(row: MediaRow) {
    setForm({
      id: row.id, media_key: row.media_key, label: row.label, page: row.page,
      bucket_id: row.bucket_id, storage_path: row.storage_path, alt_text: row.alt_text || "",
      active: row.active, sort_order: String(row.sort_order),
    });
    setFile(null);
    setMessage("");
    setError("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!form.media_key.trim() || !form.label.trim()) {
      setError("A unique media key and label are required.");
      return;
    }
    if (file && (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) {
      setError("Choose an image file up to 5 MB.");
      return;
    }
    setBusy(true); setError(""); setMessage("");
    let storagePath = form.storage_path || "";
    let uploadedPath = "";
    try {
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        uploadedPath = `site/${slug(form.page)}/${slug(form.media_key)}-${crypto.randomUUID()}.${ext}`;
        const upload = await supabase.storage.from(form.bucket_id).upload(uploadedPath, file, {
          upsert: false, cacheControl: "31536000", contentType: file.type,
        });
        if (upload.error) throw upload.error;
        storagePath = uploadedPath;
      }
      const payload = {
        media_key: form.media_key.trim(), label: form.label.trim(), page: form.page.trim() || "General",
        bucket_id: form.bucket_id, storage_path: storagePath, alt_text: form.alt_text.trim() || null,
        active: form.active, sort_order: Number(form.sort_order || 0), updated_at: new Date().toISOString(),
      };
      const result = form.id
        ? await supabase.from("site_media").update(payload).eq("id", form.id)
        : await supabase.from("site_media").insert(payload);
      if (result.error) throw result.error;
      if (uploadedPath && form.storage_path && !form.storage_path.startsWith("/") && !form.storage_path.startsWith("http")) {
        await supabase.storage.from(form.bucket_id).remove([form.storage_path]);
      }
      setMessage(form.id ? "Media record updated." : "Image uploaded and added to the media library.");
      setForm(empty); setFile(null); await load();
    } catch (e) {
      if (uploadedPath) await supabase.storage.from(form.bucket_id).remove([uploadedPath]);
      setError(e instanceof Error ? e.message : "Could not save this image.");
    } finally { setBusy(false); }
  }

  async function remove(row: MediaRow) {
    if (!confirm(`Delete “${row.label}” and its stored image? This may remove it from pages using this media key.`)) return;
    setBusy(true); setError(""); setMessage("");
    const result = await supabase.from("site_media").delete().eq("id", row.id);
    if (result.error) setError(result.error.message);
    else {
      if (row.storage_path.startsWith("/") || row.storage_path.startsWith("http")) {
        setMessage("Image reference removed. The original website asset remains in the code repository.");
      } else {
        const removed = await supabase.storage.from(row.bucket_id).remove([row.storage_path]);
        if (removed.error) setError(`Media record removed, but storage cleanup failed: ${removed.error.message}`);
        else setMessage("Image removed from the media library.");
      }
      if (form.id === row.id) setForm(empty);
      await load();
    }
    setBusy(false);
  }

  async function toggle(row: MediaRow) {
    const { error } = await supabase.from("site_media").update({ active: !row.active, updated_at: new Date().toISOString() }).eq("id", row.id);
    if (error) setError(error.message); else await load();
  }

  return <section className="mx-auto mt-8 max-w-7xl border border-black/10 bg-white p-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-safety">Central website image control</p>
        <h2 className="mt-1 font-display text-3xl font-semibold uppercase">Media Library</h2>
        <p className="mt-1 max-w-3xl text-sm text-smoke">Upload, replace, organize, publish and retire website images without editing source code. Use stable media keys such as <code>home.hero</code> and <code>home.closing</code>.</p>
      </div>
      <button type="button" onClick={() => { setForm(empty); setFile(null); setError(""); setMessage(""); }} className="bg-black px-4 py-2 text-sm font-medium text-white">+ Add image</button>
    </div>
    {message && <div className="mt-4 border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
    {error && <div className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="mt-6 grid gap-7 xl:grid-cols-[1fr_390px]">
      <div>
        <div className="flex flex-wrap gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search images, keys or alt text…" className="field min-w-[220px] flex-1"/>
          <select value={pageFilter} onChange={e => setPageFilter(e.target.value)} className="field"><option value="All">All pages</option>{pages.filter(p => p !== "All").map(p => <option key={p}>{p}</option>)}</select>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(row => <article key={row.id} className="overflow-hidden border border-black/10 bg-paper">
            <div className="grid aspect-[16/10] place-items-center bg-white p-3"><img src={publicUrl(row)} alt={row.alt_text || row.label} className="max-h-full max-w-full object-contain" loading="lazy"/></div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2"><b className="text-sm">{row.label}</b><span className={row.active ? "text-xs text-green-700" : "text-xs text-smoke"}>{row.active ? "Live" : "Hidden"}</span></div>
              <p className="mt-1 break-all font-mono text-[10px] text-smoke">{row.media_key}</p>
              <p className="mt-1 text-xs text-smoke">{row.page} · {row.bucket_id}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs"><button type="button" onClick={() => edit(row)} className="underline">Edit / replace</button><button type="button" onClick={() => void toggle(row)} className="underline">{row.active ? "Hide" : "Publish"}</button><button type="button" onClick={() => void remove(row)} className="text-red-600 underline">Delete</button></div>
            </div>
          </article>)}
          {!filtered.length && <p className="col-span-full border border-dashed border-black/20 p-8 text-center text-sm text-smoke">No images in this view yet. Add an image to start your library.</p>}
        </div>
      </div>
      <form onSubmit={save} className="h-fit border border-black/10 bg-paper p-5">
        <h3 className="font-display text-xl font-semibold uppercase">{form.id ? "Edit image" : "Upload website image"}</h3>
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium">Image label<input required value={form.label} onChange={e => setForm(f => ({...f,label:e.target.value}))} placeholder="Homepage hero image" className="field mt-1 w-full"/></label>
          <label className="block text-sm font-medium">Stable media key<input required disabled={!!form.id} value={form.media_key} onChange={e => setForm(f => ({...f,media_key:e.target.value}))} placeholder="home.hero" className="field mt-1 w-full"/></label>
          <label className="block text-sm font-medium">Website page / section<input value={form.page} onChange={e => setForm(f => ({...f,page:e.target.value}))} placeholder="Homepage" className="field mt-1 w-full"/></label>
          <label className="block text-sm font-medium">Alt text<input value={form.alt_text} onChange={e => setForm(f => ({...f,alt_text:e.target.value}))} placeholder="Describe the image for accessibility" className="field mt-1 w-full"/></label>
          <label className="block text-sm font-medium">Storage bucket<select disabled={!!form.id} value={form.bucket_id} onChange={e => setForm(f => ({...f,bucket_id:e.target.value}))} className="field mt-1 w-full">{BUCKETS.map(b => <option key={b}>{b}</option>)}</select></label>
          <label className="block text-sm font-medium">Upload or replace image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif" onChange={e => setFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm"/></label>
          {form.storage_path && <div className="border border-black/10 bg-white p-3"><img src={publicUrl({bucket_id:form.bucket_id,storage_path:form.storage_path})} alt={form.alt_text || form.label} className="max-h-36 w-full object-contain"/><p className="mt-2 break-all font-mono text-[10px] text-smoke">{form.storage_path}</p></div>}
          <div className="grid grid-cols-2 gap-3"><label className="text-sm">Sort order<input type="number" value={form.sort_order} onChange={e => setForm(f => ({...f,sort_order:e.target.value}))} className="field mt-1 w-full"/></label><label className="flex items-center gap-2 pt-6 text-sm"><input type="checkbox" checked={form.active} onChange={e => setForm(f => ({...f,active:e.target.checked}))}/> Published</label></div>
          <p className="text-xs text-smoke">Maximum 5 MB. Replacing an image updates its media record and cleans up the previous stored file after a successful save.</p>
          <div className="flex gap-3"><button disabled={busy} className="flex-1 bg-black p-3 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : form.id ? "Save changes" : "Upload image"}</button>{form.id && <button type="button" onClick={() => {setForm(empty);setFile(null)}} className="border border-black/20 px-3 text-sm">Cancel</button>}</div>
        </div>
      </form>
    </div>
  </section>;
}

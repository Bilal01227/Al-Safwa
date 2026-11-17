import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { rentalCategories } from "../lib/data/rental";

type RentalRecord = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  model_number: string | null;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
};

const blank: Omit<RentalRecord, "id"> = {
  name: "", slug: "", category: rentalCategories[0], model_number: null,
  description: "", image_url: "", active: true, sort_order: 999,
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminRentalEquipment() {
  const [rows, setRows] = useState<RentalRecord[]>([]);
  const [form, setForm] = useState<Omit<RentalRecord, "id"> & { id?: string }>(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("rental_equipment")
      .select("id,name,slug,category,model_number,description,image_url,active,sort_order")
      .order("sort_order", { ascending: true }).order("name", { ascending: true });
    if (error) setError(error.message);
    else setRows((data || []) as RentalRecord[]);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  const set = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  function edit(row: RentalRecord) {
    setNotice("");
    setError("");
    setForm({ ...row });
    document.getElementById("rental-equipment-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() { setForm({ ...blank }); setNotice(""); setError(""); }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    const name = form.name.trim();
    const slug = form.slug.trim() || slugify(name);
    if (!name || !slug || !form.category) { setError("Name, slug and category are required."); setSaving(false); return; }
    const payload = {
      name, slug, category: form.category, model_number: form.model_number?.trim() || null,
      description: form.description?.trim() || null, image_url: form.image_url?.trim() || null,
      active: form.active, sort_order: Number(form.sort_order) || 0, enquiry_only: true,
      availability_status: "enquiry_only",
    };
    const result = form.id
      ? await supabase.from("rental_equipment").update(payload).eq("id", form.id)
      : await supabase.from("rental_equipment").insert(payload);
    if (result.error) setError(result.error.message);
    else { setNotice("Rental catalogue item saved."); reset(); await load(); }
    setSaving(false);
  }

  async function toggleActive(row: RentalRecord) {
    const { error } = await supabase.from("rental_equipment").update({ active: !row.active }).eq("id", row.id);
    if (error) setError(error.message); else await load();
  }

  return (
    <section className="admin-surface mx-auto mt-8 max-w-7xl border p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="font-mono text-xs uppercase tracking-[.18em] text-safety">Rental catalogue</p><h2 className="mt-1 font-display text-2xl font-semibold uppercase">Equipment management</h2><p className="mt-1 text-sm admin-muted">Edit names, categories, specifications and existing image URLs. Images are not replaced automatically.</p></div>
        <button type="button" onClick={reset} className="admin-control border px-4 py-2 text-sm">New equipment</button>
      </div>

      <form id="rental-equipment-editor" onSubmit={save} className="mt-6 grid scroll-mt-24 gap-4 border border-ink/10 p-4 md:grid-cols-2">
        <label className="text-sm">Equipment name<input required className="field mt-1" value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
        <label className="text-sm">URL slug<input required className="field mt-1" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(form.name)} /></label>
        <label className="text-sm">Category<select className="field mt-1" value={form.category || ""} onChange={(e) => set("category", e.target.value)}>{rentalCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="text-sm">Model / specification<input className="field mt-1" value={form.model_number || ""} onChange={(e) => set("model_number", e.target.value)} /></label>
        <label className="text-sm md:col-span-2">Description<textarea className="field mt-1 min-h-20" value={form.description || ""} onChange={(e) => set("description", e.target.value)} /></label>
        <label className="text-sm md:col-span-2">Existing image URL<input className="field mt-1" value={form.image_url || ""} onChange={(e) => set("image_url", e.target.value)} /><span className="mt-1 block text-xs admin-muted">Leave unchanged to keep the current photograph.</span></label>
        <label className="text-sm">Sort order<input type="number" className="field mt-1" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} /> Visible on website</label>
        <div className="flex flex-wrap gap-2 md:col-span-2"><button disabled={saving} className="bg-safety px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : form.id ? "Save changes" : "Add equipment"}</button><button type="button" onClick={reset} className="admin-control border px-5 py-2.5 text-sm">Cancel</button></div>
        {error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}
        {notice && <p className="text-sm text-green-700 md:col-span-2">{notice}</p>}
      </form>

      <div className="mt-6">
        {loading ? <p className="text-sm admin-muted">Loading rental catalogue…</p> : (
          <div className="divide-y divide-ink/10">
            {rows.map((row) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0"><p className="font-medium">{row.name}</p><p className="text-xs admin-muted">{row.category} · {row.active ? "Visible" : "Hidden"} · Contact for price</p></div>
              <div className="flex gap-2"><button type="button" onClick={() => edit(row)} className="admin-control border px-3 py-1.5 text-xs">Edit</button><button type="button" onClick={() => void toggleActive(row)} className="admin-control border px-3 py-1.5 text-xs">{row.active ? "Hide" : "Publish"}</button></div>
            </div>)}
          </div>
        )}
      </div>
    </section>
  );
}

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const metrics = [
  ["products", "Products"],
  ["brands", "Brands"],
  ["categories", "Categories"],
  ["warehouses", "Warehouses"],
  ["leads", "Leads"],
  ["quote_requests", "Quote Requests"],
  ["rental_bookings", "Rental Bookings"],
  ["service_requests", "Service Requests"],
] as const;

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message); else onLogin();
  }

  return <main className="min-h-screen grid place-items-center bg-paper px-4">
    <form onSubmit={submit} className="w-full max-w-md border border-black/10 bg-white p-8 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-[.2em] text-safety">Al Safwa · Admin</p>
      <h1 className="mt-3 font-display text-4xl font-semibold uppercase">Sign in</h1>
      <p className="mt-2 text-sm text-smoke">Authorized staff only.</p>
      <label className="mt-8 block text-sm font-medium">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full border p-3" /></label>
      <label className="mt-4 block text-sm font-medium">Password<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full border p-3" /></label>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="mt-6 w-full bg-black p-3 font-medium text-white disabled:opacity-50">{loading ? "Signing in…" : "Sign in"}</button>
    </form>
  </main>;
}

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (!session) return;
    const results = await Promise.all(metrics.map(async ([table]) => {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      return { table, count: count ?? 0, error };
    }));
    const failed = results.find(r => r.error);
    if (failed?.error) setError(failed.error.message);
    setCounts(Object.fromEntries(results.map(r => [r.table, r.count])));
  }

  useEffect(() => {
    load();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!session) return <Login onLogin={load} />;

  return <main className="min-h-screen bg-paper px-4 py-8 md:px-8">
    <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-black/10 pb-6">
      <div><p className="font-mono text-xs uppercase tracking-[.2em] text-safety">Al Safwa · Control Center</p><h1 className="mt-2 font-display text-4xl font-semibold uppercase">Dashboard</h1></div>
      <button onClick={() => supabase.auth.signOut()} className="border border-black/20 px-4 py-2 text-sm">Sign out</button>
    </header>
    {error && <div className="mx-auto mt-6 max-w-7xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Backend error: {error}</div>}
    <section className="mx-auto mt-8 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map(([table, label]) => <article key={table} className="border border-black/10 bg-white p-5"><p className="text-sm text-smoke">{label}</p><p className="mt-2 font-display text-4xl font-semibold">{counts[table] ?? "—"}</p></article>)}
    </section>
    <section className="mx-auto mt-8 max-w-7xl border border-black/10 bg-white p-6">
      <h2 className="font-display text-2xl font-semibold uppercase">Backend connection</h2>
      <p className="mt-2 text-sm text-smoke">Authenticated with Supabase and reading live PostgreSQL row counts through the browser-safe client.</p>
      <div className="mt-5 grid gap-3 text-sm md:grid-cols-3"><div className="border p-3"><b>Auth</b><br/>Connected</div><div className="border p-3"><b>Database</b><br/>Connected</div><div className="border p-3"><b>Role</b><br/>Protected by RLS</div></div>
    </section>
  </main>;
}

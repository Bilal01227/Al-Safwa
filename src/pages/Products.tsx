import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { business } from "../lib/business";
import { waHref, waProductMessage } from "../lib/whatsapp";
import { usePageMeta, siteTitle } from "../lib/seo";
import { fetchProducts, fetchProductBySlug, fetchRelatedProducts } from "../lib/data/products";
import { categories } from "../lib/data/categories";
import type { Product } from "../lib/types";
import { Reveal, CTAButton, PageHeader, AvailabilityBadge, MonoTag, SectionHead } from "../components/kit";
import { IcSearch, IcFilter, IcWhatsApp, IcPhone, IcArrowRight, IcX } from "../components/icons";
import { telHref } from "../lib/business";
import ProductCard from "../components/ProductCard";

/* ── Catalogue page ────────────────────────────────────────────── */
export function ProductsPage() {
  usePageMeta({
    title: siteTitle("Product Catalogue"),
    description:
      "Browse industrial power tools, safety equipment, motors, pumps and spare parts supplied by Al Safwa Trading in Oman. Filter by brand, category and availability, then request a quote.",
    path: "/products",
  });

  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const brand = params.get("brand") ?? "";
  const cat = params.get("cat") ?? "";
  const sub = params.get("sub") ?? "";
  const avail = params.get("avail") ?? "";
  const price = params.get("price") ?? "";

  const [all, setAll] = useState<Product[] | null>(null);

  useEffect(() => {
    let live = true;
    fetchProducts().then((list) => live && setAll(list));
    return () => {
      live = false;
    };
  }, []);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "cat") next.delete("sub");
    setParams(next, { replace: true });
  };

  const options = useMemo(() => {
    if (!all) return { brands: [], cats: [], subs: [], avails: [], prices: [] };
    const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean))).sort();
    const scoped = cat ? all.filter((p) => p.category === cat) : all;
    return {
      brands: uniq(all.map((p) => p.brand)),
      cats: uniq(all.map((p) => p.category)),
      subs: uniq(scoped.map((p) => p.subcategory)),
      avails: uniq(all.map((p) => p.availability)),
      prices: uniq(all.map((p) => p.priceType)),
    };
  }, [all, cat]);

  const filtered = useMemo(() => {
    if (!all) return null;
    const needle = q.trim().toLowerCase();
    return all.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (cat && p.category !== cat) return false;
      if (sub && p.subcategory !== sub) return false;
      if (avail && p.availability !== avail) return false;
      if (price && p.priceType !== price) return false;
      if (needle) {
        const hay = `${p.productName} ${p.brand} ${p.modelNumber} ${p.subcategory} ${p.shortDescription}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [all, q, brand, cat, sub, avail, price]);

  const hasFilters = Boolean(q || brand || cat || sub || avail || price);
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <>
      <PageHeader
        crumb="Products"
        title="Product Catalogue"
        lead="Industrial tools, safety equipment, motors, pumps and spare parts. Pricing and availability are quoted per order — filter, shortlist, then request a quote."
        ghost="CAT"
      />

      {/* Filter toolbar */}
      <div className="border-b border-ink/10 bg-paper/95 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 sm:px-6">
          <label className="relative min-w-[220px] flex-1">
            <IcSearch width={16} height={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-smoke" />
            <input
              type="search"
              value={q}
              onChange={(e) => update("q", e.target.value)}
              placeholder="Search products, brands, models…"
              className="field pl-9"
              aria-label="Search products"
            />
          </label>
          <IcFilter width={18} height={18} className="hidden text-smoke md:block" />
          {(
            [
              ["brand", "Brand", options.brands],
              ["cat", "Category", options.cats],
              ["sub", "Subcategory", options.subs],
              ["avail", "Availability", options.avails],
              ["price", "Price type", options.prices],
            ] as const
          ).map(([key, label, opts]) => (
            <select
              key={key}
              value={key === "brand" ? brand : key === "cat" ? cat : key === "sub" ? sub : key === "avail" ? avail : price}
              onChange={(e) => update(key, e.target.value)}
              className="field w-auto min-w-[130px] py-2 text-sm"
              aria-label={`Filter by ${label}`}
            >
              <option value="">{label} — all</option>
              {opts.map((o) => (
                <option key={o} value={o}>
                  {key === "cat" ? catName(o) : o.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          ))}
          {hasFilters && (
            <button
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              className="inline-flex items-center gap-1.5 border border-ink/25 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-safety hover:text-safety"
            >
              <IcX width={13} height={13} /> Reset
            </button>
          )}
        </div>
      </div>

      <section className="grid-light bg-paper pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-smoke">
            {filtered === null ? "Loading catalogue…" : `${filtered.length} item${filtered.length === 1 ? "" : "s"} · data pending verification`}
          </p>

          {filtered === null ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-card">
                  <div className="skel aspect-[4/3]" />
                  <div className="space-y-3 p-4">
                    <div className="skel h-4 w-2/3" />
                    <div className="skel h-3 w-full" />
                    <div className="skel h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-dashed border-ink/30 bg-card px-6 py-16 text-center">
              <IcSearch width={40} height={40} className="mx-auto text-smoke" />
              <h2 className="mt-4 font-display text-3xl font-semibold uppercase">No products match these filters</h2>
              <p className="mx-auto mt-2 max-w-md text-smoke">
                Try clearing a filter — or ask us directly: we source equipment beyond the published catalogue.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <CTAButton variant="dark" className="h-10 px-4 text-[15px]" to="/request-quote">
                  Request a quote
                </CTAButton>
                <button
                  onClick={() => setParams(new URLSearchParams(), { replace: true })}
                  className="border border-ink/25 px-4 font-display text-[15px] uppercase tracking-[0.08em] transition-colors hover:border-safety hover:text-safety"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 4) * 60}>
                  <ProductCard product={p} index={i} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal>
            <div className="mt-14 flex flex-wrap items-center justify-between gap-6 bg-ink p-6 md:p-8">
              <div>
                <h2 className="font-display text-3xl font-semibold uppercase text-paper">
                  Can’t find what you need?
                </h2>
                <p className="mt-1 text-mist">
                  The published catalogue is growing — send the item, brand and model and we will source it.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CTAButton href={waHref()} variant="wa">
                  <IcWhatsApp /> WhatsApp us
                </CTAButton>
                <CTAButton to="/request-quote" variant="safety">
                  Request a quote <IcArrowRight width={16} height={16} />
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ── Product detail page ───────────────────────────────────────── */
export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null | undefined>(null);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    let live = true;
    setProduct(null);
    if (!slug) return;
    fetchProductBySlug(slug).then((p) => {
      if (!live) return;
      setProduct(p);
      if (p) fetchRelatedProducts(p).then((r) => live && setRelated(r));
    });
    return () => {
      live = false;
    };
  }, [slug]);

  usePageMeta({
    title: siteTitle(product ? product.productName : "Product"),
    description: product
      ? `${product.productName} (model ${product.modelNumber}) — supplied by ${business.name} in Oman. Request price and availability.`
      : `Product details from ${business.name}, Oman.`,
    path: `/products/${slug ?? ""}`,
  });

  if (product === null) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="skel aspect-[4/3]" />
          <div className="space-y-4">
            <div className="skel h-4 w-24" />
            <div className="skel h-12 w-3/4" />
            <div className="skel h-4 w-full" />
            <div className="skel h-4 w-2/3" />
            <div className="skel h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <MonoTag tone="safety">Catalogue reference not found</MonoTag>
        <h1 className="mt-5 font-display text-5xl font-semibold uppercase">Product not listed</h1>
        <p className="mt-4 text-smoke">
          This item may not be published yet. Ask us directly — if it exists, we can source it.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <CTAButton to="/products" variant="dark">
            Back to catalogue
          </CTAButton>
          <CTAButton href={waHref()} variant="wa">
            <IcWhatsApp /> WhatsApp
          </CTAButton>
        </div>
      </div>
    );
  }

  const p = product;
  const showPrice = p.verified && p.price !== null;

  return (
    <>
      <div className="bg-coal">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mist sm:px-6">
          <Link to="/" className="hover:text-safety">Home</Link>
          <span className="text-safety">/</span>
          <Link to="/products" className="hover:text-safety">Products</Link>
          <span className="text-safety">/</span>
          <span className="text-paper">{p.modelNumber}</span>
        </div>
      </div>

      <section className="grid-light bg-paper py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <figure className="relative border border-ink/15 bg-card">
                <span className="hazard-thin absolute inset-x-0 top-0 z-10 h-1.5" aria-hidden="true" />
                <img
                  src={p.imageUrl}
                  alt={p.productName}
                  className="aspect-[4/3] w-full object-cover"
                  width={900}
                  height={700}
                />
                {!p.verified && (
                  <span className="absolute bottom-3 left-3">
                    <MonoTag tone="safety">Specs pending verification</MonoTag>
                  </span>
                )}
              </figure>
            </Reveal>

            <div className="lg:col-span-6">
              <Reveal>
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to={`/brands/${p.brandSlug}`}
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-safety hover:text-safety-deep"
                  >
                    {p.brand}
                  </Link>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-smoke">
                    {categories.find((c) => c.slug === p.category)?.name} · {p.subcategory}
                  </span>
                </div>
                <h1 className="mt-3 font-display text-4xl font-semibold uppercase leading-[0.98] md:text-5xl">
                  {p.productName}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="border border-ink/15 bg-paper-2 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.1em]">
                    Model · {p.modelNumber}
                  </span>
                  <AvailabilityBadge text={p.availability} />
                </div>
                <p className="mt-5 max-w-xl leading-relaxed text-smoke">{p.shortDescription}</p>
              </Reveal>
              <Reveal delay={80}>
                <div className="mt-8 border-y border-ink/10 py-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-smoke">Price</p>
                      <p className="mt-1 font-display text-2xl font-semibold uppercase">
                        {showPrice ? `${p.currency} ${p.price}` : "Price on request"}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-smoke">Availability</p>
                      <p className="mt-1 font-display text-2xl font-semibold uppercase">{p.availability}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <CTAButton href={waHref(waProductMessage(p))} variant="wa">
                    <IcWhatsApp /> Request on WhatsApp
                  </CTAButton>
                  <CTAButton to={`/request-quote?product=${encodeURIComponent(p.slug)}`} variant="safety">
                    Request a quote <IcArrowRight width={16} height={16} />
                  </CTAButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-2 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead eyebrow="Product details" title="Specifications" />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="border border-ink/10 bg-card p-6 lg:col-span-2">
              <p className="leading-relaxed text-smoke">{p.description}</p>
              {p.specifications?.length ? (
                <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                  {p.specifications.map(([label, value]) => (
                    <div key={label} className="grid gap-2 py-4 sm:grid-cols-3">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-smoke">{label}</dt>
                      <dd className="sm:col-span-2">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
            <aside className="border border-ink/10 bg-card p-6">
              <MonoTag tone="neutral">Supply note</MonoTag>
              <h2 className="mt-4 font-display text-2xl font-semibold uppercase">Need a bulk quantity?</h2>
              <p className="mt-2 text-smoke">Send the model, quantity and delivery requirement. We will confirm commercial terms and lead time.</p>
              <CTAButton className="mt-6 w-full" to={`/request-quote?product=${encodeURIComponent(p.slug)}`} variant="dark">
                Request a quote
              </CTAButton>
              <CTAButton className="mt-3 w-full" href={telHref()} variant="light">
                <IcPhone /> Call us
              </CTAButton>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-paper py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHead eyebrow="Related products" title="You may also need" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, i) => (
                <Reveal key={item.slug} delay={(i % 4) * 60}>
                  <ProductCard product={item} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

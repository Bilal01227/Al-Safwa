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
import { trackEvent } from "../lib/analytics";

/* ── Catalogue page ────────────────────────────────────────────── */
export function ProductsPage() {


  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const brand = params.get("brand") ?? "";
  const cat = params.get("cat") ?? "";
  const sub = params.get("sub") ?? "";
  
  const price = params.get("price") ?? "";

  const [all, setAll] = useState<Product[] | null>(null);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

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
    if (!all) return { brands: [], cats: [], subs: [], prices: [] };
    const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean))).sort();
    const scoped = cat ? all.filter((p) => p.category === cat) : all;
    return {
      brands: uniq(all.map((p) => p.brand)),
      cats: uniq(all.map((p) => p.category)),
      subs: uniq(scoped.map((p) => p.subcategory)),
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
      if (price && p.priceType !== price) return false;
      if (needle) {
        const hay = `${p.productName} ${p.brand} ${p.modelNumber} ${p.subcategory} ${p.shortDescription}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [all, q, brand, cat, sub, price]);

  const compared = useMemo(() => all ? all.filter((p) => compareSlugs.includes(p.slug)) : [], [all, compareSlugs]);
  const compareSpecLabels = useMemo(
    () => Array.from(new Set(compared.flatMap((p) => Object.keys(p.specifications || {})))).sort(),
    [compared],
  );
  const toggleCompare = (slug: string) => {
    setCompareSlugs((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length >= 3) return current;
      trackEvent("product_added_to_compare", { product_slug: slug });
      return [...current, slug];
    });
  };

  const hasFilters = Boolean(q || brand || cat || sub || price);

  // Filter combinations are useful to visitors but should not become separate
  // search landing pages. Keep one canonical, indexable catalogue URL.
  usePageMeta({
    title: siteTitle("Product Catalogue"),
    description:
      "Browse industrial power tools, safety equipment, motors, pumps and spare parts supplied by Al Safwa Trading in Oman. Filter by brand and category, then contact us for price.",
    path: "/products",
    indexable: !hasFilters,
  });

  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <>
      <PageHeader
        crumb="Products"
        title="Product Catalogue"
        lead="Industrial tools, safety equipment, motors, pumps and spare parts. Contact us for price — filter, shortlist, then request a quotation."
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
              
              ["price", "Price type", options.prices],
            ] as const
          ).map(([key, label, opts]) => (
            <select
              key={key}
              value={key === "brand" ? brand : key === "cat" ? cat : key === "sub" ? sub : price}
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
            {filtered === null ? "Loading catalogue…" : `${filtered.length} item${filtered.length === 1 ? "" : "s"} · price confirmed on enquiry`}
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
                  <ProductCard
                    product={p}
                    index={i}
                    onCompareToggle={toggleCompare}
                    isCompared={compareSlugs.includes(p.slug)}
                    compareDisabled={compareSlugs.length >= 3}
                  />
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
      {compared.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/20 bg-ink px-4 py-3 text-paper shadow-[0_-10px_35px_rgba(0,0,0,0.2)]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div className="min-w-0"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist">Product shortlist · {compared.length}/3 selected</p><p className="mt-1 truncate text-sm text-paper">{compared.map((p) => p.productName).join(" · ")}</p></div>
            <div className="flex items-center gap-2"><button type="button" disabled={compared.length < 2} onClick={() => setCompareOpen(true)} className="border border-safety bg-safety px-4 py-2 font-display text-sm font-semibold uppercase text-white disabled:cursor-not-allowed disabled:opacity-40">Compare ({compared.length})</button><button type="button" onClick={() => { setCompareSlugs([]); setCompareOpen(false); }} className="border border-white/25 px-3 py-2 font-mono text-[10px] uppercase text-paper hover:border-white">Clear</button></div>
          </div>
        </div>
      )}
      {compareOpen && compared.length >= 2 && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-2 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="product-compare-title">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden border border-ink/20 bg-paper shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-ink/15 bg-ink px-5 py-4 text-paper"><div><h2 id="product-compare-title" className="font-display text-2xl font-semibold uppercase">Compare products</h2><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mist">Compare catalogue information · confirm final specifications with the shop</p></div><button type="button" onClick={() => setCompareOpen(false)} className="border border-white/30 px-3 py-2 font-mono text-xs uppercase text-white hover:border-safety" aria-label="Close comparison">Close</button></div>
            <div className="max-h-[calc(90vh-76px)] overflow-auto p-4 sm:p-5">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead><tr><th className="w-36 border-b border-ink/15 p-3 font-mono text-[10px] uppercase text-smoke">Attribute</th>{compared.map((p) => <th key={p.slug} className="border-b border-ink/15 p-3 align-top"><Link to={"/products/" + p.slug + "/"} onClick={() => setCompareOpen(false)} className="font-display text-lg font-semibold uppercase hover:text-safety">{p.productName}</Link><button type="button" onClick={() => toggleCompare(p.slug)} className="mt-2 block font-mono text-[10px] uppercase text-safety underline">Remove</button></th>)}</tr></thead>
                <tbody>
                  <tr><th className="border-b border-ink/10 p-3 font-mono text-[10px] uppercase text-smoke">Brand</th>{compared.map((p) => <td key={p.slug + "-brand"} className="border-b border-ink/10 p-3">{p.brand}</td>)}</tr>
                  <tr><th className="border-b border-ink/10 p-3 font-mono text-[10px] uppercase text-smoke">Model</th>{compared.map((p) => <td key={p.slug + "-model"} className="border-b border-ink/10 p-3">{p.modelNumber || "Not listed"}</td>)}</tr>
                  <tr><th className="border-b border-ink/10 p-3 font-mono text-[10px] uppercase text-smoke">Category</th>{compared.map((p) => <td key={p.slug + "-category"} className="border-b border-ink/10 p-3">{p.category.replace(/-/g, " ")}</td>)}</tr>
                  <tr><th className="border-b border-ink/10 p-3 font-mono text-[10px] uppercase text-smoke">Description</th>{compared.map((p) => <td key={p.slug + "-description"} className="border-b border-ink/10 p-3 align-top">{p.shortDescription || p.description || "Contact the shop for details."}</td>)}</tr>
                  <tr><th className="border-b border-ink/10 p-3 font-mono text-[10px] uppercase text-smoke">Availability</th>{compared.map((p) => <td key={p.slug + "-availability"} className="border-b border-ink/10 p-3">{p.availability}</td>)}</tr>
                  {compareSpecLabels.map((label) => <tr key={label}><th className="border-b border-ink/10 p-3 font-mono text-[10px] uppercase text-smoke">{label}</th>{compared.map((p) => <td key={p.slug + "-" + label} className="border-b border-ink/10 p-3">{p.specifications?.[label] || "Not listed"}</td>)}</tr>)}
                  <tr><th className="p-3 font-mono text-[10px] uppercase text-smoke">Enquiry</th>{compared.map((p) => <td key={p.slug + "-enquiry"} className="p-3"><a target="_blank" rel="noopener noreferrer" href={waHref(waProductMessage(p))} className="inline-flex border border-wa/40 px-3 py-2 font-mono text-[10px] uppercase text-wa hover:bg-wa hover:text-white">Ask on WhatsApp</a></td>)}</tr>
                </tbody>
              </table>
              <p className="mt-4 text-xs text-smoke">Only catalogue fields are compared. Missing specifications are shown as “Not listed”; no technical values or prices are inferred.</p>
            </div>
          </div>
        </div>
      )}
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
      ? `${product.shortDescription || product.description || product.productName} ${product.brand}${product.modelNumber && product.modelNumber !== "—" ? ` (${product.modelNumber})` : ""} — supplied by ${business.name} in Oman. Request an OMR quotation on WhatsApp.`.replace(/\s+/g, " ").trim().slice(0, 300)
      : `Product details from ${business.name}, Oman.`,
    path: `/products/${slug ?? ""}`,
    image: product?.imageUrl || undefined,
    type: "product",
    // Quote-only products have no public price or genuine review data.
    // Keep breadcrumb markup, but omit Product rich-result markup until valid
    // Offer or review information is available.
    jsonLd: product
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://alsafwaoman.com/" },
              { "@type": "ListItem", position: 2, name: "Products", item: "https://alsafwaoman.com/products/" },
              { "@type": "ListItem", position: 3, name: product.productName, item: `https://alsafwaoman.com/products/${slug}/` },
            ],
          },
        ]
      : undefined,
    indexable: product !== undefined,
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
  const specificationEntries = Object.entries(p.specifications || {});
  const showPrice = p.verified && p.price !== null;

  return (
    <>
      <div className="bg-coal">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mist sm:px-6">
          <Link to="/" className="hover:text-safety">Home</Link>
          <span className="text-safety">/</span>
          <Link to="/products" className="hover:text-safety">Products</Link>
          <span className="text-safety">/</span>
          <span className="text-paper">{p.modelNumber && p.modelNumber !== "—" ? p.modelNumber : p.productName}</span>
        </div>
      </div>

      <section className="grid-light bg-paper py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <figure className="relative border border-ink/15 bg-card">
                <span className="hazard-thin absolute inset-x-0 top-0 z-10 h-1.5" aria-hidden="true" />
                {p.imageUrl ? <img src={p.imageUrl} alt={p.productName} className="aspect-[4/3] w-full object-contain bg-white" width={900} height={700} onError={e=>{e.currentTarget.style.display="none";}}/> : <div className="grid aspect-[4/3] place-items-center bg-paper-2 px-5 text-center font-mono text-xs uppercase tracking-[.14em] text-smoke">Real product photo not assigned yet</div>}
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
                  {p.modelNumber && p.modelNumber !== "—" && (
                    <span className="border border-ink/15 bg-paper-2 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.1em]">
                      Model · {p.modelNumber}
                    </span>
                  )}
                  <AvailabilityBadge text={p.availability} />
                </div>
                <p className="mt-5 max-w-xl leading-relaxed text-smoke">{p.shortDescription || p.description || "Contact us to confirm the specifications and suitability of this product."}</p>
              </Reveal>
              <Reveal delay={80}>
                <div className="mt-8 border-y border-ink/10 py-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-smoke">Price</p>
                      <p className="mt-1 font-display text-2xl font-semibold uppercase">
                        {showPrice ? `${p.currency} ${p.price}` : "Contact for price"}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <CTAButton href={waHref(waProductMessage(p))} variant="wa">
                    <IcWhatsApp /> Request on WhatsApp
                  </CTAButton>
                  <CTAButton to={`/request-quote?product=${encodeURIComponent(p.productName)}${p.modelNumber && p.modelNumber !== "—" ? `&model=${encodeURIComponent(p.modelNumber)}` : ""}`} variant="safety">
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
              <p className="leading-relaxed text-smoke">{p.description || p.shortDescription || "Detailed specifications are confirmed against the exact make and model before quotation."}</p>
              {specificationEntries.length ? (
                <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                  {specificationEntries.map(([label, value]) => (
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

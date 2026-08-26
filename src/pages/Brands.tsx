import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { brands, getBrand, TRADEMARK_NOTE } from "../lib/data/brands";
import { productCountByBrand, fetchProductsByBrand } from "../lib/data/products";
import { waHref, waBrandMessage } from "../lib/whatsapp";
import { business, telHref } from "../lib/business";
import { usePageMeta, siteTitle } from "../lib/seo";
import type { Product } from "../lib/types";
import { Reveal, CTAButton, PageHeader, SectionHead } from "../components/kit";
import { IcArrowUpRight, IcWhatsApp, IcPhone, IcArrowRight } from "../components/icons";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export function BrandsPage() {
  usePageMeta({
    title: siteTitle("Brands We Supply"),
    description:
      "Bosch, Makita, DeWalt, Stanley, Dongcheng, Texmo and more — industrial brands supplied by Al Safwa Trading in Oman.",
    path: "/brands",
  });

  return (
    <>
      <PageHeader
        crumb="Brands"
        title="Brands We Supply"
        lead="Thirteen brands across power tools, safety equipment and motors & pumps. Text monograms are used in place of third-party logos."
        ghost="BR"
      />
      <section className="grid-light bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((b, i) => {
              const count = productCountByBrand(b.slug);
              return (
                <Reveal key={b.slug} delay={(i % 3) * 80}>
                  <Link to={`/brands/${b.slug}`} className="card-hard group flex h-full flex-col p-6">
                    <div className="flex items-start justify-between">
                      <span className="grid h-14 w-14 place-items-center bg-ink font-display text-2xl font-semibold text-safety transition-colors group-hover:bg-safety group-hover:text-paper">
                        {b.monogram}
                      </span>
                      <span className="border border-ink/15 bg-paper-2 px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-smoke">
                        {count > 0 ? `${count} listed` : "On request"}
                      </span>
                    </div>
                    <h2 className="mt-5 font-display text-3xl font-semibold uppercase transition-colors group-hover:text-safety">
                      {b.name}
                    </h2>
                    <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-safety">
                      {b.divisions.join(" · ")}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-smoke">{b.about}</p>
                    <span className="mt-auto flex items-center gap-2 border-t border-ink/10 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-safety">
                      View brand page
                      <IcArrowUpRight width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <Reveal>
            <p className="mt-10 border border-dashed border-ink/25 bg-card px-4 py-3 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.1em] text-smoke">
              {TRADEMARK_NOTE}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function BrandDetailPage() {
  const { brand: brandSlug } = useParams();
  const brand = brandSlug ? getBrand(brandSlug) : undefined;
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    let live = true;
    setItems(null);
    if (brand) fetchProductsByBrand(brand.slug).then((list) => live && setItems(list));
    return () => {
      live = false;
    };
  }, [brand]);

  usePageMeta({
    title: siteTitle(brand ? `${brand.name} in Oman` : "Brand"),
    description: brand
      ? `${brand.name} products supplied by ${business.name} in Oman — request pricing and availability by quote or WhatsApp.`
      : `Brands supplied by ${business.name}, Oman.`,
    path: `/brands/${brandSlug ?? ""}`,
  });

  if (!brand) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-5xl font-semibold uppercase">Brand not found</h1>
        <p className="mt-4 text-smoke">The brand page you requested does not exist in the current catalogue.</p>
        <CTAButton to="/brands" variant="dark" className="mt-8">
          All brands
        </CTAButton>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-coal grid-dark">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-18">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-mist">
            <Link to="/" className="hover:text-safety">Home</Link>
            <span className="mx-2 text-safety">/</span>
            <Link to="/brands" className="hover:text-safety">Brands</Link>
            <span className="mx-2 text-safety">/</span>
            <span className="text-safety">{brand.name}</span>
          </p>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <span className="grid h-20 w-20 shrink-0 place-items-center border border-steel-3 bg-steel font-display text-4xl font-semibold text-safety md:h-24 md:w-24">
                {brand.monogram}
              </span>
              <div>
                <h1 className="font-display text-5xl font-semibold uppercase leading-none text-paper md:text-7xl">
                  {brand.name}
                </h1>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
                  {brand.divisions.join(" · ")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <CTAButton href={waHref(waBrandMessage(brand.name))} variant="wa">
                <IcWhatsApp /> WhatsApp
              </CTAButton>
              <CTAButton to="/request-quote" variant="safety">
                Request quote <IcArrowRight width={16} height={16} />
              </CTAButton>
              <CTAButton href={telHref} variant="outlineLight">
                <IcPhone /> Call
              </CTAButton>
            </div>
          </div>
          <p className="mt-8 max-w-2xl leading-relaxed text-mist">{brand.about}</p>
        </div>
        <div className="hazard h-2" aria-hidden="true" />
      </section>

      <section className="grid-light bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            index="01"
            title={`${brand.name} — Listed Products`}
            lead="Catalogue entries currently published. More items from this brand are available on request."
          />
          {items === null ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-card">
                  <div className="skel aspect-[4/3]" />
                  <div className="space-y-3 p-4">
                    <div className="skel h-4 w-2/3" />
                    <div className="skel h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="border border-dashed border-ink/30 bg-card px-6 py-14 text-center">
              <h2 className="font-display text-3xl font-semibold uppercase">
                {brand.name} items are available on request
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-smoke">
                Catalogue entries for this brand are being verified before publication. Send us the model you need —
                pricing and availability are confirmed per quote.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <CTAButton href={waHref(waBrandMessage(brand.name))} variant="wa">
                  <IcWhatsApp /> Ask on WhatsApp
                </CTAButton>
                <CTAButton to="/request-quote" variant="dark">
                  Request a quote
                </CTAButton>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((pr, i) => (
                <Reveal key={pr.slug} delay={(i % 4) * 70}>
                  <ProductCard product={pr} index={i} />
                </Reveal>
              ))}
            </div>
          )}
          <Reveal>
            <p className="mt-10 border border-dashed border-ink/25 bg-card px-4 py-3 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.1em] text-smoke">
              {TRADEMARK_NOTE}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

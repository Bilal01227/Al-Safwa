import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { business, telHref } from "../lib/business";
import { waHref, waRentalMessage } from "../lib/whatsapp";
import { usePageMeta, siteTitle } from "../lib/seo";
import { rentalCategories, fetchRentalItems } from "../lib/data/rental";
import type { RentalItem } from "../lib/types";
import { useSiteMedia } from "../lib/data/siteMedia";
import { Reveal, CTAButton, PageHeader, MonoTag } from "../components/kit";
import { IcWhatsApp, IcPhone, IcArrowRight } from "../components/icons";

export default function RentalPage() {
  usePageMeta({
    title: siteTitle("Equipment & Machinery Rental"),
    description:
      "Machinery, construction equipment, generators, power tools, welding sets and compressors for rent in Oman from Al Safwa Trading. Request a rental quote.",
    path: "/rental",
  });

  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") ?? "";
  const [items, setItems] = useState<RentalItem[] | null>(null);
  const siteMedia = useSiteMedia();

  useEffect(() => {
    let live = true;
    fetchRentalItems().then((list) => live && setItems(list));
    return () => {
      live = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    return cat ? items.filter((r) => r.category === cat) : items;
  }, [items, cat]);

  const setCat = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("cat", value);
    else next.delete("cat");
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHeader
        crumb="Rental"
        title="Machinery & Equipment Rental"
        lead="Browse a broad equipment rental enquiry catalogue for construction, industrial and infrastructure projects. Specifications, transport, operators and rental rates are confirmed per project."
        ghost="RENT"
      />

      {/* Category chips */}
      <div className="sticky top-16 z-30 border-b border-ink/10 bg-paper/95 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 sm:px-6">
          <Chip active={cat === ""} onClick={() => setCat("")}>
            All equipment
          </Chip>
          {rentalCategories.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <section className="grid-light bg-paper pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-smoke">
            {filtered === null ? "Loading fleet…" : `${filtered.length} equipment type${filtered.length === 1 ? "" : "s"}${cat ? ` · ${cat}` : ""}`}
          </p>

          {filtered === null ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-card">
                  <div className="skel aspect-[16/10]" />
                  <div className="space-y-3 p-4">
                    <div className="skel h-4 w-2/3" />
                    <div className="skel h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 80}>
                  <article className="card-hard group flex h-full flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
                      <img
                        src={siteMedia[`rental.${r.id}`] || r.imageUrl}
                        alt={`${r.name} — illustrative image, not a confirmed Al Safwa fleet unit`}
                        loading="lazy"
                        onError={(event) => { event.currentTarget.style.display = "none"; const placeholder = event.currentTarget.nextElementSibling as HTMLElement | null; if (placeholder) placeholder.classList.remove("hidden"); }}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <div className="hidden absolute inset-0 grid place-items-center px-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-smoke">
                        Image unavailable
                      </div>
                      <span className="absolute left-3 top-3">
                        <MonoTag>{r.category}</MonoTag>
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-display text-2xl font-semibold uppercase leading-tight">{r.name}</h2>
                      <p className="mt-3 text-sm leading-relaxed text-smoke">{r.description}</p>

                      <dl className="mt-4 space-y-1.5 border-t border-ink/10 pt-3 font-mono text-[10.5px] uppercase tracking-[0.1em]">
                        <div className="flex justify-between gap-3">
                          <dt className="text-smoke">Condition</dt>
                          <dd className="text-right text-ink">{r.condition}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-smoke">Pricing</dt>
                          <dd className="text-right text-caution">Contact for price</dd>
                        </div>
                      </dl>

                      

                      <div className="mt-4 grid grid-cols-[1fr_44px] gap-2">
                        <CTAButton
                          to={`/request-quote?intent=rental&product=${encodeURIComponent(r.name)}&model=${encodeURIComponent(r.model)}`}
                          variant="dark"
                          className="h-10 text-[15px]"
                        >
                          Request rental quote
                        </CTAButton>
                        <a
                          href={waHref(waRentalMessage(r))}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ask about ${r.name} rental on WhatsApp`}
                          className="grid h-10 place-items-center border border-wa/50 text-wa transition-colors hover:bg-wa hover:text-white"
                        >
                          <IcWhatsApp width={18} height={18} />
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal>
            <p className="mt-10 border border-dashed border-ink/25 bg-card px-4 py-3 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.1em] text-smoke">
              Product images are reference photographs from equipment manufacturers and suppliers, selected to match each equipment type. They do not represent confirmed Al Safwa-owned units. Exact make/model, condition, operators, transport and rental rates are confirmed individually before quotation.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 bg-ink p-6 md:p-8">
              <div>
                <h2 className="font-display text-3xl font-semibold uppercase text-paper">
                  Need equipment on site this week?
                </h2>
                <p className="mt-1 text-mist">Send the equipment type, rental period and site location to request pricing.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CTAButton href={waHref("Hello, I need to rent equipment for a site in Oman. Please provide rental pricing and terms.")} variant="wa">
                  <IcWhatsApp /> WhatsApp rental desk
                </CTAButton>
                <CTAButton href={telHref} variant="outlineLight">
                  <IcPhone /> {business.phone}
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-200 ${
        active
          ? "border-ink bg-ink text-paper shadow-[3px_3px_0_rgba(232,73,26,0.9)]"
          : "border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-paper-2"
      }`}
    >
      {children}
    </button>
  );
}

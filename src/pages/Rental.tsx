import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { business, telHref } from "../lib/business";
import { waHref, waRentalMessage } from "../lib/whatsapp";
import { usePageMeta, siteTitle } from "../lib/seo";
import { rentalCategories, fetchRentalItems } from "../lib/data/rental";
import type { RentalItem } from "../lib/types";
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

  const RateCell = ({ label }: { label: string }) => (
    <div className="px-2 py-2.5 text-center">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-smoke">{label}</p>
      <p className="mt-0.5 font-display text-[15px] font-semibold uppercase text-caution">On quote</p>
    </div>
  );

  return (
    <>
      <PageHeader
        crumb="Rental"
        title="Machinery & Equipment Rental"
        lead="Rent by the day, week or month. Fleet details and rates are confirmed per project — every rental gets a real quotation from Al Safwa Trading."
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
            {filtered === null ? "Loading fleet…" : `${filtered.length} fleet class${filtered.length === 1 ? "" : "es"}${cat ? ` · ${cat}` : ""}`}
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
                        src={r.imageUrl}
                        alt={r.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <span className="absolute left-3 top-3">
                        <MonoTag>{r.category}</MonoTag>
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-display text-2xl font-semibold uppercase leading-tight">{r.name}</h2>
                      <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-smoke">
                        Brand · {r.brand} — {r.model}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-smoke">{r.description}</p>

                      <dl className="mt-4 space-y-1.5 border-t border-ink/10 pt-3 font-mono text-[10.5px] uppercase tracking-[0.1em]">
                        <div className="flex justify-between gap-3">
                          <dt className="text-smoke">Condition</dt>
                          <dd className="text-right text-ink">{r.condition}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-smoke">Availability</dt>
                          <dd className="text-right text-caution">{r.availability}</dd>
                        </div>
                      </dl>

                      <div className="mt-4 grid grid-cols-3 divide-x divide-ink/10 border border-ink/15 bg-paper-2/60">
                        <RateCell label="Daily" />
                        <RateCell label="Weekly" />
                        <RateCell label="Monthly" />
                      </div>

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
              Rental rates are never listed without verification — duration, location, transport and operator
              requirements all affect pricing, so every rental is quoted individually.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 bg-ink p-6 md:p-8">
              <div>
                <h2 className="font-display text-3xl font-semibold uppercase text-paper">
                  Need equipment on site this week?
                </h2>
                <p className="mt-1 text-mist">Send the equipment class and site location — {business.name} responds with availability.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CTAButton href={waHref("Hello, I need to rent equipment for a site in Oman. Please advise availability.")} variant="wa">
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

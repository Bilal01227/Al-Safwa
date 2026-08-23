import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { business, telHref } from "../lib/business";
import { waHref, waGeneralMessage } from "../lib/whatsapp";
import { usePageMeta } from "../lib/seo";
import { siteTitle } from "../lib/seo";
import { categories } from "../lib/data/categories";
import { brands } from "../lib/data/brands";
import { products, fetchFeaturedProducts } from "../lib/data/products";
import { rentalItems } from "../lib/data/rental";
import { services } from "../lib/data/services";
import { IMG } from "../lib/data/images";
import type { Product } from "../lib/types";
import { Reveal, SectionHead, Marquee, CTAButton } from "../components/kit";
import {
  categoryIcon,
  IcWhatsApp,
  IcPhone,
  IcArrowRight,
  IcArrowUpRight,
  IcTag,
  IcBolt,
  IcTruck,
  IcShield,
  IcFileCheck,
  IcGear,
  IcPin,
  IcClock,
  IcMail,
} from "../components/icons";
import ProductCard from "../components/ProductCard";

export default function Home() {
  usePageMeta({
    title: siteTitle(),
    description:
      "Al Safwa Trading supplies industrial power tools, safety equipment, motors & pumps and machinery across Oman — with rental, repair and maintenance support. Request a quote or chat on WhatsApp.",
    path: "/",
  });

  const [featured, setFeatured] = useState<Product[] | null>(null);
  useEffect(() => {
    let live = true;
    fetchFeaturedProducts().then((f) => live && setFeatured(f));
    return () => {
      live = false;
    };
  }, []);

  const featuredServices = ["equipment-repair", "preventive-maintenance", "field-service", "spare-parts"]
    .map((s) => services.find((x) => x.slug === s))
    .filter(Boolean);

  return (
    <>
      {/* ── 1 · HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-coal grid-dark">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-8 hidden select-none font-display text-[220px] font-bold uppercase leading-none text-paper/[0.03] xl:block"
        >
          OMAN
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-mist">
                <span className="mr-3 inline-block h-2 w-2 bg-safety align-middle" />
                Muscat · Sultanate of Oman — Supply / Rental / Repair
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="font-display text-[clamp(2.9rem,6.5vw,5.4rem)] font-semibold uppercase leading-[0.95] tracking-[0.005em] text-paper">
                Industrial Tools, Equipment &amp; Machinery Solutions in <span className="text-safety">Oman</span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
                Professional equipment supply, rental, repair and maintenance support from {business.name} for
                contractors, workshops and industrial businesses across Oman.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton href={waHref(waGeneralMessage())} variant="wa">
                  <IcWhatsApp /> WhatsApp Us
                </CTAButton>
                <CTAButton to="/request-quote" variant="safety">
                  Request a Quote <IcArrowRight width={18} height={18} />
                </CTAButton>
                <CTAButton to="/products" variant="outlineLight">
                  Explore Products
                </CTAButton>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
                {[
                  [String(brands.length), "Brands supplied"],
                  [String(products.length), "Catalogue items"],
                  [String(rentalItems.length), "Rental fleet classes"],
                ].map(([n, label]) => (
                  <div key={label}>
                    <dt className="font-display text-4xl font-semibold text-paper">{n}</dt>
                    <dd className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist">{label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <figure className="relative">
                <span className="absolute -left-3 top-4 bottom-4 w-2.5 hazard z-10" aria-hidden="true" />
                <div className="overflow-hidden border border-steel-3 bg-steel">
                  <img
                    src={IMG.hero}
                    alt="Industrial power tools arranged on a steel workbench"
                    className="aspect-[4/3] w-full object-cover"
                    width={1600}
                    height={1100}
                    fetchPriority="high"
                  />
                </div>
                <figcaption className="absolute -bottom-6 left-6 border border-steel-3 bg-ink px-4 py-3 shadow-[8px_8px_0_rgba(0,0,0,0.35)]">
                  <p className="font-display text-xl font-semibold uppercase tracking-[0.04em] text-paper">
                    Supply · Rental · Service
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
                    One counter for contractors
                  </p>
                </figcaption>
                <span className="absolute -top-4 right-6 bg-safety px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper">
                  B2B · Oman-wide
                </span>
              </figure>
            </Reveal>
          </div>
        </div>
        <div className="hazard h-2.5" aria-hidden="true" />
      </section>

      {/* ── 2 · CATEGORIES ───────────────────────────────────────── */}
      <section className="grid-light bg-paper py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            index="01"
            title="Product & Equipment Divisions"
            lead="Seven supply divisions cover the tools, equipment and machinery an industrial operation runs on."
            right={
              <CTAButton to="/products" variant="outlineDark" className="h-10 px-4 text-[15px]">
                Full catalogue <IcArrowRight width={16} height={16} />
              </CTAButton>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => {
              const isRental = c.slug === "rental-equipment";
              const count = isRental ? rentalItems.length : products.filter((pr) => pr.category === c.slug).length;
              return (
                <Reveal key={c.slug} delay={i * 60}>
                  <Link
                    to={isRental ? "/rental" : `/products?cat=${c.slug}`}
                    className="card-hard group block h-full overflow-hidden"
                  >
                    <div className="relative h-40 overflow-hidden bg-paper-2">
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                      />
                      <span className="absolute left-3 top-3 bg-ink/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-col p-4">
                      <div className="flex items-center gap-2.5 text-safety">
                        {categoryIcon(c.icon, { width: 22, height: 22 })}
                        <h3 className="font-display text-2xl font-semibold uppercase tracking-[0.01em] text-ink">
                          {c.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-smoke line-clamp-2">{c.blurb}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                        <span className="text-smoke">
                          {count} {isRental ? "fleet classes" : "items"}
                        </span>
                        <IcArrowUpRight
                          width={16}
                          height={16}
                          className="text-safety transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
            <Reveal delay={7 * 60}>
              <div className="card-steel group flex h-full flex-col justify-between bg-steel p-5">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-caution">Sourcing request</p>
                  <p className="mt-3 font-display text-2xl font-semibold uppercase leading-tight text-paper">
                    Need something not listed?
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    We source equipment and spare parts beyond the published catalogue.
                  </p>
                </div>
                <CTAButton to="/request-quote" variant="safety" className="mt-5 h-10 text-[15px]">
                  Request a Quote <IcArrowRight width={16} height={16} />
                </CTAButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3 · FEATURED BRANDS ──────────────────────────────────── */}
      <section className="bg-coal grid-dark py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            dark
            index="02"
            title="Featured Brands"
            lead="Power tools, safety equipment and motors & pumps from the brands contractors ask for by name."
            right={
              <CTAButton to="/brands" variant="outlineLight" className="h-10 px-4 text-[15px]">
                All brands <IcArrowRight width={16} height={16} />
              </CTAButton>
            }
          />
        </div>
        <Marquee items={brands.map((b) => b.name)} />
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4">
          {brands.map((b, i) => (
            <Reveal key={b.slug} delay={(i % 4) * 70}>
              <Link to={`/brands/${b.slug}`} className="card-steel group flex h-full flex-col p-5">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center border border-steel-3 font-display text-xl font-semibold text-caution transition-colors group-hover:border-safety group-hover:text-safety">
                    {b.monogram}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist">
                    {products.filter((pr) => pr.brandSlug === b.slug).length || "—"} items
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold uppercase text-paper transition-colors group-hover:text-safety">
                  {b.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
                  {b.divisions.join(" · ")}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-7xl px-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mist/70 sm:px-6">
          Brand names are trademarks of their respective owners.
        </p>
      </section>

      {/* ── 4 · FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="bg-paper py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            index="03"
            title="Featured Products"
            lead="A working selection from the catalogue. Every item is quoted with real pricing and availability."
            right={
              <CTAButton to="/products" variant="outlineDark" className="h-10 px-4 text-[15px]">
                View catalogue <IcArrowRight width={16} height={16} />
              </CTAButton>
            }
          />
          {featured === null ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-ink/10 bg-card">
                  <div className="skel aspect-[4/3]" />
                  <div className="space-y-3 p-4">
                    <div className="skel h-4 w-2/3" />
                    <div className="skel h-3 w-full" />
                    <div className="skel h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.slice(0, 8).map((pr, i) => (
                <Reveal key={pr.slug} delay={(i % 4) * 70}>
                  <ProductCard product={pr} index={i} />
                </Reveal>
              ))}
            </div>
          )}
          <Reveal>
            <p className="mt-8 flex items-center gap-3 border border-dashed border-ink/25 bg-paper-2/60 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-smoke">
              <span className="h-2 w-2 shrink-0 bg-caution" />
              No public prices are shown until verified — pricing is quoted per order in OMR.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 5 · RENTAL ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-steel py-20 md:py-24">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-6 select-none font-display text-[180px] font-bold uppercase leading-none text-paper/[0.04]"
        >
          RENTAL
        </span>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-safety">
                <span className="mr-2 inline-block h-2 w-2 bg-safety" /> 04 / Rental division
              </p>
              <h2 className="font-display text-4xl font-semibold uppercase leading-[0.98] text-paper md:text-6xl">
                Machinery &amp; Equipment Rental
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-mist">
                Rent by the day, week or month. Rates are quoted per project — duration, location and site conditions
                all matter, so every rental gets a real quotation.
              </p>
              <div className="mt-8">
                {[
                  ["Machinery Rental", "Excavators, loaders and plant", "Heavy Machinery"],
                  ["Equipment Rental", "Generators, welding sets, compressors", "Generators"],
                  ["Power Tool Rental", "Breakers, grinders and site tools", "Power Tools"],
                ].map(([name, sub, cat]) => (
                  <Link
                    key={name}
                    to={`/rental?cat=${encodeURIComponent(cat)}`}
                    className="group flex items-center justify-between gap-4 border-b border-white/10 py-4 transition-colors hover:border-safety"
                  >
                    <div>
                      <p className="font-display text-2xl font-semibold uppercase text-paper transition-colors group-hover:text-safety">
                        {name}
                      </p>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-mist">{sub}</p>
                    </div>
                    <IcArrowRight
                      width={20}
                      height={20}
                      className="shrink-0 text-mist transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-safety"
                    />
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton to="/rental" variant="safety">
                  Explore rental fleet <IcArrowRight width={18} height={18} />
                </CTAButton>
                <CTAButton to="/request-quote?intent=rental" variant="outlineLight">
                  Request rental quote
                </CTAButton>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <figure className="relative">
              <div className="overflow-hidden border border-steel-3">
                <img
                  src={IMG.machinery}
                  alt="Excavator working on a construction site in Oman"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              </div>
              <span className="hazard-thin absolute inset-x-0 bottom-0 h-2" aria-hidden="true" />
              <figcaption className="absolute left-4 top-4 bg-ink/90 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-caution">
                Rates quoted per project
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── 6 · SERVICES ─────────────────────────────────────────── */}
      <section className="grid-light bg-paper py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            index="05"
            title="Repair & Maintenance Services"
            lead="Keep equipment earning. Repairs, planned maintenance, field visits and spare parts — arranged through one counter."
            right={
              <CTAButton to="/services" variant="outlineDark" className="h-10 px-4 text-[15px]">
                All services <IcArrowRight width={16} height={16} />
              </CTAButton>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map(
              (s, i) =>
                s && (
                  <Reveal key={s.slug} delay={i * 80}>
                    <Link to={`/services/${s.slug}`} className="card-hard group flex h-full flex-col p-5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-safety">
                        S-{String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-3 font-display text-2xl font-semibold uppercase leading-tight transition-colors group-hover:text-safety">
                        {s.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-smoke">{s.tagline}</p>
                      <span className="mt-auto flex items-center gap-2 border-t border-ink/10 pt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-safety">
                        Details
                        <IcArrowRight width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                ),
            )}
          </div>
        </div>
      </section>

      {/* ── 7 · WHY CHOOSE ───────────────────────────────────────── */}
      <section className="bg-coal grid-dark py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            dark
            index="06"
            title={`Why Businesses Work With ${business.name}`}
            lead="Facts about how we operate — not slogans. Anything we cannot verify, we do not claim."
          />
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <IcTag width={24} height={24} />,
                title: "Quote-based pricing",
                body: "Every price is confirmed per order in OMR — real pricing, real availability, no invented figures on this site.",
              },
              {
                icon: <IcBolt width={24} height={24} />,
                title: "Supply, rental & service",
                body: "Equipment supply, machinery rental, repair and maintenance handled through one point of contact.",
              },
              {
                icon: <IcTruck width={24} height={24} />,
                title: "Oman-wide reach",
                body: "Serving contractors, workshops and industrial businesses across the Sultanate, with field service on site.",
              },
              {
                icon: <IcShield width={24} height={24} />,
                title: "Brands supplied by name",
                body: "Bosch, Makita, DeWalt, Stanley, Dongcheng, Texmo and more — sourced through verified channels.",
              },
              {
                icon: <IcFileCheck width={24} height={24} />,
                title: "Verified before publishing",
                body: "Catalogue data is checked against manufacturer information before it is treated as confirmed.",
              },
              {
                icon: <IcGear width={24} height={24} />,
                title: "Growing with your site",
                body: "Expanding into heavy machinery, rental fleets, preventive maintenance and B2B supply contracts.",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 80}>
                <div className="group h-full bg-coal p-6 transition-colors hover:bg-steel md:p-8">
                  <span className="inline-grid h-12 w-12 place-items-center border border-steel-3 text-safety transition-colors group-hover:border-safety">
                    {f.icon}
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold uppercase text-paper">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 border border-dashed border-caution/40 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-caution">
              Honesty policy — prices, stock, certifications, warranties and dealer status are confirmed per quotation,
              never invented on this website.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 8 · WHATSAPP CTA ─────────────────────────────────────── */}
      <section className="bg-wa py-14">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
          <Reveal>
            <div>
              <h2 className="font-display text-4xl font-semibold uppercase text-white md:text-5xl">
                Talk to us on WhatsApp
              </h2>
              <p className="mt-2 max-w-xl text-white/85">
                Fast answers on pricing, availability and rental from {business.name} — send the product name and model,
                we take it from there.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <CTAButton href={waHref(waGeneralMessage())} variant="dark" className="h-12 px-7 text-lg">
              <IcWhatsApp width={22} height={22} /> Open WhatsApp chat
            </CTAButton>
          </Reveal>
        </div>
      </section>

      {/* ── 9 · PHONE CTA ────────────────────────────────────────── */}
      <section className="bg-ink py-14 text-paper">
        <div className="hazard h-2.5" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mist">
              <span className="mr-2 inline-block h-2 w-2 bg-safety" /> Prefer to call?
            </p>
            <a
              href={telHref}
              className="mt-3 block font-display text-4xl font-semibold uppercase tracking-[0.02em] transition-colors hover:text-safety md:text-6xl"
            >
              {business.phone}
            </a>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
              Official {business.country} business line · {business.hours}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <CTAButton href={telHref} variant="safety">
              <IcPhone /> Call now
            </CTAButton>
            <CTAButton to="/contact" variant="outlineLight">
              Contact details
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ── 10 · LOCATION ────────────────────────────────────────── */}
      <section className="grid-light bg-paper py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            index="07"
            title="Find Us in Oman"
            lead="Counter, workshop and dispatch — details are published here as soon as each one is verified."
          />
          <div className="grid gap-8 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <div className="card-hard flex h-full flex-col gap-5 p-6">
                {[
                  { icon: <IcPin width={20} height={20} />, label: "Address", value: `${business.addressLine1}, ${business.addressLine2}`, pending: true },
                  { icon: <IcClock width={20} height={20} />, label: "Opening hours", value: business.hours, pending: true },
                  { icon: <IcMail width={20} height={20} />, label: "Email", value: business.email, pending: true },
                  { icon: <IcWhatsApp width={20} height={20} />, label: "WhatsApp", value: business.phone, pending: true },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-4 border-b border-ink/10 pb-4 last:border-0 last:pb-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center bg-ink text-safety">{row.icon}</span>
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-smoke">{row.label}</p>
                      <p className="mt-1 text-[15px] font-medium text-ink">{row.value}</p>
                      {row.pending && (
                        <span className="mt-1.5 inline-block border border-dashed border-caution/60 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-caution">
                          Pending verification
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-auto flex flex-wrap gap-3">
                  <CTAButton to="/contact" variant="dark" className="h-10 px-4 text-[15px]">
                    Contact page <IcArrowRight width={16} height={16} />
                  </CTAButton>
                  <CTAButton to="/request-quote" variant="outlineDark" className="h-10 px-4 text-[15px]">
                    Request quote
                  </CTAButton>
                </div>
              </div>
            </Reveal>
            <Reveal delay={140} className="lg:col-span-3">
              <div className="h-full border border-ink/15 bg-card p-2">
                <iframe
                  src={business.googleMapsEmbedUrl}
                  title="Map — Muscat, Oman"
                  loading="lazy"
                  className="h-[320px] w-full border-0 grayscale-[35%] md:h-[420px]"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <p className="px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-smoke">
                  Map shows Muscat, Oman — the exact location is embedded once the registered address is verified.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

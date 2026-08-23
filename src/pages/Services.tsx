import { Link, useParams } from "react-router-dom";
import { business } from "../lib/business";
import { waHref, waServiceMessage } from "../lib/whatsapp";
import { usePageMeta, siteTitle } from "../lib/seo";
import { services, getService } from "../lib/data/services";
import { Reveal, CTAButton, PageHeader, HazardBar } from "../components/kit";
import { IcArrowRight, IcWhatsApp, IcCheck } from "../components/icons";

const ctaTarget = (cta: "repair" | "maintenance" | "quote") =>
  cta === "quote" ? "/request-quote" : cta === "maintenance" ? "/repair?intent=maintenance" : "/repair";

const ctaLabel = (cta: "repair" | "maintenance" | "quote", name: string) =>
  cta === "quote" ? "Request spare parts quote" : cta === "maintenance" ? "Request maintenance" : "Request repair";

export function ServicesPage() {
  usePageMeta({
    title: siteTitle("Repair & Maintenance Services"),
    description:
      "Equipment repair, power tool repair, preventive maintenance, machinery maintenance, field service and spare parts in Oman — from Al Safwa Trading.",
    path: "/services",
  });

  return (
    <>
      <PageHeader
        crumb="Services"
        title="Repair & Maintenance Services"
        lead="Equipment that works is equipment that earns. Six service lines keep your tools, plant and machinery in service across Oman."
        ghost="SVC"
      />
      <section className="grid-light bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div>
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 50}>
                <Link
                  to={`/services/${s.slug}`}
                  className="group -mx-4 grid items-center gap-4 border-t border-ink/15 px-4 py-7 transition-colors last:border-b hover:bg-card sm:mx-0 sm:px-5 md:grid-cols-[90px_1fr_auto]"
                >
                  <span className="font-mono text-sm uppercase tracking-[0.18em] text-smoke">
                    S-{String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-3xl font-semibold uppercase leading-tight transition-colors group-hover:text-safety md:text-4xl">
                      {s.name}
                    </span>
                    <span className="mt-1 block text-smoke">{s.tagline}</span>
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-safety">
                    Open details
                    <IcArrowRight width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="card-steel h-full bg-steel p-6 md:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-caution">Broken equipment?</p>
                <h2 className="mt-3 font-display text-3xl font-semibold uppercase text-paper">Send a repair request</h2>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  Equipment, brand, model and the fault — the workshop responds with a diagnosis quote.
                </p>
                <CTAButton to="/repair" variant="safety" className="mt-5">
                  Request repair <IcArrowRight width={16} height={16} />
                </CTAButton>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card-steel h-full bg-steel p-6 md:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-caution">Plan the upkeep?</p>
                <h2 className="mt-3 font-display text-3xl font-semibold uppercase text-paper">
                  Arrange a maintenance plan
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  Scheduled inspections and servicing for tools, motors, pumps and plant.
                </p>
                <CTAButton to="/repair?intent=maintenance" variant="outlineLight" className="mt-5">
                  Request maintenance <IcArrowRight width={16} height={16} />
                </CTAButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

export function ServiceDetailPage() {
  const { slug } = useParams();
  const service = slug ? getService(slug) : undefined;

  usePageMeta({
    title: siteTitle(service?.name ?? "Service"),
    description: service
      ? `${service.name} in Oman — ${service.tagline} Arranged through ${business.name}.`
      : `Services from ${business.name}, Oman.`,
    path: `/services/${slug ?? ""}`,
  });

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-5xl font-semibold uppercase">Service not found</h1>
        <p className="mt-4 text-smoke">That service page is not in the current list.</p>
        <CTAButton to="/services" variant="dark" className="mt-8">
          All services
        </CTAButton>
      </div>
    );
  }

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 5);

  return (
    <>
      <section className="relative overflow-hidden bg-coal grid-dark">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-18">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-mist">
            <Link to="/" className="hover:text-safety">Home</Link>
            <span className="mx-2 text-safety">/</span>
            <Link to="/services" className="hover:text-safety">Services</Link>
            <span className="mx-2 text-safety">/</span>
            <span className="text-safety">{service.name}</span>
          </p>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="font-display text-5xl font-semibold uppercase leading-[0.95] text-paper md:text-7xl">
                {service.name}
              </h1>
              <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.16em] text-caution">{service.tagline}</p>
              <p className="mt-5 max-w-xl leading-relaxed text-mist">{service.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton to={ctaTarget(service.cta)} variant="safety">
                  {ctaLabel(service.cta, service.name)} <IcArrowRight width={16} height={16} />
                </CTAButton>
                <CTAButton href={waHref(waServiceMessage(service.name))} variant="wa">
                  <IcWhatsApp /> WhatsApp
                </CTAButton>
              </div>
            </div>
            <figure className="relative">
              <span className="absolute -left-3 top-4 bottom-4 z-10 w-2.5 hazard" aria-hidden="true" />
              <div className="overflow-hidden border border-steel-3">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </figure>
          </div>
        </div>
        <HazardBar className="h-2" />
      </section>

      <section className="grid-light bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <h2 className="flex items-center gap-3 font-display text-3xl font-semibold uppercase">
                  <span className="h-2.5 w-2.5 bg-safety" /> What’s covered
                </h2>
                <ul className="mt-6 space-y-3">
                  {service.scope.map((item) => (
                    <li key={item} className="flex items-start gap-3 border-b border-ink/10 pb-3">
                      <IcCheck width={18} height={18} className="mt-0.5 shrink-0 text-safety" />
                      <span className="text-[15px] text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <h2 className="flex items-center gap-3 font-display text-3xl font-semibold uppercase">
                  <span className="h-2.5 w-2.5 bg-safety" /> How it works
                </h2>
                <ol className="mt-6 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2">
                  {service.process.map((step, i) => (
                    <li key={step.title} className="bg-card p-5">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-safety">
                        Step 0{i + 1}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-semibold uppercase">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-smoke">{step.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ink py-14">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
          <div>
            <h2 className="font-display text-4xl font-semibold uppercase text-paper">
              Need {service.name.toLowerCase()} now?
            </h2>
            <p className="mt-1 text-mist">Send the details — {business.name} responds with the next step.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTAButton to={ctaTarget(service.cta)} variant="safety">
              {ctaLabel(service.cta, service.name)}
            </CTAButton>
            <CTAButton href={waHref(waServiceMessage(service.name))} variant="outlineLight">
              <IcWhatsApp /> WhatsApp
            </CTAButton>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-2/60 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">Other service lines</p>
          <div className="flex flex-wrap gap-2.5">
            {others.map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="border border-ink/25 px-4 py-2.5 font-display text-[16px] uppercase tracking-[0.06em] transition-colors hover:border-safety hover:bg-safety hover:text-paper"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

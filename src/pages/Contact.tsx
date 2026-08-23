import { business, telHref, mailHref } from "../lib/business";
import { waHref, waGeneralMessage } from "../lib/whatsapp";
import { usePageMeta, siteTitle } from "../lib/seo";
import { CTAButton, PageHeader, Reveal } from "../components/kit";
import { IcPhone, IcWhatsApp, IcMail, IcPin, IcClock, IcArrowUpRight } from "../components/icons";
import type { ReactNode } from "react";

export default function ContactPage() {
  usePageMeta({
    title: siteTitle("Contact"),
    description: `Contact ${business.name} in Oman — phone, WhatsApp, email, address and opening hours. Request quotes, rental and repair support.`,
    path: "/contact",
  });

  const waDisplay = `+${business.whatsappNumber.replace(/\D/g, "")}`;

  const cards: { icon: ReactNode; label: string; value: string; sub?: string; href?: string; external?: boolean }[] = [
    { icon: <IcPhone width={20} height={20} />, label: "Business phone", value: business.phone, sub: "Official Oman line", href: telHref },
    { icon: <IcWhatsApp width={20} height={20} />, label: "WhatsApp", value: waDisplay, sub: "Fastest for quotes", href: waHref(waGeneralMessage()), external: true },
    { icon: <IcMail width={20} height={20} />, label: "Email", value: business.email, sub: "Written quotations", href: mailHref },
    { icon: <IcPin width={20} height={20} />, label: "Address", value: business.addressLine1, sub: business.addressLine2 },
    { icon: <IcClock width={20} height={20} />, label: "Opening hours", value: business.hours },
    {
      icon: <IcArrowUpRight width={20} height={20} />,
      label: "Google Maps",
      value: "Open map",
      sub: "Exact location once verified",
      href: business.googleMapsUrl || "https://maps.google.com/?q=Muscat,Oman",
      external: true,
    },
  ];

  return (
    <>
      <PageHeader
        crumb="Contact"
        title={`Contact ${business.name}`}
        lead="Quotes, rental, repair and maintenance — every conversation starts here. Placeholder details are replaced as each one is officially verified."
        ghost="TEL"
      />

      <section className="grid-light bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={(i % 3) * 80}>
                <div className="card-hard flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center bg-ink text-safety">{c.icon}</span>
                    <PendingTag />
                  </div>
                  <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-smoke">{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-1.5 font-display text-2xl font-semibold uppercase leading-tight transition-colors hover:text-safety"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1.5 font-display text-2xl font-semibold uppercase leading-tight">{c.value}</p>
                  )}
                  {c.sub && <p className="mt-1.5 text-sm text-smoke">{c.sub}</p>}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 border border-ink/15 bg-card p-2">
              <iframe
                src={business.googleMapsEmbedUrl}
                title="Map — Muscat, Oman"
                loading="lazy"
                className="h-[340px] w-full border-0 grayscale-[35%] md:h-[440px]"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-smoke">
                Map shows Muscat, Oman — the exact {business.name} location is embedded once the registered address is
                verified.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 bg-ink p-6 md:p-8">
              <div>
                <h2 className="font-display text-3xl font-semibold uppercase text-paper">
                  Start with a quote request
                </h2>
                <p className="mt-1 text-mist">Product, quantity and location — we respond with real pricing.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CTAButton to="/request-quote" variant="safety">
                  Request a quote
                </CTAButton>
                <CTAButton href={waHref(waGeneralMessage())} variant="wa">
                  <IcWhatsApp /> WhatsApp
                </CTAButton>
                <CTAButton href={telHref} variant="outlineLight">
                  <IcPhone /> Call
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function PendingTag() {
  if (!business.placeholdersPending) return null;
  return (
    <span className="border border-dashed border-caution/60 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-caution">
      Pending verification
    </span>
  );
}

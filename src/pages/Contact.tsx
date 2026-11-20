import { business, telHref, mailHref } from "../lib/business";
import { waHref, waGeneralMessage } from "../lib/whatsapp";
import { usePageMeta, siteTitle } from "../lib/seo";
import { CTAButton, PageHeader, Reveal } from "../components/kit";
import { IcPhone, IcWhatsApp, IcMail, IcPin, IcClock, IcArrowUpRight } from "../components/icons";
import type { ReactNode } from "react";

export default function ContactPage() {
  usePageMeta({
    title: siteTitle("Contact"),
    description: `Contact ${business.name} in Nizwa, Sinaya, Oman by phone or WhatsApp, or find our shop using its Google Maps location. Request quotes, rental and repair support.`,
    path: "/contact",
  });

  const waDisplay = `+${business.whatsappNumber.replace(/\\D/g, "")}`;

  const cards: { icon: ReactNode; label: string; value: string; sub?: string; href?: string; external?: boolean }[] = [
    { icon: <IcPhone width={20} height={20} />, label: "Business phone", value: business.phone, sub: "Primary shop contact", href: telHref },
    { icon: <IcWhatsApp width={20} height={20} />, label: "WhatsApp", value: waDisplay, sub: "WhatsApp enquiries", href: waHref(waGeneralMessage()), external: true },
    ...(business.email ? [{ icon: <IcMail width={20} height={20} />, label: "Email", value: business.email, sub: "Written quotations", href: mailHref }] : []),
    { icon: <IcPin width={20} height={20} />, label: "Address", value: business.addressLine1, sub: business.addressLine2 },
    { icon: <IcClock width={20} height={20} />, label: "Opening hours", value: business.hours },
    {
      icon: <IcArrowUpRight width={20} height={20} />,
      label: "Google Maps",
      value: "Open verified shop location",
      sub: "Nizwa, Sinaya — RGVW+9WM",
      href: business.googleMapsUrl,
      external: true,
    },
  ];

  return (
    <>
      <PageHeader
        crumb="Contact"
        title={`Contact ${business.name}`}
        lead="Quotes, rental, repair and maintenance — contact our team by phone or WhatsApp, or find our shop in Nizwa, Sinaya."
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
                title="Al Safwa Trading — verified Google Maps location, Nizwa Sinaya, Oman"
                loading="lazy"
                className="h-[340px] w-full border-0 grayscale-[35%] md:h-[440px]"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-smoke">
                Shop location: RGVW+9WM, Nizwa, Sinaya, Al Dakhiliyah Governorate, Oman.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12 flex flex-wrap items-center justify-between gap-6 bg-ink p-6 md:p-8">
              <div>
                <h2 className="font-display text-3xl font-semibold uppercase text-paper">Start with a quote request</h2>
                <p className="mt-1 text-mist">Product, quantity and location — we respond with real pricing.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CTAButton to="/request-quote" variant="safety">Request a quote</CTAButton>
                <CTAButton href={waHref(waGeneralMessage())} variant="wa"><IcWhatsApp /> WhatsApp</CTAButton>
                <CTAButton href={telHref} variant="outlineLight"><IcPhone /> Call</CTAButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

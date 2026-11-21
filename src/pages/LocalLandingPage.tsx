import { Link } from "react-router-dom";
import { business, telHref } from "../lib/business";
import { waHref, waGeneralMessage } from "../lib/whatsapp";
import { categories } from "../lib/data/categories";
import { services } from "../lib/data/services";
import { usePageMeta, siteTitle } from "../lib/seo";
import { PageHeader, CTAButton } from "../components/kit";
import { IcPhone, IcWhatsApp } from "../components/icons";

export default function LocalLandingPage({ locale = "en" }: { locale?: "en" | "ar" }) {
  const arabic = locale === "ar";
  const prefix = arabic ? "/ar" : "";
  usePageMeta({
    title: siteTitle(arabic ? "الأدوات والمعدات الصناعية في نزوى" : "Industrial Tools in Nizwa"),
    description: arabic
      ? "الصفوة للتجارة في الصناعية، نزوى، سلطنة عُمان. تصفح الأدوات والمعدات واطلب عرض سعر."
      : "Find industrial tools and equipment listed by Al Safwa Trading in Nizwa, Sinaya, Oman. Browse the catalogue and request pricing and availability.",
    path: arabic ? "/ar/industrial-tools-nizwa" : "/industrial-tools-nizwa",
  });
  const divisions = categories.filter((category) => category.slug !== "rental-equipment");

  return (
    <>
      <PageHeader
        crumb={arabic ? "نزوى · سلطنة عُمان" : "Nizwa · Oman"}
        title={arabic ? "الأدوات والمعدات الصناعية في نزوى" : "Industrial Tools & Equipment in Nizwa, Oman"}
        lead={arabic ? "تصفح كتالوج الصفوة للتجارة في الصناعية، نزوى. استفسر عن الأدوات الكهربائية واليدوية ومعدات السلامة والمحركات والمضخات وقطع الغيار." : "Browse Al Safwa Trading listed products from its shop locality in Nizwa, Sinaya. Enquire about power tools, hand tools, safety equipment, motors, pumps and spare parts."}
        ghost="NIZWA"
      />
      <section className="grid-light bg-paper py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div className="border border-ink/15 bg-card p-6 md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-safety">{business.name} · {business.country}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold uppercase">{arabic ? "الكتالوج وطلبات الأسعار" : "Catalogue & quotation enquiries"}</h2>
              <p className="mt-4 leading-relaxed text-smoke">{arabic ? "المنتجات المعروضة في الموقع هي عناصر كتالوج وليست تأكيداً للمخزون. يرجى التواصل لتأكيد السعر والتوافر والمواصفات المناسبة للموديل المحدد." : "Website listings are catalogue items, not a live stock guarantee. Contact the shop to confirm current pricing, availability and suitability against the exact model before ordering."}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <CTAButton to={prefix + "/products/"} variant="safety">{arabic ? "تصفح المنتجات" : "Browse products"}</CTAButton>
                <CTAButton to={prefix + "/request-quote/"} variant="dark">{arabic ? "طلب عرض سعر" : "Request a quote"}</CTAButton>
                <CTAButton href={waHref(waGeneralMessage())} variant="wa"><IcWhatsApp /> WhatsApp</CTAButton>
                <CTAButton href={telHref} variant="outlineDark"><IcPhone /> {arabic ? "اتصل بالمتجر" : "Call the shop"}</CTAButton>
              </div>
            </div>
            <aside className="border border-ink/15 bg-card p-6">
              <h2 className="font-display text-2xl font-semibold uppercase">{arabic ? "موقع المتجر" : "Shop location"}</h2>
              <p className="mt-3 font-medium">{business.addressLine1}</p>
              <p className="text-sm text-smoke">{business.addressLine2}</p>
              <a href={business.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex border-b border-safety pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-safety">{arabic ? "افتح الموقع على خرائط Google" : "Open shop location in Google Maps"}</a>
              <p className="mt-5 border-t border-ink/10 pt-4 text-xs text-smoke">{arabic ? "يتم تأكيد السعر والتوافر وساعات العمل الحالية بالتواصل المباشر." : "Current pricing, availability and opening hours are confirmed directly with the shop."}</p>
            </aside>
          </div>
          <div className="mt-14">
            <h2 className="font-display text-3xl font-semibold uppercase">{arabic ? "أقسام المنتجات" : "Product divisions"}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {divisions.map((category) => <Link key={category.slug} to={prefix + "/products/?cat=" + category.slug} className="border border-ink/15 bg-card p-5 transition-colors hover:border-safety"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-safety">{category.name}</span><p className="mt-2 font-display text-xl font-semibold uppercase">{arabic ? "تصفح المنتجات" : "Browse listed products"}</p></Link>)}
            </div>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold uppercase">{arabic ? "خدمات المعدات" : "Equipment services"}</h2>
              <ul className="mt-4 space-y-2 text-sm text-smoke">{services.map((service) => <li key={service.slug}><Link className="underline decoration-safety underline-offset-4 hover:text-safety" to={prefix + "/services/" + service.slug + "/"}>{service.name}</Link></li>)}</ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold uppercase">{arabic ? "استفسارات مباشرة" : "Explore and enquire"}</h2>
              <p className="mt-3 text-sm leading-relaxed text-smoke">{arabic ? "حدد المنتج والموديل والكمية المطلوبة لتسهيل الرد على استفسارك." : "Include product name, model number and quantity so the team can respond with the right quotation."}</p>
              <Link to={prefix + "/catalogue-qr/"} className="mt-4 inline-flex border border-ink/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] hover:border-safety hover:text-safety">{arabic ? "مشاركة الكتالوج عبر رمز QR" : "Share the catalogue QR"}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
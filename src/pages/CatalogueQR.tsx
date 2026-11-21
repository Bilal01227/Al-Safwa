import { business } from "../lib/business";
import { usePageMeta, siteTitle } from "../lib/seo";
import { PageHeader, CTAButton } from "../components/kit";

export default function CatalogueQRPage({ locale = "en" }: { locale?: "en" | "ar" }) {
  const arabic = locale === "ar";
  usePageMeta({
    title: siteTitle(arabic ? "رمز QR لكتالوج المنتجات" : "Product Catalogue QR Code"),
    description: arabic
      ? "امسح رمز QR لفتح كتالوج الأدوات والمعدات الصناعية لدى الصفوة للتجارة في سلطنة عُمان."
      : "Scan the Al Safwa Trading QR code to open the industrial tools and equipment catalogue in Oman.",
    path: arabic ? "/ar/catalogue-qr" : "/catalogue-qr",
  });

  return (
    <>
      <PageHeader
        crumb={arabic ? "كتالوج QR" : "Catalogue QR"}
        title={arabic ? "افتح الكتالوج بالمسح" : "Scan. Browse. Enquire."}
        lead={arabic ? "امسح الرمز بكاميرا هاتفك لفتح كتالوج المنتجات الصناعية. يمكنك حفظ الرمز أو طباعته." : "Scan this code with a phone camera to open the live product catalogue. Save it or print it for your counter, workshop or customer desk."}
        ghost="QR"
      />
      <section className="grid-light bg-paper py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[1fr_340px]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-safety">{business.name} · {business.country}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold uppercase">{arabic ? "الكتالوج الصناعي" : "The product catalogue"}</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-smoke">{arabic ? "تصفح المنتجات والعلامات التجارية المدرجة، ثم أرسل رقم الموديل والكمية المطلوبة لطلب السعر والتوافر. يتم تأكيد الأسعار والتوافر مباشرة من المتجر." : "Browse listed products, brands and model references. Send the product name, model and required quantity to request a quotation. Current prices and availability are confirmed directly by the shop."}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <CTAButton to={arabic ? "/ar/products/" : "/products/"} variant="safety">{arabic ? "تصفح الكتالوج" : "Browse catalogue"}</CTAButton>
              <CTAButton to={arabic ? "/ar/contact/" : "/contact/"} variant="outlineDark">{arabic ? "معلومات التواصل" : "Contact the shop"}</CTAButton>
            </div>
            <p className="mt-6 text-xs text-smoke">{arabic ? "يفتح رمز QR الكتالوج الإنجليزي؛ ويمكن تغيير اللغة من قائمة الموقع." : "The QR opens the live English catalogue. Visitors can switch to Arabic using the website language control."}</p>
          </div>
          <div className="print-card mx-auto w-full max-w-[340px] border border-ink/15 bg-white p-6 text-center shadow-[8px_8px_0_rgba(23,27,32,0.08)]">
            <img src="/images/catalogue-qr.svg" alt="QR code for the Al Safwa Trading product catalogue" width="600" height="600" className="mx-auto h-auto w-full max-w-[280px]" />
            <p className="mt-3 font-display text-xl font-semibold uppercase text-ink">AL SAFWA TRADING</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-smoke">Scan to open product catalogue</p>
            <a href="/images/catalogue-qr.svg" download="al-safwa-product-catalogue-qr.svg" className="no-print mt-5 inline-flex border border-ink/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink hover:border-safety hover:text-safety">{arabic ? "تنزيل رمز QR" : "Download QR code"}</a>
            <button type="button" onClick={() => window.print()} className="no-print ml-2 mt-5 inline-flex bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white hover:bg-safety">{arabic ? "طباعة" : "Print"}</button>
          </div>
        </div>
      </section>
    </>
  );
}
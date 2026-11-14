import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LogoMark } from "../components/Layout";
import { categories } from "../lib/data/categories";
import { brands } from "../lib/data/brands";
import { services } from "../lib/data/services";
import { business } from "../lib/business";
import { usePageMeta } from "../lib/seo";

const categoryArabic: Record<string, string> = {
  "power-tools": "الأدوات الكهربائية",
  "heavy-machinery": "الآلات الثقيلة",
  "welding-equipment": "معدات اللحام",
  generators: "المولدات الكهربائية",
  "air-compressors": "ضواغط الهواء",
  "safety-equipment": "معدات السلامة",
  "hand-tools": "الأدوات اليدوية",
  "motors-pumps": "المحركات والمضخات",
  "cutting-tools": "معدات القطع والجلخ",
  "measuring-tools": "أجهزة القياس والفحص",
  "spare-parts": "قطع الغيار",
  "lifting-equipment": "معدات الرفع ومناولة المواد",
  "cleaning-equipment": "معدات التنظيف",
  "electrical-equipment": "المعدات الكهربائية",
  "agricultural-equipment": "المعدات الزراعية",
  "rental-equipment": "معدات التأجير",
};

const serviceArabic: Record<string, string> = {
  "equipment-repair": "إصلاح المعدات",
  "power-tool-repair": "إصلاح الأدوات الكهربائية",
  "preventive-maintenance": "الصيانة الوقائية",
  "machinery-maintenance": "صيانة الآلات",
  "field-service": "الخدمة الميدانية",
  "spare-parts": "توريد قطع الغيار",
};

export default function ArabicHome() {
  usePageMeta({
    title: "الصفوة للتجارة | الأدوات والمعدات والآلات الصناعية في عُمان",
    description: "الصفوة للتجارة في عُمان: توريد الأدوات والمعدات الصناعية، ومستلزمات السلامة والمحركات والمضخات، مع خيارات التأجير والإصلاح والصيانة. تواصل معنا لطلب عرض سعر.",
    path: "/ar",
  });

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDir = root.dir;
    root.lang = "ar-OM";
    root.dir = "rtl";
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://alsafwaoman.com/ar/";
    const alternates = [
      { hreflang: "ar-OM", href: "https://alsafwaoman.com/ar/" },
      { hreflang: "en-OM", href: "https://alsafwaoman.com/" },
      { hreflang: "x-default", href: "https://alsafwaoman.com/" },
    ];
    const added: HTMLLinkElement[] = [];
    alternates.forEach((item) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = item.hreflang;
      link.href = item.href;
      document.head.appendChild(link);
      added.push(link);
    });
    return () => {
      root.lang = previousLang || "en-OM";
      root.dir = previousDir || "ltr";
      added.forEach((link) => link.remove());
    };
  }, []);

  return (
    <div className="arabic-page min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-coal text-paper shadow-lg">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/ar/" className="flex items-center gap-3" aria-label="الصفوة للتجارة - الرئيسية">
            <LogoMark />
            <span className="flex flex-col leading-tight">
              <strong className="font-display text-xl tracking-wide">AL SAFWA</strong>
              <span className="text-[10px] tracking-widest text-mist">TRADING — OMAN</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-mist lg:flex" aria-label="التنقل الرئيسي">
            <a href="#divisions" className="hover:text-white">الأقسام</a>
            <a href="#brands" className="hover:text-white">العلامات التجارية</a>
            <a href="#services" className="hover:text-white">الخدمات</a>
            <a href="#contact" className="hover:text-white">تواصل معنا</a>
          </nav>
          <Link to="/" lang="en" className="shrink-0 border border-white/25 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-safety hover:text-safety">English</Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-coal text-paper">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
            <div>
              <p className="mb-5 text-xs tracking-wide text-mist">مسقط · سلطنة عُمان — التوريد والتأجير والإصلاح</p>
              <h1 className="font-display text-4xl font-bold leading-[1.35] md:text-6xl">
                حلول الأدوات والمعدات والآلات الصناعية في <span className="text-safety">عُمان</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-mist">
                توفر {business.name} خيارات لتوريد الأدوات والمعدات الصناعية ومستلزمات السلامة والمحركات والمضخات، إلى جانب خدمات التأجير والإصلاح والصيانة للمقاولين والورش والمنشآت الصناعية في عُمان.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/request-quote/" className="inline-flex items-center bg-safety px-5 py-3 font-semibold text-white transition hover:bg-safety-deep">اطلب عرض سعر</Link>
                <Link to="/products/" className="inline-flex items-center border border-white/40 px-5 py-3 font-semibold text-white transition hover:border-white">استعرض المنتجات</Link>
              </div>
              <p className="mt-8 text-xs text-mist">تواصل معنا لتأكيد الأسعار والتوافر ومواعيد الخدمة حسب الطلب.</p>
            </div>
            <div className="relative">
              <img src="/images/home-rental-excavator.webp" alt="معدات وآليات صناعية ومعدات مواقع العمل" className="aspect-[4/3] w-full border border-steel-3 object-cover" width="1200" height="900" fetchPriority="high" />
              <div className="absolute bottom-4 right-4 bg-ink/95 px-4 py-3 text-sm font-semibold text-paper">توريد · تأجير · خدمة</div>
            </div>
          </div>
          <div className="hazard h-2.5" />
        </section>

        <section id="divisions" className="grid-light bg-paper py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-safety">01 / الأقسام</p>
                <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">الأدوات والمعدات حسب الفئة</h2>
                <p className="mt-2 max-w-2xl leading-8 text-smoke">تصفح فئات المعدات والمنتجات المتاحة، ثم اطلب معلومات الأسعار والتوافر.</p>
              </div>
              <Link to="/products/" className="border border-ink/25 px-4 py-2 text-sm font-semibold hover:border-safety hover:text-safety">جميع المنتجات ←</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.filter((c) => c.slug !== "rental-equipment").map((c) => (
                <Link key={c.slug} to={`/products/?cat=${c.slug}`} className="card-hard group overflow-hidden">
                  <img src={c.imageUrl} alt={categoryArabic[c.slug] || c.name} loading="lazy" className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="p-4">
                    <h3 className="font-display text-xl font-bold">{categoryArabic[c.slug] || c.name}</h3>
                    <p className="mt-2 text-xs text-smoke">{categoryArabic[c.slug] ? "منتجات ومعدات للاستخدام المهني والصناعي." : c.blurb}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="brands" className="bg-coal py-16 text-paper md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="font-mono text-xs text-safety">02 / العلامات التجارية</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">علامات تجارية للمعدات والأدوات</h2>
            <p className="mt-3 max-w-2xl leading-8 text-mist">تعرّف على العلامات التجارية المدرجة في كتالوج الصفوة للتجارة.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {brands.map((brand) => <Link key={brand.slug} to={`/brands/${brand.slug}/`} className="border border-white/20 px-4 py-3 text-sm text-paper transition hover:border-safety hover:text-safety">{brand.name}</Link>)}
            </div>
            <Link to="/brands/" className="mt-8 inline-flex border border-white/30 px-4 py-2 text-sm hover:border-safety">عرض جميع العلامات التجارية</Link>
          </div>
        </section>

        <section className="grid-light bg-paper py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2">
            <div className="card-hard p-7">
              <p className="font-mono text-xs text-safety">03 / تأجير المعدات</p>
              <h2 className="mt-2 font-display text-3xl font-bold">تأجير المعدات والآليات</h2>
              <p className="mt-3 leading-8 text-smoke">استفسر عن خيارات تأجير معدات المواقع والمولدات وأدوات العمل. يتم تأكيد نوع المعدة والتوافر ومدة التأجير عند تقديم الطلب.</p>
              <Link to="/rental/" className="mt-6 inline-flex bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-safety">استكشف خيارات التأجير</Link>
            </div>
            <div id="services" className="card-hard p-7">
              <p className="font-mono text-xs text-safety">04 / خدمات المعدات</p>
              <h2 className="mt-2 font-display text-3xl font-bold">الإصلاح والصيانة وقطع الغيار</h2>
              <p className="mt-3 leading-8 text-smoke">استكشف خدمات إصلاح المعدات والأدوات الكهربائية والصيانة الوقائية وقطع الغيار، وتواصل معنا لتأكيد نطاق الخدمة قبل الحجز.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {services.map((service) => <Link key={service.slug} to={`/services/${service.slug}/`} className="border border-ink/20 px-3 py-2 text-xs hover:border-safety hover:text-safety">{serviceArabic[service.slug] || service.name}</Link>)}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-ink py-16 text-paper">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-xs text-safety">05 / تواصل معنا</p>
              <h2 className="mt-2 font-display text-3xl font-bold">هل تحتاج إلى معدات أو عرض سعر؟</h2>
              <p className="mt-3 max-w-2xl leading-8 text-mist">أرسل تفاصيل المنتج أو المعدة والكمية وموقع التسليم المطلوب، وسنراجع طلبك ونؤكد المعلومات المتاحة.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/request-quote/" className="bg-safety px-5 py-3 text-sm font-bold text-white hover:bg-safety-deep">طلب عرض سعر</Link>
              <Link to="/contact/" className="border border-white/40 px-5 py-3 text-sm font-bold text-white hover:border-safety">صفحة التواصل</Link>
              <Link to="/" lang="en" className="border border-white/40 px-5 py-3 text-sm font-bold text-white hover:border-safety">English</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-coal py-7 text-center text-xs text-mist">
        © {new Date().getFullYear()} AL SAFWA TRADING — OMAN. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}

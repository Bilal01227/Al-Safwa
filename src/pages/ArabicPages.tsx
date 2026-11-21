import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { business, telHref } from "../lib/business";
import { waHref, waProductMessage, waRentalMessage } from "../lib/whatsapp";
import { usePageMeta, siteTitle } from "../lib/seo";
import { fetchProducts, fetchProductBySlug } from "../lib/data/products";
import { fetchBrands, fetchBrand, getBrandLogoUrl } from "../lib/data/brands";
import { fetchRentalItems } from "../lib/data/rental";
import { categories } from "../lib/data/categories";
import { services } from "../lib/data/services";
import { saveSubmission } from "../lib/submissions";
import type { Product, Brand, RentalItem } from "../lib/types";

const categoryNames: Record<string,string> = {
  "power-tools":"الأدوات الكهربائية","heavy-machinery":"الآلات الثقيلة","welding-equipment":"معدات اللحام",
  "generators":"المولدات","air-compressors":"ضواغط الهواء","safety-equipment":"معدات السلامة",
  "hand-tools":"الأدوات اليدوية","motors-pumps":"المحركات والمضخات","cutting-tools":"معدات القطع والجلخ",
  "measuring-tools":"أجهزة القياس والفحص","spare-parts":"قطع الغيار","lifting-equipment":"معدات الرفع ومناولة المواد",
  "cleaning-equipment":"معدات التنظيف","electrical-equipment":"المعدات الكهربائية","agricultural-equipment":"المعدات الزراعية",
  "rental-equipment":"معدات التأجير"
};
const serviceNames: Record<string,string> = {
  "equipment-repair":"إصلاح المعدات","power-tool-repair":"إصلاح الأدوات الكهربائية",
  "preventive-maintenance":"الصيانة الوقائية","machinery-maintenance":"صيانة الآلات",
  "field-service":"الخدمة الميدانية","spare-parts":"توريد قطع الغيار"
};
const rentalCategoryNames: Record<string,string> = {
  "Heavy Machinery":"الآلات الثقيلة","Construction Equipment":"معدات البناء","Aerial Access":"معدات الوصول المرتفع",
  "Compaction & Roadwork":"معدات الرصف والدمك","Material Handling":"مناولة المواد","Generators & Power":"المولدات والطاقة",
  "Pumps & Water Management":"المضخات وإدارة المياه","Welding & Industrial":"اللحام والمعدات الصناعية",
  "Power Tools":"الأدوات الكهربائية","Compressors":"ضواغط الهواء","Lifting Equipment":"معدات الرفع","Site Equipment":"معدات المواقع"
};
const brandAbout = "تعرّف على المنتجات المدرجة ضمن كتالوج الصفوة للتجارة. يتم تأكيد السعر والمواصفات والتفاصيل الخاصة بكل طلب قبل إصدار عرض السعر.";

function arabicProductDescription(p: Product) {
  const category = categoryNames[p.category] || "المعدات والمنتجات الصناعية";
  const model = p.modelNumber && p.modelNumber !== "—" ? ` ورقم الطراز ${p.modelNumber}` : "";
  return `هذا المنتج من علامة ${p.brand}، ${p.productName}${model}، مدرج ضمن فئة ${category} في كتالوج الصفوة للتجارة. راجع اسم المنتج ورقم الطراز لمطابقة العنصر المطلوب قبل تقديم الطلب. يتم تأكيد المواصفات الفنية الدقيقة والتكوين والملحقات والتوافق والتوفر في سلطنة عُمان قبل إصدار عرض السعر. تواصل معنا مع ذكر رقم الطراز والكمية والاستخدام المطلوب للحصول على عرض مناسب.`;
}
const serviceAbout: Record<string,string> = {
  "equipment-repair":"خدمات فحص وتشخيص وإصلاح المعدات الصناعية، مع تقديم عرض سعر قبل بدء العمل.",
  "power-tool-repair":"فحص وإصلاح المثاقب والمجلخات والمطارق الكهربائية ومعدات القطع.",
  "preventive-maintenance":"خطط صيانة دورية وفحوصات للمساعدة في تقليل الأعطال والتوقف غير المخطط.",
  "machinery-maintenance":"خدمات صيانة للمحركات والمضخات والمولدات والمعدات الميكانيكية والكهربائية.",
  "field-service":"تنسيق خدمات الفحص والإصلاح والصيانة في موقع العميل حسب نطاق العمل.",
  "spare-parts":"توفير قطع الغيار والمواد الاستهلاكية بعد مطابقة النوع ورقم الطراز."
};

function Page({title,lead,children}:{title:string;lead:string;children:ReactNode}) {
  return <div dir="rtl" className="grid-light bg-paper text-ink">
    <header className="bg-coal px-4 py-12 text-paper sm:px-6 md:py-16">
      <div className="mx-auto max-w-7xl"><p className="font-mono text-xs text-safety">الصفوة للتجارة · سلطنة عُمان</p><h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-6xl">{title}</h1><p className="mt-4 max-w-3xl text-base leading-8 text-mist">{lead}</p></div>
    </header>
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14">{children}</div>
  </div>;
}
function PriceLabel(){return <span className="inline-flex border border-safety/30 px-2 py-1 font-mono text-[10px] font-semibold text-safety">تواصل معنا لمعرفة السعر</span>;}
function ProductTile({p}:{p:Product}) {
  return <article className="card-hard overflow-hidden">
    <Link to={`/ar/products/${p.slug}/`} className="block bg-paper-2"><img src={p.imageUrl} alt={p.productName} loading="lazy" className="aspect-[4/3] w-full object-contain" /></Link>
    <div className="space-y-3 p-4"><p className="font-mono text-xs text-safety">{p.brand}</p><h2 className="font-display text-xl font-semibold uppercase"><Link to={`/ar/products/${p.slug}/`}>{p.productName}</Link></h2><p className="text-sm leading-7 text-smoke">{arabicProductDescription(p)}</p><PriceLabel/><div className="flex gap-2"><Link className="flex-1 bg-ink px-3 py-2 text-center text-sm font-semibold text-white hover:bg-safety" to={`/ar/request-quote/?product=${encodeURIComponent(p.productName)}`}>اطلب عرض سعر</Link><a className="grid w-11 place-items-center border border-wa text-wa" href={waHref(waProductMessage(p))} target="_blank" rel="noopener noreferrer" aria-label="استفسار عبر واتساب">واتساب</a></div></div>
  </article>;
}
function RentalTile({r}:{r:RentalItem}) {
  return <article className="card-hard overflow-hidden">
    <div className="bg-paper-2"><img src={r.imageUrl} alt={r.name} loading="lazy" className="aspect-[16/10] w-full object-cover" /></div>
    <div className="space-y-3 p-4"><p className="font-mono text-xs text-safety">{rentalCategoryNames[r.category] || r.category}</p><h2 className="font-display text-xl font-semibold">{r.name}</h2><p className="text-sm leading-7 text-smoke">تواصل معنا لتأكيد تفاصيل المعدة ومدة التأجير ومتطلبات الموقع.</p><PriceLabel/><div className="flex gap-2"><Link className="flex-1 bg-ink px-3 py-2 text-center text-sm font-semibold text-white hover:bg-safety" to={`/ar/request-quote/?intent=rental&product=${encodeURIComponent(r.name)}`}>اطلب عرض تأجير</Link><a className="border border-wa px-3 py-2 text-sm text-wa" href={waHref(waRentalMessage(r))} target="_blank" rel="noopener noreferrer">واتساب</a></div></div>
  </article>;
}

export default function ArabicPages() {
  const location = useLocation();
  const [params] = useSearchParams();
  const segments = location.pathname.replace(/^\/ar\/?/,"").split("/").filter(Boolean);
  const section = segments[0] || "home";
  const slug = segments[1] || "";
  const isProductDetail = section === "products" && !!slug;
  const isBrandDetail = section === "brands" && !!slug;
  const isServiceDetail = section === "services" && !!slug;
  const [products,setProducts] = useState<Product[]>([]);
  const [product,setProduct] = useState<Product | undefined>();
  const [brands,setBrands] = useState<Brand[]>([]);
  const [brand,setBrand] = useState<Brand | undefined>();
  const [rentals,setRentals] = useState<RentalItem[]>([]);
  const [loading,setLoading] = useState(false);
  const [search,setSearch] = useState("");
  const brandFilter = params.get("brand") || "";
  const [category,setCategory] = useState("");
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");
  const [sending,setSending] = useState(false);
  const [form,setForm] = useState<Record<string,string>>({name:"",company:"",phone:"",whatsapp:"",email:"",product:params.get("product")||"",model:params.get("model")||"",quantity:"",location:"",requirement:"",equipment:params.get("product")||"",problem:"",website:"",urgency:"Standard"});
  const isQuote = section === "request-quote";
  const isRental = isQuote && params.get("intent") === "rental";
  const isRepair = section === "repair";
  const service = services.find((s)=>s.slug===slug);

  useEffect(()=>{
    let live=true; setLoading(true);
    const task = section==="products" ? (isProductDetail ? fetchProductBySlug(slug).then((p)=>{if(live)setProduct(p);}) : fetchProducts().then((v)=>{if(live)setProducts(v);}))
      : section==="brands" ? (isBrandDetail ? fetchBrand(slug).then((v)=>{if(live)setBrand(v);}) : fetchBrands().then((v)=>{if(live)setBrands(v);}))
      : section==="rental" ? fetchRentalItems().then((v)=>{if(live)setRentals(v);})
      : Promise.resolve();
    Promise.resolve(task).finally(()=>{if(live)setLoading(false);});
    return ()=>{live=false;};
  },[section,slug,isProductDetail,isBrandDetail]);

  const pageMeta = useMemo(()=>{
    const title = section==="products" ? (isProductDetail
      ? (product ? `${product.productName}${product.modelNumber && product.modelNumber!=="—" ? " — "+product.modelNumber : ""} | تفاصيل المنتج` : "تفاصيل المنتج")
      : "كتالوج المنتجات")
      : section==="brands" ? (isBrandDetail ? brand?.name || "العلامة التجارية" : "العلامات التجارية")
      : section==="rental" ? "تأجير المعدات والآليات"
      : section==="services" ? (isServiceDetail ? serviceNames[slug] || service?.name || "الخدمات" : "خدمات المعدات")
      : isRepair ? "طلب إصلاح أو صيانة" : isQuote ? (isRental ? "طلب عرض سعر للتأجير" : "طلب عرض سعر") : "تواصل معنا";
    const productFacts = product
      ? `${product.brand} ${product.modelNumber && product.modelNumber!=="—" ? product.modelNumber : ""}. ${product.shortDescription || product.description || ""}`
      : "";
    const description = isProductDetail && product
      ? `تفاصيل ${productFacts} من الصفوة للتجارة في عُمان. تواصل معنا لتأكيد السعر والتوفر وطلب عرض سعر.`.replace(/\\s+/g," ").trim().slice(0,300)
      : "الصفوة للتجارة في عُمان. تواصل معنا لمعرفة الأسعار وطلب عرض سعر للمنتجات والمعدات والخدمات.";
    const path = location.pathname.replace(/\/$/,"") || "/ar";
    return {title,description,path};
  },[section,isProductDetail,product,isBrandDetail,brand,isServiceDetail,slug,service,isRepair,isQuote,isRental,location.pathname]);
  usePageMeta({title:siteTitle(pageMeta.title),description:pageMeta.description,path:pageMeta.path});

  const visibleProducts = products.filter((p)=> (!search || `${p.productName} ${p.brand} ${p.modelNumber}`.toLowerCase().includes(search.toLowerCase())) && (!category || p.category===category) && (!brandFilter || p.brand===brandFilter));
  const setField=(key:string,value:string)=>setForm((current)=>({...current,[key]:value}));

  async function submit(event:FormEvent) {
    event.preventDefault(); setError(""); setNotice("");
    if(!form.name.trim() || !form.phone.trim()){setError("يرجى إدخال الاسم ورقم الهاتف.");return;}
    if(isRepair && (!form.equipment.trim() || !form.problem.trim())){setError("يرجى إدخال نوع المعدة ووصف المشكلة.");return;}
    if(!isRepair && (!form.product.trim() || !form.requirement.trim())){setError("يرجى إدخال المنتج أو المعدة ومتطلبات الطلب.");return;}
    setSending(true);
    try {
      const type = isRepair ? "repair" : isRental ? "rental" : "quote";
      const record = await saveSubmission(type,isRepair ? form : {...form,requirement:form.requirement || "يرجى تزويدي بالسعر والتفاصيل."});
      setNotice(`تم استلام طلبك بنجاح. رقم المرجع: ${record.id}`);
    } catch(e) {setError(e instanceof Error ? e.message : "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.");}
    finally {setSending(false);}
  }

  if(section==="products" && !isProductDetail) return <Page title="كتالوج المنتجات" lead="تصفح الأدوات والمعدات والمنتجات الصناعية. تواصل معنا لمعرفة السعر وطلب عرض سعر.">
    <div className="mb-6 grid gap-3 md:grid-cols-[1fr_240px]"><input className="field" value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن منتج أو علامة تجارية..." aria-label="بحث"/><select className="field" value={category} onChange={e=>setCategory(e.target.value)}><option value="">جميع الفئات</option>{categories.filter(c=>c.slug!=="rental-equipment").map(c=><option key={c.slug} value={c.slug}>{categoryNames[c.slug]||c.name}</option>)}</select></div>
    {loading ? <p>جارٍ تحميل المنتجات...</p> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visibleProducts.map(p=><ProductTile key={p.id} p={p}/>)}</div>}
  </Page>;

  if(isProductDetail) return <Page title={product?.productName || "تفاصيل المنتج"} lead={product ? `${product.brand} · ${product.modelNumber && product.modelNumber!=="—" ? product.modelNumber : "منتج صناعي"} · اطلب السعر والتوفر من الصفوة للتجارة.` : "تفاصيل المنتج وطلب السعر من الصفوة للتجارة."}>
    {!product ? <p>{loading?"جارٍ تحميل المنتج...":"لم يتم العثور على هذا المنتج."}</p> : <div className="grid gap-8 md:grid-cols-2"><div className="bg-paper-2"><img src={product.imageUrl} alt={product.productName} className="w-full object-contain"/></div><div><p className="text-safety">{product.brand}</p><h2 className="mt-3 font-display text-3xl font-bold">{product.productName}</h2>{product.modelNumber && product.modelNumber!=="—" && <p className="mt-3 text-sm text-smoke">رقم الطراز: {product.modelNumber}</p>}<p className="mt-5 leading-8 text-smoke">{arabicProductDescription(product)}</p>{product.description && product.description!==product.shortDescription && <div className="mt-5 border-r-2 border-safety pr-4"><p className="mb-2 text-xs font-semibold text-safety">الوصف الفني المتاح في سجل المنتج</p><p dir="ltr" className="text-left leading-7 text-smoke">{product.description}</p></div>}{Object.keys(product.specifications || {}).length>0 && <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10">{Object.entries(product.specifications).map(([label,value])=><div key={label} className="grid grid-cols-2 gap-3 py-3 text-sm"><dt className="text-smoke">{label}</dt><dd className="font-semibold">{value}</dd></div>)}</dl>}<div className="mt-5"><PriceLabel/></div><Link to={`/ar/request-quote/?product=${encodeURIComponent(product.productName)}`} className="mt-6 inline-block bg-safety px-5 py-3 font-semibold text-white">اطلب عرض سعر</Link></div></div>}
  </Page>;

  if(section==="brands" && !isBrandDetail) return <Page title="العلامات التجارية" lead="العلامات التجارية المدرجة في كتالوج الصفوة للتجارة."><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{brands.map(b=><Link key={b.slug} to={`/ar/brands/${b.slug}/`} className="card-hard flex min-h-28 items-center gap-4 p-5"><img src={getBrandLogoUrl(b.logoPath)} alt={b.name} className="h-14 w-20 object-contain"/><span className="font-display text-xl font-semibold">{b.name}</span></Link>)}</div></Page>;
  if(isBrandDetail) return <Page title={brand?.name || "العلامة التجارية"} lead={brandAbout}>{!brand?<p>لم يتم العثور على العلامة التجارية.</p>:<div className="space-y-5"><p className="leading-8 text-smoke">{brandAbout}</p><Link to={`/ar/products/?brand=${encodeURIComponent(brand.name)}`} className="inline-block bg-safety px-5 py-3 font-semibold text-white">عرض المنتجات</Link></div>}</Page>;

  if(section==="rental") return <Page title="تأجير المعدات والآليات" lead="خيارات تأجير المعدات للمشاريع والمواقع والورش. يتم تأكيد تفاصيل المعدة ومدة التأجير والسعر قبل الاتفاق.">
    {loading?<p>جارٍ تحميل المعدات...</p>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rentals.map(r=><RentalTile key={r.id} r={r}/>)}</div>}
  </Page>;

  if(section==="services" && !isServiceDetail) return <Page title="خدمات المعدات" lead="خدمات إصلاح المعدات والصيانة وقطع الغيار والدعم الميداني."><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.map(s=><article key={s.slug} className="card-hard p-5"><h2 className="font-display text-2xl font-bold">{serviceNames[s.slug]||s.name}</h2><p className="mt-3 leading-8 text-smoke">{serviceAbout[s.slug]||"تواصل معنا لمعرفة نطاق الخدمة والتكلفة."}</p><Link to={`/ar/services/${s.slug}/`} className="mt-5 inline-block border border-ink/25 px-4 py-2 text-sm font-semibold">التفاصيل ←</Link></article>)}</div></Page>;
  if(isServiceDetail) return <Page title={serviceNames[slug]||service?.name||"الخدمات"} lead={serviceAbout[slug]||"تواصل معنا لتأكيد نطاق الخدمة."}>{!service?<p>الخدمة غير موجودة.</p>:<div className="grid gap-8 md:grid-cols-2"><img src={service.imageUrl} alt={serviceNames[slug]||service.name} className="w-full object-cover"/><div><p className="leading-8 text-smoke">{serviceAbout[slug]}</p><ul className="mt-5 list-disc space-y-2 pr-5 text-smoke"><li>مراجعة تفاصيل المعدة والطلب</li><li>تأكيد نطاق العمل والتكلفة</li><li>تقديم عرض سعر قبل بدء العمل</li></ul><Link to={service.cta==="repair"?"/ar/repair/":"/ar/request-quote/"} className="mt-6 inline-block bg-safety px-5 py-3 font-semibold text-white">اطلب الخدمة</Link></div></div>}</Page>;

  if(isQuote || isRepair) return <Page title={isRepair?"طلب إصلاح أو صيانة":isRental?"طلب عرض سعر للتأجير":"طلب عرض سعر"} lead="أرسل تفاصيل الطلب وسنتواصل معك لتأكيد السعر والتفاصيل.">
    {notice ? <div className="border border-wa/30 bg-card p-6"><h2 className="font-display text-2xl font-bold">تم استلام الطلب</h2><p className="mt-3 leading-8">{notice}</p><a className="mt-5 inline-block border border-wa px-4 py-2 text-wa" href={waHref()}>التواصل عبر واتساب</a></div> : <form onSubmit={submit} className="grid gap-4 border border-ink/15 bg-card p-5 md:grid-cols-2">
      <input type="text" name="website" value={form.website} onChange={e=>setField("website",e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="pointer-events-none absolute h-0 w-0 opacity-0"/>
      <label className="text-sm">الاسم الكامل *<input required className="field mt-1" value={form.name} onChange={e=>setField("name",e.target.value)}/></label>
      <label className="text-sm">الشركة<input className="field mt-1" value={form.company} onChange={e=>setField("company",e.target.value)}/></label>
      <label className="text-sm">رقم الهاتف *<input required className="field mt-1" value={form.phone} onChange={e=>setField("phone",e.target.value)} inputMode="tel"/></label>
      <label className="text-sm">واتساب<input className="field mt-1" value={form.whatsapp} onChange={e=>setField("whatsapp",e.target.value)}/></label>
      <label className="text-sm">البريد الإلكتروني<input type="email" className="field mt-1" value={form.email} onChange={e=>setField("email",e.target.value)}/></label>
      <label className="text-sm">الموقع / المدينة<input className="field mt-1" value={form.location} onChange={e=>setField("location",e.target.value)}/></label>
      {isRepair ? <>
        <label className="text-sm">المعدة *<input required className="field mt-1" value={form.equipment} onChange={e=>setField("equipment",e.target.value)}/></label>
        <label className="text-sm">العلامة التجارية / الطراز<input className="field mt-1" value={form.model} onChange={e=>setField("model",e.target.value)}/></label>
        <label className="text-sm md:col-span-2">وصف العطل أو الصيانة المطلوبة *<textarea required className="field mt-1 min-h-28" value={form.problem} onChange={e=>setField("problem",e.target.value)}/></label>
      </> : <>
        <label className="text-sm">{isRental?"المعدة المطلوبة *":"المنتج المطلوب *"}<input required className="field mt-1" value={form.product} onChange={e=>setField("product",e.target.value)}/></label>
        <label className="text-sm">الطراز<input className="field mt-1" value={form.model} onChange={e=>setField("model",e.target.value)}/></label>
        <label className="text-sm">الكمية / مدة التأجير<input className="field mt-1" value={form.quantity} onChange={e=>setField("quantity",e.target.value)}/></label>
        <label className="text-sm md:col-span-2">تفاصيل الطلب *<textarea required className="field mt-1 min-h-28" value={form.requirement} onChange={e=>setField("requirement",e.target.value)}/></label>
      </>}
      {error&&<p className="text-sm text-red-600 md:col-span-2">{error}</p>}
      <button disabled={sending} className="bg-safety px-6 py-3 font-semibold text-white disabled:opacity-50 md:col-span-2">{sending?"جارٍ الإرسال...":"إرسال الطلب"}</button>
    </form>}
  </Page>;

  if(section==="contact") return <Page title="تواصل معنا" lead="يسعد فريق الصفوة للتجارة بمساعدتك في استفسارات المنتجات والتأجير والإصلاح والصيانة.">
    <div className="grid gap-6 md:grid-cols-2"><div className="card-hard space-y-4 p-6"><h2 className="font-display text-2xl font-bold">معلومات التواصل</h2><p>{business.name}</p><p>كرشة، نزوى، محافظة الداخلية، سلطنة عُمان</p><a className="block text-safety" href={telHref}>{business.phone}</a><a className="block text-wa" href={waHref()} target="_blank" rel="noopener noreferrer">التواصل عبر واتساب</a><p className="text-sm text-smoke">يرجى التواصل معنا لمعرفة أوقات العمل الحالية.</p></div><iframe title="موقع الصفوة للتجارة في نزوى" src="https://www.google.com/maps?q=Karsha%2C%20Nizwa%2C%20Al%20Dakhiliyah%2C%20Oman&output=embed" className="min-h-80 w-full border-0" loading="lazy"/></div>
  </Page>;

  return <Page title="الصفحة غير موجودة" lead="عذراً، الصفحة المطلوبة غير متاحة."><div className="flex flex-wrap gap-3"><Link className="bg-ink px-5 py-3 text-white" to="/ar/">الرئيسية</Link><Link className="bg-safety px-5 py-3 text-white" to="/ar/products/">المنتجات</Link></div></Page>;
}

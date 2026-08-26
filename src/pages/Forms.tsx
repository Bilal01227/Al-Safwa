import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { business, telHref } from "../lib/business";
import { waHref, waGeneralMessage, waQuoteMessage, waRepairMessage } from "../lib/whatsapp";
import { usePageMeta, siteTitle } from "../lib/seo";
import { saveSubmission, type SubmissionType } from "../lib/submissions";
import { brands } from "../lib/data/brands";
import { CTAButton, PageHeader, Field } from "../components/kit";
import { IcWhatsApp, IcPhone, IcCheck, IcCamera, IcArrowRight } from "../components/icons";

type FormState = Record<string, string>;

const phoneOk = (v: string) => /^[+\d][\d\s\-()]{6,}$/.test(v.trim());

/* ── Shared scaffolding ────────────────────────────────────────── */
function FormShell({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="grid-light bg-paper py-14 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="border border-ink/15 bg-card p-6 shadow-[8px_8px_0_rgba(23,27,32,0.08)] md:p-8">{children}</div>
        <aside className="space-y-6">
          <div className="card-steel bg-steel p-6">
            <h2 className="font-display text-2xl font-semibold uppercase text-paper">{title}</h2>
            <ol className="mt-4 space-y-4">
              {[
                ["01", "We review the details", "Your request is logged and checked by the team."],
                ["02", "You get a real answer", "Pricing, availability or a diagnosis quote — confirmed per request."],
                ["03", "We coordinate", "Supply, delivery, workshop slot or site visit is arranged."],
              ].map(([n, t, d]) => (
                <li key={n} className="flex gap-3">
                  <span className="font-mono text-[11px] text-safety">{n}</span>
                  <div>
                    <p className="font-display text-lg font-medium uppercase leading-tight text-paper">{t}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-mist">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="border border-ink/15 bg-card p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke">Faster channels</h3>
            <div className="mt-4 grid gap-3">
              <CTAButton href={waHref(waGeneralMessage())} variant="wa" className="h-10 text-[15px]">
                <IcWhatsApp /> WhatsApp {business.name}
              </CTAButton>
              <CTAButton href={telHref} variant="outlineDark" className="h-10 text-[15px]">
                <IcPhone /> {business.phone}
              </CTAButton>
            </div>
            <p className="mt-4 border-l-2 border-caution pl-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-smoke">
              Details are used only to respond to this request and are never shared.
            </p>
          </div>
          {aside}
        </aside>
      </div>
    </section>
  );
}

function SuccessPanel({
  id,
  heading,
  message,
  waMessage,
}: {
  id: string;
  heading: string;
  message: string;
  waMessage: string;
}) {
  return (
    <div className="py-10 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center border-2 border-wa text-wa">
        <IcCheck width={32} height={32} />
      </span>
      <h2 className="mt-6 font-display text-4xl font-semibold uppercase">{heading}</h2>
      <p className="mx-auto mt-2 font-mono text-[12px] uppercase tracking-[0.18em] text-safety">Reference · {id}</p>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-smoke">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <CTAButton href={waHref(waMessage)} variant="wa">
          <IcWhatsApp /> Continue on WhatsApp
        </CTAButton>
        <CTAButton to="/products" variant="outlineDark">
          Back to catalogue
        </CTAButton>
      </div>
    </div>
  );
}

/* ── Request a Quote / Rental Quote ────────────────────────────── */
export function RequestQuotePage() {
  const [params] = useSearchParams();
  const isRental = params.get("intent") === "rental";
  const prefillProduct = params.get("product") ?? "";
  const prefillModel = params.get("model") ?? "";

  usePageMeta({
    title: siteTitle(isRental ? "Request Rental Quote" : "Request a Quote"),
    description: isRental
      ? `Request a rental quote from ${business.name} in Oman — daily, weekly and monthly equipment rental.`
      : `Request a quotation from ${business.name} in Oman — industrial tools, equipment, motors, pumps and spare parts.`,
    path: "/request-quote",
  });

  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    product: prefillProduct,
    model: prefillModel,
    quantity: "",
    location: "",
    requirement: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ id: string } | null>(null);

  const set = (k: string) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    else if (!phoneOk(form.phone)) errs.phone = "Enter a valid phone number";
    if (!form.product.trim()) errs.product = "Required";
    if (!form.requirement.trim()) errs.requirement = "Required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    const type: SubmissionType = isRental ? "rental" : "quote";
    const rec = await saveSubmission(type, { ...form, intent: type });
    setSending(false);
    setDone({ id: rec.id });
  };

  return (
    <>
      <PageHeader
        crumb={isRental ? "Rental Quote" : "Request Quote"}
        title={isRental ? "Request Rental Quote" : "Request a Quote"}
        lead={`${business.name} confirms pricing and availability per request — send the details and the team responds with a real quotation.`}
        ghost={isRental ? "RENT" : "RFQ"}
      />
      <FormShell title="What happens next">
        {done ? (
          <SuccessPanel
            id={done.id}
            heading={isRental ? "Rental request logged" : "Quote request logged"}
            message={`Thank you — ${business.name} will review the request and respond with ${
              isRental ? "rental terms and availability" : "pricing and availability"
            }. For the fastest answer, continue on WhatsApp with your reference number.`}
            waMessage={waQuoteMessage(form.product || undefined, form.model || undefined)}
          />
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 className="font-display text-3xl font-semibold uppercase">
              {isRental ? "Rental quote details" : "Quote details"}
            </h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-smoke">
              Sent to {business.name} — {business.country}
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Name" required error={errors.name}>
                <input className={`field ${errors.name ? "field-err" : ""}`} value={form.name} onChange={set("name")} placeholder="Your full name" />
              </Field>
              <Field label="Company">
                <input className="field" value={form.company} onChange={set("company")} placeholder="Company / contractor" />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <input className={`field ${errors.phone ? "field-err" : ""}`} value={form.phone} onChange={set("phone")} placeholder="+968 …" inputMode="tel" />
              </Field>
              <Field label="WhatsApp">
                <input className="field" value={form.whatsapp} onChange={set("whatsapp")} placeholder="WhatsApp number (optional)" inputMode="tel" />
              </Field>
              <Field label="Email" hint="Optional — for written quotations">
                <input className="field" type="email" value={form.email} onChange={set("email")} placeholder="name@company.com" />
              </Field>
              <Field label="Location" hint="Site / delivery area in Oman">
                <input className="field" value={form.location} onChange={set("location")} placeholder="e.g. Muscat, Sohar, Salalah" />
              </Field>
              <Field label={isRental ? "Equipment" : "Product"} required error={errors.product}>
                <input className={`field ${errors.product ? "field-err" : ""}`} value={form.product} onChange={set("product")} placeholder="e.g. Impact drill 13 mm" />
              </Field>
              <Field label="Model">
                <input className="field" value={form.model} onChange={set("model")} placeholder="e.g. GSB 13 RE" />
              </Field>
              <Field label="Quantity">
                <input className="field" value={form.quantity} onChange={set("quantity")} placeholder={isRental ? "Units / duration" : "e.g. 5"} inputMode="numeric" />
              </Field>
              <Field label="Brand preference">
                <select className="field" value={form.brand ?? ""} onChange={set("brand")}>
                  <option value="">No preference</option>
                  {brands.map((b) => (
                    <option key={b.slug} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Requirement" required error={errors.requirement}>
                  <textarea
                    className={`field min-h-[110px] ${errors.requirement ? "field-err" : ""}`}
                    value={form.requirement}
                    onChange={set("requirement")}
                    placeholder={
                      isRental
                        ? "Rental duration, site location, transport and operator requirements…"
                        : "Application, delivery timing, any specifications…"
                    }
                  />
                </Field>
              </div>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 bg-safety font-display text-lg font-medium uppercase tracking-[0.08em] text-paper transition-all hover:-translate-y-0.5 hover:bg-safety-deep hover:shadow-[5px_5px_0_rgba(16,20,26,0.3)] disabled:opacity-60 sm:w-auto sm:px-10"
            >
              {sending ? "Sending…" : isRental ? "Request Rental Quote" : "Request Quote"} <IcArrowRight width={18} height={18} />
            </button>
          </form>
        )}
      </FormShell>
    </>
  );
}

/* ── Repair / Maintenance request ──────────────────────────────── */
export function RepairPage() {
  const [params] = useSearchParams();
  const intent = params.get("intent");
  const isMaintenance = intent === "maintenance";
  const title = isMaintenance ? "Request Maintenance" : "Request Repair";

  usePageMeta({
    title: siteTitle(title),
    description: isMaintenance
      ? `Request preventive or machinery maintenance from ${business.name} in Oman.`
      : `Request equipment and power tool repair from ${business.name} in Oman — diagnosis quoted before work begins.`,
    path: "/repair",
  });

  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    equipment: "",
    brand: "",
    model: "",
    problem: "",
    location: "",
    urgency: "Standard",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ id: string } | null>(null);

  const set = (k: string) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    else if (!phoneOk(form.phone)) errs.phone = "Enter a valid phone number";
    if (!form.equipment.trim()) errs.equipment = "Required";
    if (!form.problem.trim()) errs.problem = "Required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    const rec = await saveSubmission("repair", { ...form, intent: isMaintenance ? "maintenance" : "repair" });
    setSending(false);
    setDone({ id: rec.id });
  };

  return (
    <>
      <PageHeader
        crumb={isMaintenance ? "Maintenance" : "Repair"}
        title={title}
        lead={
          isMaintenance
            ? "Planned maintenance for tools, motors, pumps and machinery — scheduled around your operation."
            : "Fault diagnosis and repair with a clear quotation before any work starts. Field service available across Oman."
        }
        ghost={isMaintenance ? "MNT" : "REP"}
      />
      <FormShell title="What happens next">
        {done ? (
          <SuccessPanel
            id={done.id}
            heading="Request logged"
            message={`${business.name} will review the ${isMaintenance ? "maintenance" : "repair"} request and respond with the next step — inspection, quote or a workshop slot. Attach photos on WhatsApp for a faster diagnosis.`}
            waMessage={waRepairMessage()}
          />
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 className="font-display text-3xl font-semibold uppercase">
              {isMaintenance ? "Maintenance details" : "Repair details"}
            </h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-smoke">
              Workshop & field service — {business.name}, {business.country}
            </p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field label="Customer name" required error={errors.name}>
                <input className={`field ${errors.name ? "field-err" : ""}`} value={form.name} onChange={set("name")} placeholder="Your full name" />
              </Field>
              <Field label="Company">
                <input className="field" value={form.company} onChange={set("company")} placeholder="Company / contractor" />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <input className={`field ${errors.phone ? "field-err" : ""}`} value={form.phone} onChange={set("phone")} placeholder="+968 …" inputMode="tel" />
              </Field>
              <Field label="WhatsApp">
                <input className="field" value={form.whatsapp} onChange={set("whatsapp")} placeholder="WhatsApp number (optional)" inputMode="tel" />
              </Field>
              <Field label="Email">
                <input className="field" type="email" value={form.email} onChange={set("email")} placeholder="name@company.com" />
              </Field>
              <Field label="Location" hint="Where the equipment is">
                <input className="field" value={form.location} onChange={set("location")} placeholder="Workshop / site location" />
              </Field>
              <Field label="Equipment" required error={errors.equipment}>
                <input className={`field ${errors.equipment ? "field-err" : ""}`} value={form.equipment} onChange={set("equipment")} placeholder="e.g. Angle grinder" />
              </Field>
              <Field label="Brand">
                <input className="field" value={form.brand} onChange={set("brand")} placeholder="e.g. Bosch" />
              </Field>
              <Field label="Model">
                <input className="field" value={form.model} onChange={set("model")} placeholder="e.g. GWS 800" />
              </Field>
              <Field label="Urgency">
                <select className="field" value={form.urgency} onChange={set("urgency")}>
                  <option>Standard</option>
                  <option>Urgent</option>
                  <option>Critical breakdown</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Problem description" required error={errors.problem}>
                  <textarea
                    className={`field min-h-[110px] ${errors.problem ? "field-err" : ""}`}
                    value={form.problem}
                    onChange={set("problem")}
                    placeholder={
                      isMaintenance
                        ? "Equipment list, service history, preferred visit schedule…"
                        : "What happened? Noise, smoke, loss of power, error behaviour…"
                    }
                  />
                </Field>
              </div>

              {/* Photo upload placeholder — Supabase Storage phase */}
              <div className="sm:col-span-2">
                <span className="flabel">Photos (optional)</span>
                <div className="flex flex-wrap items-center justify-between gap-4 border border-dashed border-ink/30 bg-paper-2/60 px-5 py-6">
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center bg-ink text-safety">
                      <IcCamera width={20} height={20} />
                    </span>
                    <div>
                      <p className="font-display text-lg font-medium uppercase">Photo upload coming soon</p>
                      <p className="text-[13px] text-smoke">
                        Cloud photo upload is planned with the Supabase phase — meanwhile, send photos on WhatsApp.
                      </p>
                    </div>
                  </div>
                  <CTAButton href={waHref(waRepairMessage())} variant="wa" className="h-10 px-4 text-[15px]">
                    <IcWhatsApp /> Send via WhatsApp
                  </CTAButton>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 bg-safety font-display text-lg font-medium uppercase tracking-[0.08em] text-paper transition-all hover:-translate-y-0.5 hover:bg-safety-deep hover:shadow-[5px_5px_0_rgba(16,20,26,0.3)] disabled:opacity-60 sm:w-auto sm:px-10"
            >
              {sending ? "Sending…" : isMaintenance ? "Request Maintenance" : "Request Repair"} <IcArrowRight width={18} height={18} />
            </button>
          </form>
        )}
      </FormShell>
    </>
  );
}

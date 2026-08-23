/** Shared UI kit: motion, section chrome, buttons, badges, form fields. */
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";

/* ── Scroll reveal ─────────────────────────────────────────────── */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ── Section heading with industrial index ─────────────────────── */
export function SectionHead({
  index,
  title,
  lead,
  dark = false,
  right,
}: {
  index: string;
  title: string;
  lead?: string;
  dark?: boolean;
  right?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
      <div className="max-w-2xl">
        <p className={`mb-3 font-mono text-[11px] uppercase tracking-[0.22em] ${dark ? "text-safety" : "text-safety"}`}>
          <span className="mr-2 inline-block h-2 w-2 bg-safety align-middle" />
          {index} / Section
        </p>
        <h2
          className={`font-display text-4xl font-semibold uppercase leading-[0.98] tracking-[0.01em] md:text-5xl ${
            dark ? "text-paper" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {lead && <p className={`mt-4 max-w-xl text-base leading-relaxed ${dark ? "text-mist" : "text-smoke"}`}>{lead}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/* ── Hazard dividers ───────────────────────────────────────────── */
export const HazardBar = ({ className = "h-2.5" }: { className?: string }) => (
  <div className={`hazard ${className}`} aria-hidden="true" />
);

/* ── Brand marquee ─────────────────────────────────────────────── */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee py-4" aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="whitespace-nowrap px-6 font-display text-3xl font-medium uppercase tracking-[0.08em] text-paper/85 md:text-4xl">
              {item}
            </span>
            <span className="h-2.5 w-2.5 rotate-45 bg-safety" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── CTA buttons ───────────────────────────────────────────────── */
const variants: Record<string, string> = {
  safety: "bg-safety text-paper hover:bg-safety-deep",
  wa: "bg-wa text-white hover:bg-wa-deep",
  dark: "bg-ink text-paper hover:bg-safety",
  steel: "bg-steel-2 text-paper hover:bg-safety",
  outlineLight: "border border-paper/35 text-paper hover:border-safety hover:text-safety",
  outlineDark: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper",
};

const btnBase =
  "inline-flex items-center justify-center gap-2 px-5 h-11 font-display text-[17px] font-medium uppercase tracking-[0.08em] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_rgba(16,20,26,0.28)]";

export function CTAButton({
  to,
  href,
  variant = "safety",
  className = "",
  children,
  title,
}: {
  to?: string;
  href?: string;
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
  title?: string;
}) {
  const cls = `${btnBase} ${variants[variant]} ${className}`;
  if (href) {
    const external = href.startsWith("http");
    return (
      <a href={href} className={cls} title={title} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to ?? "/"} className={cls} title={title}>
      {children}
    </Link>
  );
}

/* ── Badges & tags ─────────────────────────────────────────────── */
export const AvailabilityBadge = ({ text = "Contact for availability" }: { text?: string }) => (
  <span className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-caution">
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping bg-caution opacity-60" />
      <span className="relative inline-flex h-2 w-2 bg-caution" />
    </span>
    {text}
  </span>
);

export const MonoTag = ({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" | "safety" }) => (
  <span
    className={`inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
      tone === "dark" ? "bg-ink text-paper" : tone === "light" ? "bg-paper/90 text-ink" : "bg-safety text-paper"
    }`}
  >
    {children}
  </span>
);

/* ── Page header band (subpages) ───────────────────────────────── */
export function PageHeader({
  crumb,
  title,
  lead,
  ghost,
  children,
}: {
  crumb: string;
  title: string;
  lead?: string;
  ghost?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-coal grid-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none font-display text-[190px] font-bold uppercase leading-none text-paper/[0.04] lg:block"
      >
        {ghost ?? crumb}
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-mist">
          <Link to="/" className="transition-colors hover:text-safety">
            Home
          </Link>
          <span className="mx-2 text-safety">/</span>
          <span className="text-safety">{crumb}</span>
        </p>
        <h1 className="max-w-4xl font-display text-5xl font-semibold uppercase leading-[0.95] tracking-[0.01em] text-paper md:text-7xl">
          {title}
        </h1>
        {lead && <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist md:text-lg">{lead}</p>}
        {children}
      </div>
      <HazardBar className="h-2" />
    </header>
  );
}

/* ── Form fields ───────────────────────────────────────────────── */
export function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="flabel">
        {label} {required && <span className="text-safety">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wide text-[#c0392b]">▲ {error}</p>
      ) : hint ? (
        <p className="mt-1.5 font-mono text-[10.5px] text-smoke/80">{hint}</p>
      ) : null}
    </div>
  );
}

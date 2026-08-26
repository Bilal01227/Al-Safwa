import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { business, telHref, mailHref } from "../lib/business";
import { waHref, waGeneralMessage } from "../lib/whatsapp";
import { categories } from "../lib/data/categories";
import { brands } from "../lib/data/brands";
import { services } from "../lib/data/services";
import { CTAButton, HazardBar } from "./kit";
import { IcWhatsApp, IcPhone, IcMenu, IcX, IcArrowUpRight, IcMail } from "./icons";

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2 28 9v14L16 30 4 23V9Z" fill="#e8491a" />
      <circle cx="16" cy="16" r="6.5" fill="#10141a" />
      <circle cx="16" cy="16" r="2.5" fill="#f0a50e" />
    </svg>
  );
}

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/brands", label: "Brands" },
  { to: "/rental", label: "Rental" },
  { to: "/services", label: "Services" },
  { to: "/repair", label: "Repair" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Utility strip */}
      <div className="hidden border-b border-white/10 bg-coal md:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mist sm:px-6">
          <span>Supply · Rental · Repair · Maintenance — {business.country}</span>
          <span className="flex items-center gap-5">
            <a href={telHref} className="flex items-center gap-1.5 transition-colors hover:text-safety">
              <IcPhone width={12} height={12} /> {business.phone}
            </a>
            <a href={mailHref} className="flex items-center gap-1.5 transition-colors hover:text-safety">
              <IcMail width={12} height={12} /> {business.email}
            </a>
          </span>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-40 border-b border-white/10 bg-coal/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-[0_10px_30px_rgba(0,0,0,0.45)]" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-3" aria-label={`${business.name} — home`}>
            <LogoMark />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[22px] font-semibold tracking-[0.06em] text-paper transition-colors group-hover:text-safety">
                AL SAFWA
              </span>
              <span className="mt-1 font-mono text-[9px] tracking-[0.32em] text-mist">TRADING — OMAN</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `navlink font-display text-[16px] uppercase tracking-[0.07em] transition-colors ${
                    isActive ? "active text-safety" : "text-mist hover:text-paper"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <CTAButton to="/request-quote" variant="safety" className="hidden h-10 px-4 text-[15px] md:inline-flex">
              Request Quote
            </CTAButton>
            <button
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center border border-white/15 text-paper transition-colors hover:border-safety hover:text-safety lg:hidden"
              aria-label="Open menu"
            >
              <IcMenu width={22} height={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-coal grid-dark transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 sm:px-6">
          <span className="flex items-center gap-3">
            <LogoMark size={30} />
            <span className="font-display text-xl font-semibold tracking-[0.06em] text-paper">AL SAFWA TRADING</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center border border-white/15 text-paper hover:border-safety hover:text-safety"
            aria-label="Close menu"
          >
            <IcX width={22} height={22} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              className={({ isActive }) =>
                `group flex items-baseline gap-4 border-b border-white/8 py-3 transition-all duration-500 ${
                  open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                } ${isActive ? "text-safety" : "text-paper hover:text-safety"}`
              }
            >
              <span className="font-mono text-[11px] text-smoke">0{i + 1}</span>
              <span className="font-display text-4xl font-semibold uppercase tracking-[0.02em]">{item.label}</span>
              <IcArrowUpRight width={20} height={20} className="ml-auto text-smoke transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-safety" />
            </NavLink>
          ))}
        </nav>
        <div className="flex gap-3 border-t border-white/10 p-4 sm:px-6">
          <CTAButton href={waHref(waGeneralMessage())} variant="wa" className="flex-1">
            <IcWhatsApp /> WhatsApp
          </CTAButton>
          <CTAButton href={telHref} variant="outlineLight" className="flex-1">
            <IcPhone /> Call Us
          </CTAButton>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-coal text-mist">
      <HazardBar className="h-2.5" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <LogoMark size={38} />
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl font-semibold tracking-[0.06em] text-paper">AL SAFWA</span>
              <span className="mt-1 font-mono text-[9px] tracking-[0.32em]">TRADING — OMAN</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist/85">{business.descriptor}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTAButton href={waHref(waGeneralMessage())} variant="wa" className="h-10 px-4 text-[15px]">
              <IcWhatsApp /> WhatsApp
            </CTAButton>
            <CTAButton href={telHref} variant="outlineLight" className="h-10 px-4 text-[15px]">
              <IcPhone /> Call
            </CTAButton>
          </div>
          {business.placeholdersPending && (
            <p className="mt-6 inline-block border border-dashed border-caution/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-caution">
              Contact details pending final verification
            </p>
          )}
        </div>

        <FooterCol title="Divisions">
          {categories.map((c) => (
            <FooterLink key={c.slug} to={c.slug === "rental-equipment" ? "/rental" : `/products?cat=${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Brands">
          {brands.slice(0, 8).map((b) => (
            <FooterLink key={b.slug} to={`/brands/${b.slug}`}>
              {b.name}
            </FooterLink>
          ))}
          <FooterLink to="/brands">All brands →</FooterLink>
        </FooterCol>

        <FooterCol title="Services">
          {services.map((s) => (
            <FooterLink key={s.slug} to={`/services/${s.slug}`}>
              {s.name}
            </FooterLink>
          ))}
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[12px] text-mist/70 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} <span className="text-paper">{business.name}</span> — {business.country}. All
            rights reserved.
          </p>
          <p>Product brands & trademarks belong to their respective owners.</p>
          <p>Specifications compiled from public sources — verify before ordering.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-paper">{title}</h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-sm text-mist/85 transition-colors hover:text-safety">
        {children}
      </Link>
    </li>
  );
}

function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <a
        href={waHref(waGeneralMessage())}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${business.name} on WhatsApp`}
        className="group relative block"
      >
        <span className="wa-ping relative block">
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-[0_10px_28px_rgba(0,0,0,0.4)] transition-all duration-200 group-hover:scale-105 group-hover:bg-wa-deep">
            <IcWhatsApp width={26} height={26} />
          </span>
        </span>
        <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-paper opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

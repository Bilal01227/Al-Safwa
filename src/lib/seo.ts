/** Per-route document metadata (SPA-friendly SEO layer). */
import { useEffect } from "react";
import { business } from "./business";

interface PageMeta {
  title: string;
  description: string;
  path: string;
}

export function usePageMeta({ title, description, path }: PageMeta): void {
  useEffect(() => {
    document.title = title;

    let desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.appendChild(desc);
    }
    desc.content = description;

    let og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (og) og.content = title;
    let ogd = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogd) ogd.content = description;

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const base = `${window.location.origin}${window.location.pathname}`;
    canonical.href = path === "/" ? base : `${base}#${path}`;
  }, [title, description, path]);
}

export const siteTitle = (page?: string): string =>
  page ? `${page} — ${business.name} Oman` : `${business.name} — Industrial Tools, Equipment & Machinery in Oman`;

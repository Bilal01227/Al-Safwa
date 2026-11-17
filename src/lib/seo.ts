/** Route-aware technical SEO for the SPA. */
import { useEffect } from "react";
import { business } from "./business";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  keywords?: string[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  indexable?: boolean;
}

const upsertMeta = (selector: string, attrs: Record<string, string>, content: string) => {
  let node = document.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => node!.setAttribute(key, value));
    document.head.appendChild(node);
  }
  node.content = content;
};

export function usePageMeta({ title, description, path, image, type = "website", keywords, jsonLd, indexable = true }: PageMeta): void {
  useEffect(() => {
    const canonicalUrl = window.location.origin + (path === "/" ? "/" : path + "/");
    const isArabic = path === "/ar" || path.startsWith("/ar/");
    const englishPath = isArabic ? (path.replace(/^\\/ar(?=\\/|$)/, "") || "/") : path;
    const arabicPath = isArabic ? path : (path === "/" ? "/ar" : "/ar" + path);
    const localizedUrl = (value: string) => window.location.origin + (value === "/" ? "/" : value.replace(/\\/$/, "") + "/");
    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, indexable ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" : "noindex,nofollow");
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, type === "product" ? "product" : type);
    if (indexable) upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    else document.querySelector('meta[property="og:url"]')?.remove();
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, business.name);
    upsertMeta('meta[property="og:locale"]', { property: "og:locale" }, isArabic ? "ar_OM" : "en_OM");

    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
    if (indexable) {
      [
        { lang: "en-OM", href: localizedUrl(englishPath) },
        { lang: "ar-OM", href: localizedUrl(arabicPath) },
        { lang: "x-default", href: localizedUrl(englishPath) },
      ].forEach(({ lang, href }) => {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = lang;
        link.href = href;
        document.head.appendChild(link);
      });
    }
    if (image) upsertMeta('meta[property="og:image"]', { property: "og:image" }, image);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    if (image) upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, image);
    if (keywords?.length) upsertMeta('meta[name="keywords"]', { name: "keywords" }, keywords.join(", "));

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (indexable) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    } else {
      canonical?.remove();
    }

    const oldLd = document.getElementById("route-jsonld");
    oldLd?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "route-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, type, keywords, jsonLd, indexable]);
}

export const siteTitle = (page?: string): string =>
  page ? `${page} — ${business.name} Oman` : `${business.name} — Industrial Tools, Equipment & Machinery in Oman`;

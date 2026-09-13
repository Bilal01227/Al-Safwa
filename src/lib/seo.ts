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

export function usePageMeta({ title, description, path, image, type = "website", keywords, jsonLd }: PageMeta): void {
  useEffect(() => {
    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, type === "product" ? "product" : type);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, `${window.location.origin}${path}`);
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, business.name);
    upsertMeta('meta[property="og:locale"]', { property: "og:locale" }, "en_OM");
    if (image) upsertMeta('meta[property="og:image"]', { property: "og:image" }, image);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    if (image) upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, image);
    if (keywords?.length) upsertMeta('meta[name="keywords"]', { name: "keywords" }, keywords.join(", "));

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${path}`;

    const oldLd = document.getElementById("route-jsonld");
    oldLd?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "route-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, type, keywords, jsonLd]);
}

export const siteTitle = (page?: string): string =>
  page ? `${page} — ${business.name} Oman` : `${business.name} — Industrial Tools, Equipment & Machinery in Oman`;

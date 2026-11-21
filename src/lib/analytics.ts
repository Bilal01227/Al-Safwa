type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; }
}

let initialized = false;
let activeMeasurementId = "";

export function initAnalytics(): void {
  if (typeof window === "undefined" || initialized) return;
  const id = (import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  activeMeasurementId = id;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false, anonymize_ip: true });
  if (!document.getElementById("al-safwa-ga4")) {
    const script = document.createElement("script");
    script.id = "al-safwa-ga4";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(script);
  }
  initialized = true;
}

export function trackEvent(name: string, params: AnalyticsParams = {}): void {
  if (!activeMeasurementId || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

export function trackPageView(path: string): void {
  if (!activeMeasurementId || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
}
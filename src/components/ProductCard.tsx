import { Link } from "react-router-dom";
import type { Product } from "../lib/types";
import { waHref, waProductMessage } from "../lib/whatsapp";
import { AvailabilityBadge } from "./kit";
import { IcWhatsApp } from "./icons";

export default function ProductCard({ product, index }: { product: Product; index?: number }) {
  const specs = Object.entries(product.specifications).slice(0, 2);
  return (
    <article className="card-hard group flex flex-col">
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden bg-paper-2" tabIndex={-1} aria-hidden="true">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.productName}
            loading="lazy"
            width={900}
            height={700}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        </div>
        {/* corner ticks */}
        <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-safety opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-safety opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 bg-ink/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper">
          {index !== undefined ? `P-${String(index + 1).padStart(2, "0")}` : product.category.replace(/-/g, " ")}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/brands/${product.brandSlug}`}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-safety transition-colors hover:text-safety-deep"
          >
            {product.brand}
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-smoke">{product.subcategory}</span>
        </div>

        <h3 className="font-display text-[22px] font-semibold uppercase leading-[1.02] tracking-[0.01em]">
          <Link to={`/products/${product.slug}`} className="transition-colors group-hover:text-safety">
            {product.productName}
          </Link>
        </h3>

        <span className="inline-block w-fit border border-ink/15 bg-paper-2 px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink/80">
          Model · {product.modelNumber}
        </span>

        <p className="text-sm leading-relaxed text-smoke line-clamp-2">{product.shortDescription}</p>

        {specs.length > 0 && (
          <div className="mt-auto space-y-1 border-t border-ink/10 pt-2.5">
            {specs.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 font-mono text-[10.5px] uppercase tracking-[0.06em]">
                <span className="text-smoke">{k}</span>
                <span className="truncate font-medium text-ink">{v}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-1">
          <AvailabilityBadge text={product.availability} />
        </div>

        <div className="mt-2 grid grid-cols-[1fr_44px] gap-2">
          <Link
            to={`/request-quote?product=${encodeURIComponent(product.productName)}&model=${encodeURIComponent(product.modelNumber)}`}
            className="grid h-10 place-items-center bg-ink font-display text-[15px] font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-safety"
          >
            Request Quote
          </Link>
          <a
            href={waHref(waProductMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask about ${product.productName} on WhatsApp`}
            className="grid h-10 place-items-center border border-wa/50 text-wa transition-colors hover:bg-wa hover:text-white"
          >
            <IcWhatsApp width={18} height={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

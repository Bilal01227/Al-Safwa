import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const fallback = (name: string) => name.slice(0, 2).toUpperCase();

export default function BrandLogo({
  slug,
  name,
  monogram,
  className = "",
}: {
  slug: string;
  name: string;
  monogram?: string;
  className?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    supabase
      .from("brands")
      .select("logo_path")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!live || !data?.logo_path) return;
        const publicUrl = supabase.storage.from("brand-images").getPublicUrl(data.logo_path).data.publicUrl;
        if (publicUrl) setUrl(publicUrl);
      });
    return () => {
      live = false;
    };
  }, [slug]);

  if (url) {
    return <img src={url} alt={`${name} logo`} className={`h-full w-full object-contain p-2 ${className}`} />;
  }

  return <span className={className}>{monogram || fallback(name)}</span>;
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const fallback = (name: string) => name.slice(0, 2).toUpperCase();

export default function BrandLogo({
  slug,
  name,
  monogram,
  logoPath,
  className = "",
}: {
  slug: string;
  name: string;
  monogram?: string;
  logoPath?: string;
  className?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    const load = async () => {
      let path = logoPath;
      if (!path) {
        const { data } = await supabase
          .from("brands")
          .select("logo_path")
          .eq("slug", slug)
          .eq("active", true)
          .maybeSingle();
        path = data?.logo_path || undefined;
      }
      if (!live || !path) {
        if (live) setUrl(null);
        return;
      }
      const publicUrl = supabase.storage.from("brand-images").getPublicUrl(path).data.publicUrl;
      if (live) setUrl(publicUrl || null);
    };
    load();
    return () => {
      live = false;
    };
  }, [slug, logoPath]);

  if (url) {
    return <img src={url} alt={`${name} logo`} className={`h-full w-full object-contain p-2 ${className}`} />;
  }

  return <span className={className}>{monogram || fallback(name)}</span>;
}

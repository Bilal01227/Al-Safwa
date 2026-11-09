import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export function useSiteMedia() {
  const [media, setMedia] = useState<Record<string, string>>({});
  useEffect(() => {
    let live = true;
    supabase.from("site_media").select("media_key,bucket_id,storage_path").eq("active", true).then(({ data }) => {
      if (!live || !data) return;
      setMedia(Object.fromEntries(data.map((item) => {
        const path = item.storage_path;
        const url = path.startsWith("/") || path.startsWith("https://") || path.startsWith("http://")
          ? path
          : supabase.storage.from(item.bucket_id).getPublicUrl(path).data.publicUrl;
        return [item.media_key, url];
      })));
    });
    return () => { live = false; };
  }, []);
  return media;
}

import type { MetadataRoute } from "next";

import { buildGeneratedArchivePages } from "@/lib/content/archive";
import { buildSitemapEntries } from "@/lib/content/metadata";
import { getLivePages } from "@/lib/content/runtime";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const livePages = getLivePages();
  const pages = [...livePages, ...buildGeneratedArchivePages(livePages)];

  return buildSitemapEntries(pages).map((url) => ({
    url,
  }));
}

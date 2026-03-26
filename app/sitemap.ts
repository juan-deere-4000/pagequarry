import type { MetadataRoute } from "next";

import { buildSitemapEntries } from "@/lib/content/metadata";
import { getLivePages } from "@/lib/content/runtime";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(getLivePages()).map((url) => ({
    url,
  }));
}

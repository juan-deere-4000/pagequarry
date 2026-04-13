import type { MetadataRoute } from "next";

import { siteConfig } from "@/site/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.identity.siteUrl,
    rules: [
      {
        allow: "/",
        userAgent: "*",
      },
    ],
    sitemap: `${siteConfig.identity.siteUrl}/sitemap.xml`,
  };
}

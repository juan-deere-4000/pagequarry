import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: siteConfig.manifest.backgroundColor,
    description: siteConfig.manifest.description,
    display: "standalone",
    icons: [
      {
        sizes: "256x256",
        src: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    name: siteConfig.manifest.name,
    short_name: siteConfig.manifest.shortName,
    start_url: "/",
    theme_color: siteConfig.manifest.themeColor,
  };
}

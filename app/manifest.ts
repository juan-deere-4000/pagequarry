import type { MetadataRoute } from "next";

import { siteConfig } from "@/site/config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: siteConfig.manifest.backgroundColor,
    description: siteConfig.manifest.description,
    display: "standalone",
    icons: [
      {
        sizes: "64x64",
        src: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    name: siteConfig.manifest.name,
    short_name: siteConfig.manifest.shortName,
    start_url: "/",
    theme_color: siteConfig.manifest.themeColor,
  };
}

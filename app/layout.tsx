import type { Metadata } from "next";

import { StructuredData } from "@/components/site/structured-data";
import { SiteChrome } from "@/components/site/site-chrome";
import { siteConfig } from "@/content/site";
import { buildSiteStructuredData } from "@/lib/content/metadata";

import "./globals.css";

export const metadata: Metadata = {
  applicationName: siteConfig.manifest.name,
  authors: [{ name: siteConfig.metadata.defaultAuthor }],
  description: siteConfig.identity.description,
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(siteConfig.identity.siteUrl),
  openGraph: {
    description: siteConfig.identity.description,
    images: [siteConfig.social.images.site.path],
    locale: siteConfig.identity.locale,
    siteName: siteConfig.social.siteName,
    title: siteConfig.identity.title,
    type: "website",
    url: siteConfig.identity.siteUrl,
  },
  robots: siteConfig.metadata.robots,
  title: {
    default: siteConfig.identity.title,
    template: `%s | ${siteConfig.identity.title}`,
  },
  twitter: {
    card: siteConfig.social.defaultTwitterCard,
    description: siteConfig.identity.description,
    images: [siteConfig.social.images.site.path],
    title: siteConfig.identity.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <StructuredData items={buildSiteStructuredData()} />
        <div className="relative isolate min-h-screen overflow-hidden">
          <div className="relative flex min-h-screen flex-col">
            <SiteChrome>{children}</SiteChrome>
          </div>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Source_Serif_4 } from "next/font/google";

import { StructuredData } from "@/components/site/structured-data";
import { SiteChrome } from "@/components/site/site-chrome";
import { siteConfig } from "@/content/site";
import { buildSiteStructuredData } from "@/lib/content/metadata";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  applicationName: siteConfig.manifest.name,
  authors: [{ name: siteConfig.metadata.defaultAuthor }],
  description: siteConfig.description,
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    description: siteConfig.description,
    images: [siteConfig.social.images.site.path],
    locale: siteConfig.locale,
    siteName: siteConfig.social.siteName,
    title: siteConfig.title,
    type: "website",
    url: siteConfig.siteUrl,
  },
  robots: siteConfig.metadata.robots,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  twitter: {
    card: siteConfig.social.defaultTwitterCard,
    description: siteConfig.description,
    images: [siteConfig.social.images.site.path],
    title: siteConfig.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${display.variable} ${body.variable}`}
      lang="en"
    >
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

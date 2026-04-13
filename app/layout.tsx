import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google";

import { StructuredData } from "@/components/site/structured-data";
import { SiteChrome } from "@/components/site/site-chrome";
import { buildSiteStructuredData } from "@/lib/content/metadata";
import { siteConfig } from "@/site/config";

import "./globals.css";

const bodyFont = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-pagequarry-body",
});

const displayFont = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-pagequarry-display",
});

const utilityFont = IBM_Plex_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-pagequarry-utility",
  weight: ["400", "500", "600"],
});

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
    <html
      className={`${bodyFont.variable} ${displayFont.variable} ${utilityFont.variable}`}
      lang="en"
    >
      <body className="m-0 min-h-screen bg-[radial-gradient(circle_at_12%_12%,rgba(28,109,255,0.14),transparent_20%),radial-gradient(circle_at_88%_10%,rgba(0,188,212,0.12),transparent_18%),linear-gradient(180deg,#edf4f9_0%,#f8fbfd_44%,#eef3f8_100%)] font-sans text-foreground antialiased">
        <StructuredData items={buildSiteStructuredData()} />
        <div className="relative isolate min-h-screen overflow-hidden before:pointer-events-none before:fixed before:inset-0 before:-z-20 before:bg-[linear-gradient(rgba(16,32,48,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(16,32,48,0.035)_1px,transparent_1px)] before:bg-[size:36px_36px] before:opacity-40 before:[mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.75),transparent_88%)] after:pointer-events-none after:fixed after:inset-0 after:-z-10 after:bg-[radial-gradient(circle_at_50%_-12%,rgba(255,255,255,0.9),transparent_38%),radial-gradient(circle_at_78%_18%,rgba(28,109,255,0.12),transparent_18%)]">
          <div className="relative flex min-h-screen flex-col">
            <SiteChrome>{children}</SiteChrome>
          </div>
        </div>
      </body>
    </html>
  );
}

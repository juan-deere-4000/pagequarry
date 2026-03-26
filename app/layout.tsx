import type { Metadata } from "next";
import { Fraunces, Source_Serif_4 } from "next/font/google";

import { SiteChrome } from "@/components/site/site-chrome";
import { siteConfig } from "@/content/site";

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
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
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
        <div className="relative isolate min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(20,49,74,0.08),transparent_60%)]" />
          <div className="relative flex min-h-screen flex-col">
            <SiteChrome>{children}</SiteChrome>
          </div>
        </div>
      </body>
    </html>
  );
}

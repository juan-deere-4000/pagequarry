"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Text } from "@/components/site/text";
import { siteConfig } from "@/site/config";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/homepage-markdown" || pathname === "/homepage-markdown/") {
    return children;
  }

  return (
    <>
      <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6">
        <PageContainer width="full">
          <div className="flex items-center justify-between gap-4 rounded-[1.9rem] border border-white/70 bg-white/78 px-5 py-4 shadow-[0_24px_60px_rgba(16,32,48,0.08)] backdrop-blur-xl sm:px-6 sm:py-5">
            <div className="min-w-0 flex-1">
              <Text as={Link} className="shrink-0" href="/" variant="brand">
                {siteConfig.identity.name}
              </Text>
              <Text
                as="p"
                className="mt-1 max-w-sm text-[0.76rem] leading-5 tracking-[0.04em] text-slate-500 sm:text-[0.86rem]"
                variant="bodySmall"
              >
                {siteConfig.identity.subheader}
              </Text>
            </div>

            <Button asChild className="shrink-0" variant="solid">
              <Link href={siteConfig.contact.primaryAction.href} target="_blank" rel="noreferrer">
                {siteConfig.contact.primaryAction.label}
              </Link>
            </Button>
          </div>
        </PageContainer>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-10 sm:py-14">
        <PageContainer>
          <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/70 bg-white/78 px-6 py-6 text-sm text-muted shadow-[0_24px_60px_rgba(16,32,48,0.08)] backdrop-blur-xl md:flex-row md:items-end md:justify-between">
            <div className="max-w-lg space-y-2">
              <Text as="p" variant="brand">
                {siteConfig.identity.name}
              </Text>
              <Text as="p" variant="bodySmall">
                {siteConfig.footer.tagline}
              </Text>
            </div>
            <div className="space-y-1 text-left md:max-w-md md:text-right">
              <Text as="p" variant="bodySmall">
                {siteConfig.footer.meta}
              </Text>
              <Text as="p" variant="bodySmall">
                {siteConfig.footer.note}
              </Text>
            </div>
          </div>
        </PageContainer>
      </footer>
    </>
  );
}

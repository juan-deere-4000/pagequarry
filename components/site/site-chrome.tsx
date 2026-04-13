import Link from "next/link";

import { Button } from "@/components/site/button";
import { DesktopNavigation } from "@/components/site/desktop-navigation";
import { MobileMenu } from "@/components/site/mobile-menu";
import { PageContainer } from "@/components/site/page-container";
import { Text } from "@/components/site/text";
import { siteConfig } from "@/site/config";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/78 backdrop-blur-xl">
        <PageContainer className="flex items-center justify-between gap-6 py-4 sm:py-5">
          <Text as={Link} href="/" variant="brand">
            {siteConfig.identity.name}
          </Text>

          <DesktopNavigation items={siteConfig.navigation} />

          <Button asChild className="hidden md:inline-flex" variant="solid">
            <Link href={siteConfig.contact.primaryAction.href} target="_blank" rel="noreferrer">
              {siteConfig.contact.primaryAction.label}
            </Link>
          </Button>

          <MobileMenu />
        </PageContainer>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 py-8 sm:py-10">
        <PageContainer className="flex flex-col gap-3 text-sm text-muted md:flex-row md:items-end md:justify-between">
          <div>
            <Text as="p" variant="brand">
              {siteConfig.identity.name}
            </Text>
            <Text as="p" variant="bodySmall">
              {siteConfig.footer.tagline}
            </Text>
          </div>
          <div className="space-y-1 text-left md:text-right">
            <Text as="p" variant="bodySmall">
              {siteConfig.footer.meta}
            </Text>
            <Text as="p" variant="bodySmall">
              {siteConfig.footer.note}
            </Text>
          </div>
        </PageContainer>
      </footer>
    </>
  );
}

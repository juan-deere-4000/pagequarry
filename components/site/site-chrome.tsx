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
      <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6">
        <PageContainer width="full">
          <div className="site-panel flex items-center justify-between gap-6 rounded-[1.75rem] px-5 py-4 sm:px-6 sm:py-5">
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
          </div>
        </PageContainer>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-10 sm:py-14">
        <PageContainer>
          <div className="site-panel flex flex-col gap-4 rounded-[1.75rem] px-6 py-6 text-sm text-muted md:flex-row md:items-end md:justify-between">
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

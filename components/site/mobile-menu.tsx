"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

import { buttonVariants } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Text, textVariants } from "@/components/site/text";
import { siteConfig } from "@/content/site";
import type { SiteNavigationItem } from "@/content/types";
import { cn } from "@/lib/cn";

function hasItems(item: SiteNavigationItem) {
  return Array.isArray(item.items) && item.items.length > 0;
}

function MobileNavLink({
  href,
  label,
  variant = "navChild",
}: {
  href: string;
  label: string;
  variant?: "navTop" | "navChild";
}) {
  return (
    <Dialog.Close asChild>
      <Link className={cn(textVariants({ variant }), "block py-2")} href={href}>
        {label}
      </Link>
    </Dialog.Close>
  );
}

function MobileNavGroup({ item }: { item: SiteNavigationItem }) {
  if (!hasItems(item)) {
    if (!item.href) return null;
    return <MobileNavLink href={item.href} label={item.label} variant="navTop" />;
  }

  return (
    <section className="space-y-3">
      <Text as="p" variant="navTop">
        {item.label}
      </Text>

      <div className="space-y-4 pl-4">
        {item.href ? (
          <MobileNavLink href={item.href} label={`${item.label} overview`} />
        ) : null}

        {item.items?.map((child) => (
          <MobileNavSection item={child} key={`${item.label}-${child.label}`} />
        ))}
      </div>
    </section>
  );
}

function MobileNavSection({ item }: { item: SiteNavigationItem }) {
  if (!hasItems(item)) {
    if (!item.href) return null;
    return <MobileNavLink href={item.href} label={item.label} />;
  }

  return (
    <div className="space-y-2">
      <Text as="p" variant="navSection">
        {item.label}
      </Text>

      <div className="space-y-1.5">
        {item.href ? (
          <MobileNavLink href={item.href} label={`${item.label} overview`} />
        ) : null}

        {item.items?.map((child) => (
          <MobileNavSection item={child} key={`${item.label}-${child.label}`} />
        ))}
      </div>
    </div>
  );
}

export function MobileMenu() {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label="open navigation menu"
        className={cn(buttonVariants({ variant: "ghost" }), "px-4 py-2 md:hidden")}
      >
        menu
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" />

        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-border bg-background shadow-lg md:hidden">
          <Dialog.Title className="sr-only">navigation menu</Dialog.Title>

          <div className="border-b border-border/80">
            <PageContainer className="flex items-center justify-between py-5">
              <Text as="span" variant="brand">
                {siteConfig.name}
              </Text>

              <Dialog.Close
                aria-label="close navigation menu"
                className={cn(buttonVariants({ variant: "ghost" }), "px-4 py-2")}
              >
                close
              </Dialog.Close>
            </PageContainer>
          </div>

          <PageContainer className="flex h-full flex-col gap-8 py-6">
            <nav className="space-y-6">
              {siteConfig.navigation.map((item) => (
                <MobileNavGroup item={item} key={item.label} />
              ))}
            </nav>

            <Dialog.Close asChild>
              <Link
                className={cn(buttonVariants(), "w-full justify-center")}
                href="/contact"
              >
                book a consultation
              </Link>
            </Dialog.Close>
          </PageContainer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

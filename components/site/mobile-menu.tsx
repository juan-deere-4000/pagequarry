"use client";

import * as Accordion from "@radix-ui/react-accordion";
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

function MobileNavBranch({
  item,
  path,
}: {
  item: SiteNavigationItem;
  path: string;
}) {
  if (!hasItems(item)) {
    if (!item.href) return null;

    return (
      <Dialog.Close asChild>
        <Link
          className={cn(textVariants({ variant: "nav" }), "block py-1 text-base")}
          href={item.href}
        >
          {item.label}
        </Link>
      </Dialog.Close>
    );
  }

  return (
    <Accordion.Item className="border-b border-border/70 pb-3" value={path}>
      <Accordion.Header>
        <Accordion.Trigger
          className={cn(
            textVariants({ variant: "nav" }),
            "flex w-full items-center justify-between py-1 text-left text-base focus-visible:outline-none"
          )}
        >
          <span>{item.label}</span>
          <span className="text-xs text-muted-foreground">+</span>
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content className="pt-3">
        <div className="space-y-3 border-l border-border/70 pl-4">
          {item.href ? (
            <Dialog.Close asChild>
              <Link
                className={cn(
                  textVariants({ variant: "nav" }),
                  "block py-1 text-sm font-medium text-foreground"
                )}
                href={item.href}
              >
                {item.label} overview
              </Link>
            </Dialog.Close>
          ) : null}

          {item.items?.map((child, index) => (
            <MobileNavNode
              item={child}
              key={`${path}-${child.label}`}
              path={`${path}-${index}`}
            />
          ))}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

function MobileNavNode({
  item,
  path,
}: {
  item: SiteNavigationItem;
  path: string;
}) {
  if (hasItems(item)) {
    return (
      <Accordion.Root type="multiple">
        <MobileNavBranch item={item} path={path} />
      </Accordion.Root>
    );
  }

  if (!item.href) return null;

  return (
    <Dialog.Close asChild>
      <Link
        className={cn(textVariants({ variant: "nav" }), "block py-1 text-sm")}
        href={item.href}
      >
        {item.label}
      </Link>
    </Dialog.Close>
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

          <PageContainer className="flex h-full flex-col gap-6 py-6">
            <nav className="flex flex-col gap-3">
              {siteConfig.navigation.map((item, index) => (
                <MobileNavNode item={item} key={`${item.label}-${index}`} path={`top-${index}`} />
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

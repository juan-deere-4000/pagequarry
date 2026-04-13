"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

import { buttonVariants } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Text, textVariants } from "@/components/site/text";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/site/config";

function MobileNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const external = href.startsWith("http");
  return (
    <Dialog.Close asChild>
      <Link
        className={cn(textVariants({ variant: "navTop" }), "block py-2")}
        href={href}
        rel={external ? "noreferrer" : undefined}
        target={external ? "_blank" : undefined}
      >
        {label}
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
        <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/14 backdrop-blur-sm md:hidden" />

        <Dialog.Content className="site-panel fixed inset-y-3 right-3 z-50 w-[calc(100%-1.5rem)] max-w-sm overflow-y-auto rounded-[1.75rem] border border-border shadow-lg md:hidden">
          <Dialog.Title className="sr-only">navigation menu</Dialog.Title>

          <div className="border-b border-border/80">
            <PageContainer className="flex items-center justify-between py-5">
              <Text as="span" variant="brand">
                {siteConfig.identity.name}
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
            <nav aria-label="mobile primary" className="space-y-4">
              {siteConfig.navigation.map((item) => (
                <MobileNavLink href={item.href} key={item.href} label={item.label} />
              ))}
            </nav>

            <Dialog.Close asChild>
              <Link
                className={cn(buttonVariants({ variant: "solid" }), "w-full justify-center")}
                href={siteConfig.contact.primaryAction.href}
                rel="noreferrer"
                target="_blank"
              >
                {siteConfig.contact.primaryAction.label}
              </Link>
            </Dialog.Close>
          </PageContainer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

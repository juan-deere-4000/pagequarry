"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";

import { buttonVariants } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Text, textVariants } from "@/components/site/text";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

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
              {siteConfig.navigation.map((item) => (
                <Dialog.Close asChild key={item.href}>
                  <Link
                    className={cn(textVariants({ variant: "nav" }), "py-1 text-base")}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </Dialog.Close>
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

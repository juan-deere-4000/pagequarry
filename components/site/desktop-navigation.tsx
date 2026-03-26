import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";

import { Text, textVariants } from "@/components/site/text";
import type { SiteNavigationItem } from "@/content/types";
import { cn } from "@/lib/cn";

function hasItems(item: SiteNavigationItem) {
  return Array.isArray(item.items) && item.items.length > 0;
}

function NavLink({
  href,
  label,
  variant = "navChild",
  className,
}: {
  href: string;
  label: string;
  variant?: "navTop" | "navChild";
  className?: string;
}) {
  return (
    <NavigationMenu.Link asChild>
      <Link className={cn(textVariants({ variant }), className)} href={href}>
        {label}
      </Link>
    </NavigationMenu.Link>
  );
}

function DropdownSection({ item }: { item: SiteNavigationItem }) {
  if (!hasItems(item)) {
    if (!item.href) return null;

    return <NavLink className="block py-1.5" href={item.href} label={item.label} />;
  }

  return (
    <section className="space-y-2">
      <Text as="p" variant="navSection">
        {item.label}
      </Text>

      <div className="space-y-1.5">
        {item.href ? (
          <NavLink className="block py-1.5" href={item.href} label={`${item.label} overview`} />
        ) : null}

        {item.items?.map((child) => (
          <DropdownSection item={child} key={`${item.label}-${child.label}`} />
        ))}
      </div>
    </section>
  );
}

function DropdownPanel({ item }: { item: SiteNavigationItem }) {
  return (
    <NavigationMenu.Content className="absolute left-1/2 top-full z-40 w-[22rem] -translate-x-1/2 pt-4">
      <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
        {item.href ? (
          <NavLink
            className="mb-5 block border-b border-border/70 pb-3"
            href={item.href}
            label={`${item.label} overview`}
            variant="navTop"
          />
        ) : null}

        <div className="space-y-5">
          {item.items?.map((child) => (
            <DropdownSection item={child} key={`${item.label}-${child.label}`} />
          ))}
        </div>
      </div>
    </NavigationMenu.Content>
  );
}

export function DesktopNavigation({
  items,
}: {
  items: readonly SiteNavigationItem[];
}) {
  return (
    <NavigationMenu.Root className="relative hidden md:block">
      <NavigationMenu.List className="flex items-center gap-6">
        {items.map((item) => {
          if (!hasItems(item)) {
            if (!item.href) return null;

            return (
              <NavigationMenu.Item key={item.label}>
                <NavLink href={item.href} label={item.label} variant="navTop" />
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item className="relative" key={item.label}>
              <NavigationMenu.Trigger
                className={cn(
                  textVariants({ variant: "navTop" }),
                  "inline-flex items-center gap-2 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                {item.label}
                <span className="text-[10px] text-muted-foreground">+</span>
              </NavigationMenu.Trigger>

              <DropdownPanel item={item} />
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";

import type { SiteNavigationItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { Text, textVariants } from "@/components/site/text";

function hasItems(item: SiteNavigationItem) {
  return Array.isArray(item.items) && item.items.length > 0;
}

function NavLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <NavigationMenu.Link asChild>
      <Link className={cn(textVariants({ variant: "nav" }), className)} href={href}>
        {label}
      </Link>
    </NavigationMenu.Link>
  );
}

function DesktopBranch({
  item,
  depth = 0,
}: {
  item: SiteNavigationItem;
  depth?: number;
}) {
  if (!hasItems(item)) {
    if (!item.href) return null;
    return <NavLink className="block py-1.5" href={item.href} label={item.label} />;
  }

  return (
    <div
      className={cn(
        "space-y-2",
        depth > 0 && "border-l border-border/70 pl-4"
      )}
      key={`${item.label}-${depth}`}
    >
      <div className="space-y-1">
        {item.href ? (
          <NavLink className="block py-1 text-sm font-medium text-foreground hover:text-accent" href={item.href} label={item.label} />
        ) : (
          <Text as="p" className="text-sm font-medium text-foreground" variant="bodySmall">
            {item.label}
          </Text>
        )}
      </div>

      <div className="space-y-1">
        {item.items?.map((child) => (
          <DesktopBranch depth={depth + 1} item={child} key={`${item.label}-${child.label}`} />
        ))}
      </div>
    </div>
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
                <NavLink href={item.href} label={item.label} />
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item className="relative" key={item.label}>
              <NavigationMenu.Trigger
                className={cn(
                  textVariants({ variant: "nav" }),
                  "inline-flex items-center gap-2 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                {item.label}
                <span className="text-xs text-muted-foreground">+</span>
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className="absolute left-1/2 top-full z-40 w-[min(42rem,calc(100vw-4rem))] -translate-x-1/2 pt-4">
                <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                  {item.href ? (
                    <NavLink
                      className="mb-4 block border-b border-border/70 pb-3 font-medium text-foreground hover:text-accent"
                      href={item.href}
                      label={`${item.label} overview`}
                    />
                  ) : null}

                  <div className="grid gap-5 md:grid-cols-2">
                    {item.items?.map((child) => (
                      <DesktopBranch item={child} key={`${item.label}-${child.label}`} />
                    ))}
                  </div>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

import Link from "next/link";

import { textVariants } from "@/components/site/text";
import type { SiteNavigationItem } from "@/content/types";
import { cn } from "@/lib/cn";

export function DesktopNavigation({
  items,
}: {
  items: readonly SiteNavigationItem[];
}) {
  return (
    <nav aria-label="primary" className="hidden items-center gap-2 md:flex">
      {items.map((item) => {
        const external = item.href.startsWith("http");
        return (
          <Link
            className={cn(
              textVariants({ variant: "navTop" }),
              "rounded-full px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
            href={item.href}
            key={item.href}
            rel={external ? "noreferrer" : undefined}
            target={external ? "_blank" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

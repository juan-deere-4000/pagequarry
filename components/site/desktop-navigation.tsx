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
    <nav aria-label="primary" className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex lg:gap-2 xl:gap-3">
      {items.map((item) => {
        const external = item.href.startsWith("http");
        return (
          <Link
            className={cn(
              textVariants({ variant: "navTop" }),
              "rounded-full px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:px-3.5"
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

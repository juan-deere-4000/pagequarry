import Link from "next/link";

import { Button, buttonVariants } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Text } from "@/components/site/text";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

export function MobileMenu() {
  return (
    <details className="md:hidden">
      <summary
        aria-label="toggle navigation"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "cursor-pointer list-none px-4 py-2 [&::-webkit-details-marker]:hidden [&::marker]:hidden"
        )}
      >
        menu
      </summary>

      <div className="border-t border-border/80 bg-background">
        <PageContainer className="flex flex-col gap-6 py-5">
          <nav className="flex flex-col gap-3">
            {siteConfig.navigation.map((item) => (
              <Text
                as={Link}
                className="py-1 text-base"
                href={item.href}
                key={item.href}
                variant="nav"
              >
                {item.label}
              </Text>
            ))}
          </nav>

          <Button asChild className="w-full justify-center">
            <Link href="/contact">book a consultation</Link>
          </Button>
        </PageContainer>
      </div>
    </details>
  );
}

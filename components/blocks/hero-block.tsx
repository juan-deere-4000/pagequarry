import Link from "next/link";

import { Button } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import type { HeroBlockData } from "@/content/types";

export function HeroBlock({
  eyebrow,
  title,
  deck,
  action,
  aside,
}: HeroBlockData) {
  return (
    <Section spacing="hero">
      <PageContainer className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="max-w-4xl">
          <Text className="mb-4" variant="eyebrow">
            {eyebrow}
          </Text>
          <Text as="h1" className="max-w-4xl" variant="display">
            {title}
          </Text>
          <Text as="p" className="mt-6 max-w-2xl" variant="lead">
            {deck}
          </Text>
          {action ? (
            <div className="mt-8">
              <Button asChild>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            </div>
          ) : null}
        </div>

        {aside ? (
          <div className="border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <Text as="p" variant="bodySmall" className="leading-7">
              {aside}
            </Text>
          </div>
        ) : null}
      </PageContainer>
    </Section>
  );
}

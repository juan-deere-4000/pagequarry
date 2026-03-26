import Link from "next/link";

import { Button } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import type { CtaBlockData } from "@/content/types";

export function CtaBlock({ title, body, action }: CtaBlockData) {
  return (
    <Section spacing="cta" tone="accent">
      <PageContainer className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl">
          <Text as="h2" className="sm:text-5xl" variant="sectionTitle">
            {title}
          </Text>
          <Text as="p" className="mt-4" variant="lead">
            {body}
          </Text>
        </div>

        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      </PageContainer>
    </Section>
  );
}

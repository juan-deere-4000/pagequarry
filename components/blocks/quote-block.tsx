import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import type { QuoteBlockData } from "@/content/types";

export function QuoteBlock({
  quote,
  attribution,
  context,
}: QuoteBlockData) {
  return (
    <Section spacing="default" tone="subtle">
      <PageContainer width="reading">
        <blockquote className="border-l border-accent pl-6">
          <Text className="sm:text-4xl" variant="quote">
            “{quote}”
          </Text>
          <footer className="mt-6 space-y-1 text-sm text-muted-foreground">
            <Text as="p" className="font-medium text-foreground" variant="bodySmall">
              {attribution}
            </Text>
            <Text as="p" variant="bodySmall">
              {context}
            </Text>
          </footer>
        </blockquote>
      </PageContainer>
    </Section>
  );
}

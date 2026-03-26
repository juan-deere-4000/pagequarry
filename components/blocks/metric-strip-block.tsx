import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import type { MetricStripBlockData } from "@/content/types";

export function MetricStripBlock({ items }: MetricStripBlockData) {
  return (
    <Section spacing="compact">
      <PageContainer>
        <div className="grid gap-6 border-y border-border py-6 sm:grid-cols-3">
          {items.map((item) => (
            <div className="space-y-1" key={item.label}>
              <Text variant="metricLabel">
                {item.label}
              </Text>
              <Text variant="metricValue">
                {item.value}
              </Text>
            </div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}

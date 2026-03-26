import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import type { ProcessBlockData } from "@/content/types";

export function ProcessBlock({ eyebrow, title, steps }: ProcessBlockData) {
  return (
    <Section spacing="default">
      <PageContainer className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          <Text className="mb-3" variant="eyebrow">
            {eyebrow}
          </Text>
          <Text as="h2" variant="sectionTitle">
            {title}
          </Text>
        </div>

        <ol className="grid gap-5">
          {steps.map((step, index) => (
            <li
              className="grid gap-2 border-t border-border pt-5 sm:grid-cols-[3rem_minmax(0,1fr)]"
              key={step.title}
            >
              <span className="font-serif text-2xl leading-none text-accent">
                0{index + 1}
              </span>
              <div>
                <Text as="h3" variant="subhead">
                  {step.title}
                </Text>
                <Text as="p" className="mt-2" variant="body">
                  {step.body}
                </Text>
              </div>
            </li>
          ))}
        </ol>
      </PageContainer>
    </Section>
  );
}

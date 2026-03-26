import Link from "next/link";

import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import type { SectionCopyBlockData } from "@/content/types";

export function SectionCopyBlock({
  eyebrow,
  title,
  body,
  bullets,
  links,
  tone = "default",
}: SectionCopyBlockData) {
  return (
    <Section spacing="default" tone={tone}>
      <PageContainer className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          {eyebrow ? (
            <Text className="mb-3" variant="eyebrow">
              {eyebrow}
            </Text>
          ) : null}
          <Text as="h2" variant="sectionTitle">
            {title}
          </Text>
        </div>

        <div className="space-y-6">
          <Text as="p" variant="body">
            {body}
          </Text>

          {bullets?.length ? (
            <ul className="space-y-3 border-l border-border pl-5">
              {bullets.map((item) => (
                <li key={item}>
                  <Text as="span" variant="body">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          ) : null}

          {links?.length ? (
            <div className="space-y-4 border-t border-border pt-6">
              {links.map((link) => (
                <div className="space-y-1" key={link.href}>
                  <Text as={Link} href={link.href} variant="link">
                    <span>{link.label}</span>
                    <span aria-hidden="true"> {"→"}</span>
                  </Text>
                  {link.summary ? (
                    <Text as="p" variant="bodySmall">
                      {link.summary}
                    </Text>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </Section>
  );
}

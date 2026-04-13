import Link from "next/link";

import { RenderBlock } from "@/components/renderers/render-block";
import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import { blockRenderKeys } from "@/components/templates/block-keys";
import type { ContentBlock, ManagedPage, SectionCopyBlockData } from "@/content/types";
import { cn } from "@/lib/cn";

function HubSectionCard({
  block,
  index,
}: {
  block: SectionCopyBlockData;
  index: number;
}) {
  const toneClass =
    index % 3 === 0
      ? "bg-white/82"
      : index % 3 === 1
        ? "bg-slate-50/82"
        : "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(236,244,251,0.86))]";

  return (
    <article
      className={cn(
        "rounded-[1.75rem] border border-white/70 p-6 shadow-[0_24px_60px_rgba(16,32,48,0.08)] backdrop-blur-xl sm:p-7",
        index === 0 ? "lg:col-span-2" : "",
        toneClass
      )}
    >
      {block.eyebrow ? (
        <Text className="mb-3" variant="eyebrow">
          {block.eyebrow}
        </Text>
      ) : null}

      <Text as="h2" className="max-w-xl" variant="subhead">
        {block.title}
      </Text>

      <div className="mt-5 space-y-4">
        {block.body.split(/\n\n+/).map((paragraph, index) => (
          <Text as="p" key={index} variant="body">
            {paragraph}
          </Text>
        ))}
      </div>

      {block.bullets?.length ? (
        <ul className="mt-6 grid gap-3">
          {block.bullets.map((item) => (
            <li
              className="rounded-[1.1rem] border border-slate-200/80 bg-white/72 px-4 py-3"
              key={item}
            >
              <Text as="span" className="text-foreground" variant="bodySmall">
                {item}
              </Text>
            </li>
          ))}
        </ul>
      ) : null}

      {block.links?.length ? (
        <div className="mt-6 grid gap-3">
          {block.links.map((link) => (
            <Link
              className="rounded-[1.1rem] border border-slate-200/80 bg-white/88 px-4 py-4 shadow-[0_16px_32px_rgba(16,32,48,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
              href={link.href}
              key={link.href}
            >
              <Text as="span" className="inline-flex items-center gap-2" variant="link">
                <span>{link.label}</span>
                <span aria-hidden="true">→</span>
              </Text>
              {link.summary ? (
                <Text as="p" className="mt-2" variant="bodySmall">
                  {link.summary}
                </Text>
              ) : null}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function PageQuarryHubTemplate({ page }: { page: ManagedPage }) {
  const keys = blockRenderKeys(page.blocks);
  const heroBlock = page.blocks[0];
  const ctaBlock = page.blocks.at(-1);
  const middleBlocks = page.blocks.slice(1, -1);

  return (
    <>
      {heroBlock ? <RenderBlock block={heroBlock} key={keys[0]} /> : null}

      <Section spacing="default">
        <PageContainer>
          <div className="grid gap-4 lg:grid-cols-2">
            {middleBlocks.map((block, index) => {
              if (block.type !== "sectionCopy") {
                return <RenderBlock block={block as ContentBlock} key={keys[index + 1]} />;
              }

              return (
                <HubSectionCard
                  block={block}
                  index={index}
                  key={keys[index + 1]}
                />
              );
            })}
          </div>
        </PageContainer>
      </Section>

      {ctaBlock ? <RenderBlock block={ctaBlock} key={keys[keys.length - 1]} /> : null}
    </>
  );
}

function NarrativeSection({
  block,
  index,
}: {
  block: SectionCopyBlockData;
  index: number;
}) {
  const frameClass =
    index % 3 === 0
      ? "rounded-[1.75rem] border border-white/70 bg-white/72 p-6 shadow-[0_24px_60px_rgba(16,32,48,0.08)] sm:p-8"
      : index % 3 === 1
        ? "border-l-4 border-accent/22 pl-5 sm:pl-7"
        : "border-t border-slate-200/80 pt-6";

  return (
    <Section spacing="default">
      <PageContainer width="reading">
        <div className={frameClass}>
          {block.eyebrow ? (
            <Text className="mb-3" variant="eyebrow">
              {block.eyebrow}
            </Text>
          ) : null}

          <Text as="h2" className="max-w-3xl" variant="sectionTitle">
            {block.title}
          </Text>

          <div className="mt-5 max-w-3xl space-y-4">
            {block.body.split(/\n\n+/).map((paragraph, index) => (
              <Text as="p" key={index} variant="body">
                {paragraph}
              </Text>
            ))}
          </div>

          {block.bullets?.length ? (
            <ul className="mt-6 grid gap-3">
              {block.bullets.map((item) => (
                <li className="rounded-[1rem] bg-white/60 px-4 py-3" key={item}>
                  <Text as="span" variant="bodySmall">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          ) : null}

          {block.links?.length ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {block.links.map((link) => (
                <Link
                  className="rounded-[1.1rem] border border-slate-200/80 bg-white/86 px-4 py-4 shadow-[0_16px_32px_rgba(16,32,48,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
                  href={link.href}
                  key={link.href}
                >
                  <Text as="span" className="inline-flex items-center gap-2" variant="link">
                    <span>{link.label}</span>
                    <span aria-hidden="true">→</span>
                  </Text>
                  {link.summary ? (
                    <Text as="p" className="mt-2" variant="bodySmall">
                      {link.summary}
                    </Text>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </Section>
  );
}

export function PageQuarryNarrativeTemplate({ page }: { page: ManagedPage }) {
  const keys = blockRenderKeys(page.blocks);
  const heroBlock = page.blocks[0];
  const ctaBlock = page.blocks.at(-1);
  const middleBlocks = page.blocks.slice(1, -1);

  return (
    <>
      {heroBlock ? <RenderBlock block={heroBlock} key={keys[0]} /> : null}

      {middleBlocks.map((block, index) => {
        if (block.type === "sectionCopy") {
          return (
            <NarrativeSection
              block={block}
              index={index}
              key={keys[index + 1]}
            />
          );
        }

        return <RenderBlock block={block} key={keys[index + 1]} />;
      })}

      {ctaBlock ? <RenderBlock block={ctaBlock} key={keys[keys.length - 1]} /> : null}
    </>
  );
}

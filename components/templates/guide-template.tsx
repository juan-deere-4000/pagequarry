import { RenderBlock } from "@/components/renderers/render-block";
import type { ContentBlock, GuidePage } from "@/content/types";

export function GuideTemplate({ page }: { page: GuidePage }) {
  const blocks: ContentBlock[] = [
    { type: "hero" as const, ...page.hero },
    {
      type: "sectionCopy" as const,
      title: "what it is",
      body: page.whatItIs,
      eyebrow: "guide",
    },
    {
      type: "sectionCopy" as const,
      title: "architecture",
      body: page.architecture,
      eyebrow: "system",
      tone: "subtle" as const,
    },
    {
      type: "sectionCopy" as const,
      title: "personal use cases",
      body: page.personalIntro,
      bullets: page.personalUseCases,
      eyebrow: "personal",
    },
    {
      type: "sectionCopy" as const,
      title: "business use cases",
      body: page.businessIntro,
      bullets: page.businessUseCases,
      eyebrow: "business",
      tone: "subtle" as const,
    },
    {
      type: "sectionCopy" as const,
      title: "related paths",
      body: page.relatedIntro,
      links: page.relatedLinks,
      eyebrow: "next",
    },
    { type: "cta" as const, ...page.cta },
  ];

  return (
    <>
      {blocks.map((block, index) => (
        <RenderBlock
          block={block}
          key={`${block.type}-${"title" in block ? block.title : index}`}
        />
      ))}
    </>
  );
}

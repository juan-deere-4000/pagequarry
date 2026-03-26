import { RenderBlock } from "@/components/renderers/render-block";
import type { CaseStudyPage, ContentBlock } from "@/content/types";

export function CaseStudyTemplate({ page }: { page: CaseStudyPage }) {
  const blocks: ContentBlock[] = [
    { type: "hero" as const, ...page.hero },
    { type: "metrics" as const, ...page.metrics },
    {
      type: "sectionCopy" as const,
      title: "the challenge",
      body: page.challengeIntro,
      bullets: page.challenge,
      eyebrow: "problem",
    },
    {
      type: "sectionCopy" as const,
      title: "the solution",
      body: page.solutionIntro,
      bullets: page.solution,
      eyebrow: "build",
      tone: "subtle" as const,
    },
    {
      type: "sectionCopy" as const,
      title: "the result",
      body: page.resultIntro,
      bullets: page.results,
      eyebrow: "result",
    },
    {
      type: "sectionCopy" as const,
      title: "the same system, a different configuration",
      body: page.configuration,
      links: page.relatedLinks,
      eyebrow: "context",
      tone: "subtle" as const,
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

import { RenderBlock } from "@/components/renderers/render-block";
import type { ContentBlock, HomePage } from "@/content/types";

export function HomeTemplate({ page }: { page: HomePage }) {
  const blocks: ContentBlock[] = [
    { type: "hero", ...page.hero },
    { type: "metrics", ...page.metrics },
    ...page.sections.map((section) => ({ type: "sectionCopy" as const, ...section })),
    { type: "process", ...page.process },
    { type: "quote", ...page.quote },
    { type: "cta", ...page.cta },
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

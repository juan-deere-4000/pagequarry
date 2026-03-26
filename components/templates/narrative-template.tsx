import { RenderBlock } from "@/components/renderers/render-block";
import type { ContentBlock, NarrativePage } from "@/content/types";

export function NarrativeTemplate({ page }: { page: NarrativePage }) {
  const blocks: ContentBlock[] = [
    { type: "hero", ...page.hero },
    ...page.sections.map((section) => ({ type: "sectionCopy" as const, ...section })),
    ...(page.process ? [{ type: "process" as const, ...page.process }] : []),
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

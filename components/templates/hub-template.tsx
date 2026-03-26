import { RenderBlock } from "@/components/renderers/render-block";
import type { ContentBlock, HubPage } from "@/content/types";

export function HubTemplate({ page }: { page: HubPage }) {
  const blocks: ContentBlock[] = [
    { type: "hero", ...page.hero },
    ...page.sections.map((section) => ({ type: "sectionCopy" as const, ...section })),
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

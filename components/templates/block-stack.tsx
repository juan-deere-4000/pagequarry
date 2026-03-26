import { RenderBlock } from "@/components/renderers/render-block";
import type { ContentBlock } from "@/content/types";

export function BlockStack({ blocks }: { blocks: ContentBlock[] }) {
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

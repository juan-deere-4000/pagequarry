import { blockRenderKeys } from "@/components/templates/block-keys";
import { RenderBlock } from "@/components/renderers/render-block";
import type { ContentBlock } from "@/content/types";

export function BlockStack({ blocks }: { blocks: ContentBlock[] }) {
  const keys = blockRenderKeys(blocks);

  return (
    <>
      {blocks.map((block, index) => (
        <RenderBlock block={block} key={keys[index]} />
      ))}
    </>
  );
}

import type { ComponentType } from "react";

import { blockRegistry } from "@/components/blocks/registry";
import type { ContentBlock } from "@/content/types";

export function RenderBlock({ block }: { block: ContentBlock }) {
  const { type, ...props } = block;
  const Component = blockRegistry[type] as ComponentType<typeof props>;

  return <Component {...props} />;
}

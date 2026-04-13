import type { ComponentType } from "react";

import type { ContentBlock } from "@/content/types";
import { siteBlockRegistry } from "@/site/blocks";

export function RenderBlock({ block }: { block: ContentBlock }) {
  const { type, ...props } = block;
  const Component = siteBlockRegistry[type] as ComponentType<typeof props>;

  return <Component {...props} />;
}

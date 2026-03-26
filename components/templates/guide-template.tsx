import { BlockStack } from "@/components/templates/block-stack";
import type { ManagedPage } from "@/content/types";

export function GuideTemplate({ page }: { page: ManagedPage }) {
  return <BlockStack blocks={page.blocks} />;
}

import { BlockStack } from "@/components/templates/block-stack";
import type { ManagedPage } from "@/content/types";

export function NarrativeTemplate({ page }: { page: ManagedPage }) {
  return <BlockStack blocks={page.blocks} />;
}

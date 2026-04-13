import { blockRegistry as coreBlockRegistry } from "@/components/blocks/registry";

export const siteBlockRegistry = {
  ...coreBlockRegistry,
} satisfies typeof coreBlockRegistry;

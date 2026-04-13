import { blockRegistry as coreBlockRegistry } from "@/components/blocks/registry";

export type SiteBlockRegistry = typeof coreBlockRegistry;

// downstream forks can swap existing renderer keys here without touching core.
// adding new block names still requires contract and parser work in lib/content/*.
const siteBlockOverrides = {} satisfies Partial<SiteBlockRegistry>;

export const siteBlockRegistry = {
  ...coreBlockRegistry,
  ...siteBlockOverrides,
} satisfies SiteBlockRegistry;

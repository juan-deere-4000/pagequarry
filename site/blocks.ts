import { blockRegistry as coreBlockRegistry } from "@/components/blocks/registry";
import {
  PageQuarryCtaBlock,
  PageQuarryHeroBlock,
  PageQuarryMetricStripBlock,
  PageQuarryProcessBlock,
  PageQuarryQuoteBlock,
  PageQuarrySectionCopyBlock,
} from "@/site/block-overrides";

export type SiteBlockRegistry = typeof coreBlockRegistry;

// downstream forks can swap existing renderer keys here without touching core.
// adding new block names still requires contract and parser work in lib/content/*.
const siteBlockOverrides = {
  cta: PageQuarryCtaBlock,
  hero: PageQuarryHeroBlock,
  metrics: PageQuarryMetricStripBlock,
  process: PageQuarryProcessBlock,
  quote: PageQuarryQuoteBlock,
  sectionCopy: PageQuarrySectionCopyBlock,
} satisfies Partial<SiteBlockRegistry>;

export const siteBlockRegistry = {
  ...coreBlockRegistry,
  ...siteBlockOverrides,
} satisfies SiteBlockRegistry;

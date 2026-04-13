import { templateRegistry as coreTemplateRegistry } from "@/components/templates/registry";

export type SiteTemplateRegistry = typeof coreTemplateRegistry;

// downstream forks can swap existing template keys here without touching core.
// adding new template names still requires contract and parser work in lib/content/*.
const siteTemplateOverrides = {} satisfies Partial<SiteTemplateRegistry>;

export const siteTemplateRegistry = {
  ...coreTemplateRegistry,
  ...siteTemplateOverrides,
} satisfies SiteTemplateRegistry;

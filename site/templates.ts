import { templateRegistry as coreTemplateRegistry } from "@/components/templates/registry";

export const siteTemplateRegistry = {
  ...coreTemplateRegistry,
} satisfies typeof coreTemplateRegistry;

import type { ComponentType } from "react";

import type { ManagedPage } from "@/content/types";
import { siteTemplateRegistry } from "@/site/templates";

export function RenderPage({ page }: { page: ManagedPage }) {
  const Template = siteTemplateRegistry[page.template] as ComponentType<{
    page: typeof page;
  }>;

  return <Template page={page} />;
}

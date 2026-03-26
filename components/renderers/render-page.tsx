import type { ComponentType } from "react";

import { templateRegistry } from "@/components/templates/registry";
import type { SitePage } from "@/content/types";

export function RenderPage({ page }: { page: SitePage }) {
  const Template = templateRegistry[page.template] as ComponentType<{
    page: typeof page;
  }>;

  return <Template page={page} />;
}

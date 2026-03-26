import type { ComponentType } from "react";

import { templateRegistry } from "@/components/templates/registry";
import type { ManagedPage } from "@/content/types";

export function RenderPage({ page }: { page: ManagedPage }) {
  const Template = templateRegistry[page.template] as ComponentType<{
    page: typeof page;
  }>;

  return <Template page={page} />;
}

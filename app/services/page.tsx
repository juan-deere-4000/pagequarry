import type { Metadata } from "next";

import { RenderPage } from "@/components/renderers/render-page";
import { servicesPage } from "@/content/pages";

export const metadata: Metadata = servicesPage.meta;

export default function Page() {
  return <RenderPage page={servicesPage} />;
}

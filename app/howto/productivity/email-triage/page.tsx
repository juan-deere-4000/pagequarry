import type { Metadata } from "next";

import { RenderPage } from "@/components/renderers/render-page";
import { guidePage } from "@/content/pages";

export const metadata: Metadata = guidePage.meta;

export default function Page() {
  return <RenderPage page={guidePage} />;
}

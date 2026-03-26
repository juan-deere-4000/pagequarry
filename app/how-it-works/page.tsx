import type { Metadata } from "next";

import { RenderPage } from "@/components/renderers/render-page";
import { howItWorksPage } from "@/content/pages";

export const metadata: Metadata = howItWorksPage.meta;

export default function Page() {
  return <RenderPage page={howItWorksPage} />;
}

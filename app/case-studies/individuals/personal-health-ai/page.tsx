import type { Metadata } from "next";

import { RenderPage } from "@/components/renderers/render-page";
import { caseStudyPage } from "@/content/pages";

export const metadata: Metadata = caseStudyPage.meta;

export default function Page() {
  return <RenderPage page={caseStudyPage} />;
}

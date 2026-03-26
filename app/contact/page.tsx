import type { Metadata } from "next";

import { RenderPage } from "@/components/renderers/render-page";
import { contactPage } from "@/content/pages";

export const metadata: Metadata = contactPage.meta;

export default function Page() {
  return <RenderPage page={contactPage} />;
}

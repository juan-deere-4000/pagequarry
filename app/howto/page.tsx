import type { Metadata } from "next";

import { RenderPage } from "@/components/renderers/render-page";
import { StructuredData } from "@/components/site/structured-data";
import { buildGeneratedArchivePage } from "@/lib/content/archive";
import { buildNextMetadata, buildStructuredData } from "@/lib/content/metadata";
import { getLivePages, getPageBySlug } from "@/lib/content/runtime";

function resolvePage() {
  return getPageBySlug("/howto") ?? buildGeneratedArchivePage("howto", getLivePages());
}

export function generateMetadata(): Metadata {
  return buildNextMetadata(resolvePage());
}

export default function HowtoArchivePage() {
  const page = resolvePage();

  return (
    <>
      <StructuredData items={buildStructuredData(page)} />
      <RenderPage page={page} />
    </>
  );
}

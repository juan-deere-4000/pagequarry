import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/site/structured-data";
import { RenderPage } from "@/components/renderers/render-page";
import { buildNextMetadata, buildStructuredData } from "@/lib/content/metadata";
import { getPageBySlug } from "@/lib/content/runtime";
import { siteConfig } from "@/site/config";

export const dynamicParams = false;

export function generateMetadata(): Metadata {
  const page = getPageBySlug("/");

  if (!page) {
    return {
      description: siteConfig.identity.description,
      title: siteConfig.identity.title,
    };
  }

  return buildNextMetadata(page);
}

export default function HomePage() {
  const page = getPageBySlug("/");

  if (!page) notFound();

  return (
    <>
      <StructuredData items={buildStructuredData(page)} />
      <RenderPage page={page} />
    </>
  );
}

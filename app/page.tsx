import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/site/structured-data";
import { HomepageMarkdownShell } from "@/components/site/homepage-markdown-view";
import { RenderPage } from "@/components/renderers/render-page";
import { getHomepageMarkdownSource } from "@/lib/content/homepage-source";
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
  const homepageMarkdownSource = getHomepageMarkdownSource();

  if (!page) notFound();

  return (
    <HomepageMarkdownShell source={homepageMarkdownSource}>
      <StructuredData items={buildStructuredData(page)} />
      <RenderPage page={page} />
    </HomepageMarkdownShell>
  );
}

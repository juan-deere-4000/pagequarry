import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RenderPage } from "@/components/renderers/render-page";
import { siteConfig } from "@/content/site";
import { getPageBySlug } from "@/lib/content/runtime";

export const dynamicParams = false;

export function generateMetadata(): Metadata {
  const page = getPageBySlug("/");

  if (!page) {
    return {
      description: siteConfig.description,
      title: siteConfig.title,
    };
  }

  return {
    description: page.meta.description,
    title: siteConfig.title,
  };
}

export default function HomePage() {
  const page = getPageBySlug("/");

  if (!page) notFound();

  return <RenderPage page={page} />;
}

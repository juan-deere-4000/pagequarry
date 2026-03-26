import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/site/structured-data";
import { RenderPage } from "@/components/renderers/render-page";
import { siteConfig } from "@/content/site";
import { buildNextMetadata, buildStructuredData } from "@/lib/content/metadata";
import {
  getPageBySlug,
  nonRootPageParams,
  slugFromSegments,
} from "@/lib/content/runtime";

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return nonRootPageParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolved = await params;
  const page = getPageBySlug(slugFromSegments(resolved.slug));

  if (!page) {
    return {
      description: siteConfig.description,
      title: siteConfig.title,
    };
  }

  return buildNextMetadata(page);
}

export default async function Page({ params }: PageProps) {
  const resolved = await params;
  const page = getPageBySlug(slugFromSegments(resolved.slug));

  if (!page) notFound();

  return (
    <>
      <StructuredData items={buildStructuredData(page)} />
      <RenderPage page={page} />
    </>
  );
}

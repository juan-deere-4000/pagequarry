import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuredData } from "@/components/site/structured-data";
import { RenderPage } from "@/components/renderers/render-page";
import { buildNextMetadata, buildStructuredData } from "@/lib/content/metadata";
import {
  getPageBySlug,
  nonRootPageParams,
  slugFromSegments,
} from "@/lib/content/runtime";
import { siteConfig } from "@/site/config";

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
      description: siteConfig.identity.description,
      title: siteConfig.identity.title,
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

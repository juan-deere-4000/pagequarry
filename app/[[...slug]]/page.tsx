import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RenderPage } from "@/components/renderers/render-page";
import { siteConfig } from "@/content/site";
import {
  getPageBySlug,
  nonRootPageParams,
  slugFromSegments,
} from "@/lib/content/runtime";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

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

  return {
    description: page.meta.description,
    title: page.slug === "/" ? siteConfig.title : page.meta.title,
  };
}

export default async function Page({ params }: PageProps) {
  const resolved = await params;
  const page = getPageBySlug(slugFromSegments(resolved.slug));

  if (!page) notFound();

  return <RenderPage page={page} />;
}

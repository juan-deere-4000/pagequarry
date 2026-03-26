import fs from "node:fs";
import path from "node:path";

import { cache } from "react";

import type { LiveContentIndex, ManagedPage } from "@/content/types";

function liveIndexPath() {
  return path.join(process.cwd(), "content", ".state", "live-content-index.json");
}

function emptyIndex(): LiveContentIndex {
  return {
    generatedAt: new Date(0).toISOString(),
    pages: [],
  };
}

function loadLiveIndex(): LiveContentIndex {
  try {
    const raw = fs.readFileSync(liveIndexPath(), "utf8");
    const parsed = JSON.parse(raw) as LiveContentIndex;
    return Array.isArray(parsed.pages) ? parsed : emptyIndex();
  } catch {
    return emptyIndex();
  }
}

export const getLivePages = cache(() => loadLiveIndex().pages);

export const getPageBySlug = cache((slug: string) => {
  return getLivePages().find((page) => page.slug === slug) ?? null;
});

export function slugFromSegments(segments?: string[]) {
  if (!segments?.length) return "/";
  return `/${segments.join("/")}`;
}

export function paramsFromSlug(slug: string) {
  if (slug === "/") return { slug: [] as string[] };
  return {
    slug: slug.replace(/^\//, "").split("/"),
  };
}

export function nonRootPageParams() {
  return getLivePages()
    .filter((page) => page.slug !== "/")
    .map((page) => paramsFromSlug(page.slug));
}

export function pageTitle(page: ManagedPage) {
  return page.slug === "/" ? page.meta.title : page.meta.title;
}

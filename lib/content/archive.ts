import crypto from "node:crypto";

import { siteConfig } from "@/content/site";
import type { ManagedPage } from "@/content/types";

type ArchiveKind = "howto" | "caseStudies";

type ArchiveEntry = {
  href: string;
  summary: string;
  title: string;
  updatedAt?: string;
};

type ArchiveGroup = {
  key: string;
  label: string;
  entries: ArchiveEntry[];
};

const archiveConfig = {
  caseStudies: {
    ctaBody:
      "if one of these case studies looks close to the way you work, the next step is a conversation about your actual data, tools, and constraints.",
    ctaTitle: "want a version of this for your own operation?",
    deck:
      "every published case study currently live on the site, grouped by audience. these are concrete proofs of the same private ai system applied to real operational environments.",
    description:
      "published case studies from siam ai lab, grouped by audience and generated from the live site index.",
    emptyBody:
      "there are no published case studies yet. once they are accepted into the live archive, they will appear here automatically.",
    groupOrder: ["individuals", "business"],
    groupPrefix: "audience",
    pageId: "case-studies-archive",
    seoTitle: "case studies archive",
    slug: "/case-studies",
    summary:
      "published case studies from siam ai lab, grouped by audience and generated from the live site index.",
    title: "all published case studies.",
  },
  howto: {
    ctaBody:
      "if a guide here is close to the workflow you want, the next step is scoping the actual system around your own tools, data, and constraints.",
    ctaTitle: "want one of these workflows on your own hardware?",
    deck:
      "every published how-to article currently live on the site, grouped by domain. these are the concrete workflow pages, not the broader service or narrative pages.",
    description:
      "published how-to articles from siam ai lab, grouped by domain and generated from the live site index.",
    emptyBody:
      "there are no published how-to articles yet. once they are accepted into the live archive, they will appear here automatically.",
    groupOrder: ["health", "productivity", "knowledge", "operations"],
    groupPrefix: "domain",
    pageId: "howto-archive",
    seoTitle: "how-to archive",
    slug: "/howto",
    summary:
      "published how-to articles from siam ai lab, grouped by domain and generated from the live site index.",
    title: "all published how-to articles.",
  },
} as const;

function labelFromSegment(segment: string) {
  return segment.replace(/-/g, " ");
}

function entriesForPrefix(kind: ArchiveKind, pages: ManagedPage[]) {
  const prefix = `${archiveConfig[kind].slug}/`;
  return pages.filter((page) => page.slug.startsWith(prefix));
}

function groupKeyForPage(kind: ArchiveKind, page: ManagedPage) {
  const parts = page.slug.replace(/^\//, "").split("/");
  return parts[1] || "other";
}

function latestTimestamp(pages: ManagedPage[]) {
  const stamps = pages
    .map((page) => page.meta.updatedAt || page.meta.publishedAt)
    .filter((value): value is string => Boolean(value))
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value));
  if (!stamps.length) return undefined;
  return new Date(Math.max(...stamps)).toISOString();
}

function hashValue(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function buildGroups(kind: ArchiveKind, pages: ManagedPage[]): ArchiveGroup[] {
  const grouped = new Map<string, ArchiveEntry[]>();
  for (const page of entriesForPrefix(kind, pages)) {
    const key = groupKeyForPage(kind, page);
    const list = grouped.get(key) || [];
    list.push({
      href: page.slug,
      summary: page.meta.summary,
      title: page.meta.title,
      updatedAt: page.meta.updatedAt,
    });
    grouped.set(key, list);
  }

  const order: readonly string[] = archiveConfig[kind].groupOrder;
  return [...grouped.entries()]
    .sort((a, b) => {
      const aIndex = order.indexOf(a[0]);
      const bIndex = order.indexOf(b[0]);
      if (aIndex !== -1 || bIndex !== -1) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }
      return a[0].localeCompare(b[0]);
    })
    .map(([key, entries]) => ({
      key,
      label: labelFromSegment(key),
      entries: [...entries].sort((a, b) => a.title.localeCompare(b.title)),
    }));
}

function buildBlocks(kind: ArchiveKind, groups: ArchiveGroup[]): ManagedPage["blocks"] {
  const config = archiveConfig[kind];
  const groupBlocks = groups.length
    ? groups.map((group) => ({
        type: "sectionCopy" as const,
        eyebrow: config.groupPrefix,
        title: group.label,
        body: `${group.entries.length} published ${kind === "howto" ? "guide" : "case study"}${group.entries.length === 1 ? "" : "s"} in this section.`,
        links: group.entries.map((entry) => ({
          href: entry.href,
          label: entry.title,
          summary: entry.summary,
        })),
      }))
    : [{
        type: "sectionCopy" as const,
        eyebrow: config.groupPrefix,
        title: "nothing published yet",
        body: config.emptyBody,
      }];

  return [
    {
      type: "hero",
      eyebrow: "published archive",
      title: config.title,
      deck: config.deck,
      action: { href: "/contact", label: "book a consultation" },
    },
    ...groupBlocks,
    {
      type: "cta",
      title: config.ctaTitle,
      body: config.ctaBody,
      action: { href: "/contact", label: "book a consultation" },
    },
  ];
}

export function buildGeneratedArchivePage(kind: ArchiveKind, pages: ManagedPage[]): ManagedPage {
  const config = archiveConfig[kind];
  const groups = buildGroups(kind, pages);
  const archivePages = entriesForPrefix(kind, pages);
  const updatedAt = latestTimestamp(archivePages);
  const sourceHash = hashValue(JSON.stringify(archivePages.map((page) => [page.pageId, page.sourceHash, page.meta.updatedAt || null])));

  return {
    blocks: buildBlocks(kind, groups),
    meta: {
      author: siteConfig.metadata.defaultAuthor,
      canonicalUrl: new URL(config.slug, siteConfig.siteUrl).toString(),
      description: config.description,
      publishedAt: updatedAt,
      robots: { follow: true, index: true },
      seoTitle: config.seoTitle,
      social: {
        description: config.summary,
        image: new URL(siteConfig.social.images.hub.path, siteConfig.siteUrl).toString(),
        imageVariant: "hub",
        title: config.seoTitle,
        twitterCard: siteConfig.social.defaultTwitterCard,
      },
      summary: config.summary,
      title: config.title,
      updatedAt,
    },
    pageId: config.pageId,
    redirectFrom: [],
    revisionId: `generated-${kind}-archive`,
    slug: config.slug,
    sourceHash,
    status: "published",
    template: "narrative",
  };
}

export function buildGeneratedArchivePages(pages: ManagedPage[]) {
  const kinds: ArchiveKind[] = ["howto", "caseStudies"];
  return kinds.flatMap((kind) => {
    const slug = archiveConfig[kind].slug;
    return pages.some((page) => page.slug === slug) ? [] : [buildGeneratedArchivePage(kind, pages)];
  });
}

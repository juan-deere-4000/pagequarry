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
      "replace these starter examples with your own published work once the editorial model is in place.",
    ctaTitle: "ready to publish your own case studies?",
    deck:
      "published case studies generated from the live site index. by default this archive groups entries by the second slug segment under `/case-studies/`.",
    description:
      "published case studies generated from the live site index.",
    emptyBody:
      "there are no published case studies yet. once they are accepted into the live archive, they will appear here automatically.",
    groupOrder: ["independent", "teams", "organizations"],
    groupPrefix: "segment",
    pageId: "case-studies-archive",
    seoTitle: "case studies archive",
    slug: "/case-studies",
    summary:
      "published case studies generated from the live site index.",
    title: "all published case studies.",
  },
  howto: {
    ctaBody:
      "use this archive as the editorial index for published guides, operational notes, and platform walkthroughs.",
    ctaTitle: "ready to publish your own guides?",
    deck:
      "published how-to pages generated from the live site index. by default this archive groups entries by the second slug segment under `/howto/`.",
    description:
      "published how-to articles generated from the live site index.",
    emptyBody:
      "there are no published how-to articles yet. once they are accepted into the live archive, they will appear here automatically.",
    groupOrder: ["editorial", "platform", "migration", "operations"],
    groupPrefix: "topic",
    pageId: "howto-archive",
    seoTitle: "how-to archive",
    slug: "/howto",
    summary:
      "published how-to articles generated from the live site index.",
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
      action: siteConfig.contact.primaryAction,
    },
    ...groupBlocks,
    {
      type: "cta",
      title: config.ctaTitle,
      body: config.ctaBody,
      action: siteConfig.contact.primaryAction,
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
      canonicalUrl: new URL(config.slug, siteConfig.identity.siteUrl).toString(),
      description: config.description,
      publishedAt: updatedAt,
      robots: { follow: true, index: true },
      seoTitle: config.seoTitle,
      social: {
        description: config.summary,
        image: new URL(
          siteConfig.social.images.hub.path,
          siteConfig.identity.siteUrl
        ).toString(),
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

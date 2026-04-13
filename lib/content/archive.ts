import crypto from "node:crypto";

import type { ManagedPage } from "@/content/types";
import { siteConfig } from "@/site/config";

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
      "Read the case study, then follow the workflow behind it.",
    ctaTitle: "Want to See the System in Motion?",
    deck:
      "Short proof pages that show how the publishing model works in practice.",
    description:
      "Proof pages showing how PageQuarry works in practice.",
    emptyBody:
      "There are no published case studies yet.",
    groupOrder: ["independent", "teams", "organizations"],
    groupPrefix: "segment",
    heroAction: {
      href: "/features",
      label: "View Features",
    },
    pageId: "case-studies-archive",
    seoTitle: "case studies archive",
    slug: "/case-studies",
    summary:
      "Proof pages showing how PageQuarry works in practice.",
    title: "Case Studies and Proof.",
    ctaAction: {
      href: "/how-it-works",
      label: "Read How It Works",
    },
  },
  howto: {
    ctaBody:
      "Start with the workflow guide, then read the architecture behind it.",
    ctaTitle: "Want the Operational View?",
    deck:
      "Short guides for running the publishing flow and understanding how the system behaves.",
    description:
      "Guides for running PageQuarry and understanding the publishing flow.",
    emptyBody:
      "There are no published guides yet.",
    groupOrder: ["editorial", "platform", "migration", "operations"],
    groupPrefix: "topic",
    heroAction: {
      href: "/how-it-works",
      label: "How It Works",
    },
    pageId: "howto-archive",
    seoTitle: "how-to archive",
    slug: "/howto",
    summary:
      "Guides for running PageQuarry and understanding the publishing flow.",
    title: "Guides and Workflows.",
    ctaAction: {
      href: "/features",
      label: "View Features",
    },
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
        body: `${group.entries.length} ${kind === "howto" ? "guide" : "case study"}${group.entries.length === 1 ? "" : "s"} in this section.`,
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
      action: config.heroAction,
    },
    ...groupBlocks,
    {
      type: "cta",
      title: config.ctaTitle,
      body: config.ctaBody,
      action: config.ctaAction,
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

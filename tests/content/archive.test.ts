import { describe, expect, it } from "vitest";

import type { ManagedPage } from "@/content/types";
import { buildGeneratedArchivePage, buildGeneratedArchivePages } from "@/lib/content/archive";
import { buildSitemapEntries } from "@/lib/content/metadata";
import { siteConfig } from "@/site/config";

function makePage(overrides: Partial<ManagedPage> = {}): ManagedPage {
  const slug = overrides.slug || "/howto/editorial/publishing-workflow";
  const title = overrides.meta?.title || "publishing workflow";

  return {
    blocks: [],
    meta: {
      author: "PageQuarry",
      canonicalUrl: `https://pagequarry.com${slug}`,
      description: `${title} description`,
      publishedAt: "2026-04-13T00:00:00Z",
      robots: { follow: true, index: true },
      seoTitle: title,
      social: {
        description: `${title} summary`,
        image: "https://pagequarry.com/og/guide.svg",
        imageVariant: "guide",
        title,
        twitterCard: "summary_large_image",
      },
      summary: `${title} summary`,
      title,
      updatedAt: "2026-04-14T00:00:00Z",
      ...(overrides.meta || {}),
    },
    pageId: overrides.pageId || slug.replace(/^\//, "").replace(/\//g, "-") || "home",
    redirectFrom: overrides.redirectFrom || [],
    revisionId: overrides.revisionId || "rev",
    slug,
    sourceHash: overrides.sourceHash || "hash",
    status: overrides.status || "published",
    template: overrides.template || "guide",
    ...overrides,
  };
}

describe("generated archive pages", () => {
  it("builds grouped archive pages from the live page set", () => {
    const pages = [
      makePage({ slug: "/howto/editorial/publishing-workflow", meta: { title: "publishing workflow", description: "", summary: "workflow summary", canonicalUrl: "https://pagequarry.com/howto/editorial/publishing-workflow", robots: { follow: true, index: true }, social: { title: "publishing workflow", description: "workflow summary", image: "https://pagequarry.com/og/guide.svg", imageVariant: "guide", twitterCard: "summary_large_image" }, author: "PageQuarry" } }),
      makePage({ slug: "/howto/platform/launch-checklist", meta: { title: "launch checklist", description: "", summary: "launch summary", canonicalUrl: "https://pagequarry.com/howto/platform/launch-checklist", robots: { follow: true, index: true }, social: { title: "launch checklist", description: "launch summary", image: "https://pagequarry.com/og/guide.svg", imageVariant: "guide", twitterCard: "summary_large_image" }, author: "PageQuarry" } }),
      makePage({ slug: "/case-studies/teams/community-knowledge-base", template: "caseStudy", meta: { title: "community knowledge base", description: "", summary: "community summary", canonicalUrl: "https://pagequarry.com/case-studies/teams/community-knowledge-base", robots: { follow: true, index: true }, social: { title: "community knowledge base", description: "community summary", image: "https://pagequarry.com/og/case-study.svg", imageVariant: "caseStudy", twitterCard: "summary_large_image" }, author: "PageQuarry" } }),
      makePage({ slug: "/case-studies/organizations/member-handbook", template: "caseStudy", meta: { title: "member handbook", description: "", summary: "handbook summary", canonicalUrl: "https://pagequarry.com/case-studies/organizations/member-handbook", robots: { follow: true, index: true }, social: { title: "member handbook", description: "handbook summary", image: "https://pagequarry.com/og/case-study.svg", imageVariant: "caseStudy", twitterCard: "summary_large_image" }, author: "PageQuarry" } }),
    ];

    const howto = buildGeneratedArchivePage("howto", pages);
    const caseStudies = buildGeneratedArchivePage("caseStudies", pages);

    expect(howto.slug).toBe("/howto");
    expect(caseStudies.slug).toBe("/case-studies");
    expect(howto.blocks[0]).toMatchObject({ type: "hero", title: "all published how-to articles." });
    expect(caseStudies.blocks[0]).toMatchObject({ type: "hero", title: "all published case studies." });
    expect(howto.blocks.some((block) => block.type === "metrics")).toBe(false);
    expect(caseStudies.blocks.some((block) => block.type === "metrics")).toBe(false);
    expect(howto.blocks[1]).toMatchObject({ type: "sectionCopy", title: "editorial" });
    expect(howto.blocks[2]).toMatchObject({ type: "sectionCopy", title: "platform" });
    expect(caseStudies.blocks[1]).toMatchObject({ type: "sectionCopy", title: "teams" });
    expect(caseStudies.blocks[2]).toMatchObject({ type: "sectionCopy", title: "organizations" });

    const editorialSection = howto.blocks[1];
    if (editorialSection.type !== "sectionCopy" || !editorialSection.links) throw new Error("unexpected section shape");
    expect(editorialSection.links[0]).toMatchObject({ href: "/howto/editorial/publishing-workflow", label: "publishing workflow" });
  });

  it("does not generate archive pages when real pages already exist at those slugs", () => {
    const pages = [
      makePage({ slug: "/howto" }),
      makePage({ slug: "/case-studies", template: "narrative" }),
    ];

    expect(buildGeneratedArchivePages(pages)).toEqual([]);
  });

  it("allows site-owned config to differ from generated archive routes", () => {
    expect(siteConfig.contact.primaryAction).toEqual({
      href: "https://github.com/juan-deere-4000/pagequarry",
      label: "View on GitHub",
    });

    const pages = [makePage({ slug: "/howto/editorial/publishing-workflow" })];
    const sitemap = buildSitemapEntries([...pages, ...buildGeneratedArchivePages(pages)]);

    expect(sitemap).toContain("https://pagequarry.com/howto");
    expect(sitemap).toContain("https://pagequarry.com/case-studies");
  });
});

import { describe, expect, it } from "vitest";

import { siteConfig } from "@/content/site";
import type { ManagedPage } from "@/content/types";
import { buildGeneratedArchivePage, buildGeneratedArchivePages } from "@/lib/content/archive";
import { buildSitemapEntries } from "@/lib/content/metadata";

function makePage(overrides: Partial<ManagedPage> = {}): ManagedPage {
  const slug = overrides.slug || "/howto/productivity/email-triage";
  const title = overrides.meta?.title || "private email triage";

  return {
    blocks: [],
    meta: {
      author: "siam ai lab",
      canonicalUrl: `https://siamailab.com${slug}`,
      description: `${title} description`,
      publishedAt: "2026-03-26T00:00:00Z",
      robots: { follow: true, index: true },
      seoTitle: title,
      social: {
        description: `${title} summary`,
        image: "https://siamailab.com/og/guide.svg",
        imageVariant: "guide",
        title,
        twitterCard: "summary_large_image",
      },
      summary: `${title} summary`,
      title,
      updatedAt: "2026-03-27T00:00:00Z",
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
      makePage({ slug: "/howto/productivity/email-triage", meta: { title: "private email triage", description: "", summary: "email summary", canonicalUrl: "https://siamailab.com/howto/productivity/email-triage", robots: { follow: true, index: true }, social: { title: "private email triage", description: "email summary", image: "https://siamailab.com/og/guide.svg", imageVariant: "guide", twitterCard: "summary_large_image" }, author: "siam ai lab" } }),
      makePage({ slug: "/howto/health/bloodwork-tracking", meta: { title: "bloodwork tracking", description: "", summary: "bloodwork summary", canonicalUrl: "https://siamailab.com/howto/health/bloodwork-tracking", robots: { follow: true, index: true }, social: { title: "bloodwork tracking", description: "bloodwork summary", image: "https://siamailab.com/og/guide.svg", imageVariant: "guide", twitterCard: "summary_large_image" }, author: "siam ai lab" } }),
      makePage({ slug: "/case-studies/individuals/personal-health-ai", template: "caseStudy", meta: { title: "personal health ai", description: "", summary: "health case study", canonicalUrl: "https://siamailab.com/case-studies/individuals/personal-health-ai", robots: { follow: true, index: true }, social: { title: "personal health ai", description: "health case study", image: "https://siamailab.com/og/case-study.svg", imageVariant: "caseStudy", twitterCard: "summary_large_image" }, author: "siam ai lab" } }),
      makePage({ slug: "/case-studies/business/restaurant-operations", template: "caseStudy", meta: { title: "restaurant operations", description: "", summary: "restaurant case study", canonicalUrl: "https://siamailab.com/case-studies/business/restaurant-operations", robots: { follow: true, index: true }, social: { title: "restaurant operations", description: "restaurant case study", image: "https://siamailab.com/og/case-study.svg", imageVariant: "caseStudy", twitterCard: "summary_large_image" }, author: "siam ai lab" } }),
    ];

    const howto = buildGeneratedArchivePage("howto", pages);
    const caseStudies = buildGeneratedArchivePage("caseStudies", pages);

    expect(howto.slug).toBe("/howto");
    expect(caseStudies.slug).toBe("/case-studies");
    expect(howto.blocks[0]).toMatchObject({ type: "hero", title: "all published how-to articles." });
    expect(caseStudies.blocks[0]).toMatchObject({ type: "hero", title: "all published case studies." });
    expect(howto.blocks[2]).toMatchObject({ type: "sectionCopy", title: "health" });
    expect(howto.blocks[3]).toMatchObject({ type: "sectionCopy", title: "productivity" });
    expect(caseStudies.blocks[2]).toMatchObject({ type: "sectionCopy", title: "individuals" });
    expect(caseStudies.blocks[3]).toMatchObject({ type: "sectionCopy", title: "business" });

    const healthSection = howto.blocks[2];
    if (healthSection.type !== "sectionCopy" || !healthSection.links) throw new Error("unexpected section shape");
    expect(healthSection.links[0]).toMatchObject({ href: "/howto/health/bloodwork-tracking", label: "bloodwork tracking" });
  });

  it("does not generate archive pages when real pages already exist at those slugs", () => {
    const pages = [
      makePage({ slug: "/howto" }),
      makePage({ slug: "/case-studies", template: "narrative" }),
    ];

    expect(buildGeneratedArchivePages(pages)).toEqual([]);
  });

  it("keeps navigation flat and includes generated archive routes in the sitemap", () => {
    expect(siteConfig.navigation).toEqual([
      { href: "/", label: "home" },
      { href: "/services", label: "services" },
      { href: "/how-it-works", label: "how it works" },
      { href: "/howto", label: "how-to" },
      { href: "/case-studies", label: "case studies" },
      { href: "/contact", label: "contact" },
    ]);

    const pages = [makePage({ slug: "/howto/productivity/email-triage" })];
    const sitemap = buildSitemapEntries([...pages, ...buildGeneratedArchivePages(pages)]);

    expect(sitemap).toContain("https://siamailab.com/howto");
    expect(sitemap).toContain("https://siamailab.com/case-studies");
  });
});

import { describe, expect, it } from "vitest";

import type { ManagedPage } from "@/content/types";
import {
  buildNextMetadata,
  buildRedirectsFile,
  buildSitemapEntries,
  buildStructuredData,
} from "@/lib/content/metadata";

function guidePage(overrides: Partial<ManagedPage> = {}): ManagedPage {
  return {
    blocks: [],
    meta: {
      author: "Pagequarry",
      canonicalUrl:
        "https://pagequarry.com/howto/editorial/publishing-workflow",
      description: "how to validate and publish a page safely through the content pipeline",
      publishedAt: "2026-04-13T00:00:00Z",
      robots: { follow: true, index: true },
      seoTitle: "publishing workflow for a markdown-first site",
      social: {
        description: "stage drafts, lint them, and accept them without touching generated runtime files",
        image: "https://pagequarry.com/og/guide.svg",
        imageVariant: "guide",
        title: "publishing workflow",
        twitterCard: "summary_large_image",
      },
      summary: "stage drafts, lint them, and accept them without touching generated runtime files",
      title: "publishing workflow",
      updatedAt: "2026-04-14T00:00:00Z",
    },
    pageId: "howto-editorial-publishing-workflow",
    redirectFrom: ["/guides/publishing-workflow"],
    revisionId: "rev-guide",
    slug: "/howto/editorial/publishing-workflow",
    sourceHash: "hash",
    status: "published",
    template: "guide",
    ...overrides,
  };
}

describe("content metadata helpers", () => {
  it("builds next metadata with canonical, robots, og, twitter, and article fields", () => {
    const page = guidePage();

    const metadata = buildNextMetadata(page);

    expect(metadata.title).toBe("publishing workflow for a markdown-first site");
    expect(metadata.alternates?.canonical).toBe(
      "https://pagequarry.com/howto/editorial/publishing-workflow"
    );
    expect(metadata.robots).toEqual({ follow: true, index: true });
    expect(metadata.openGraph?.type).toBe("article");
    expect(metadata.openGraph?.images?.[0]?.url).toBe("https://pagequarry.com/og/guide.svg");
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });

  it("builds schema defaults and breadcrumbs from the template", () => {
    const page = guidePage();

    const schema = buildStructuredData(page);

    expect(schema.some((entry) => entry["@type"] === "Article")).toBe(true);
    expect(schema.some((entry) => entry["@type"] === "BreadcrumbList")).toBe(true);
  });

  it("builds redirects and sitemaps from published indexable pages only", () => {
    const published = guidePage();
    const draft = guidePage({
      meta: {
        ...guidePage().meta,
        canonicalUrl: "https://pagequarry.com/howto/editorial/draft",
      },
      pageId: "draft-guide",
      redirectFrom: ["/draft-guide-old"],
      slug: "/howto/editorial/draft",
      status: "draft",
    });
    const noindex = guidePage({
      meta: {
        ...guidePage().meta,
        canonicalUrl: "https://pagequarry.com/howto/editorial/private",
        robots: { follow: true, index: false },
      },
      pageId: "private-guide",
      redirectFrom: ["/private-guide-old"],
      slug: "/howto/editorial/private",
    });

    const redirects = buildRedirectsFile([published, draft, noindex]);
    const sitemap = buildSitemapEntries([published, draft, noindex]);

    expect(redirects).toContain("/guides/publishing-workflow /howto/editorial/publishing-workflow 301");
    expect(redirects).not.toContain("/draft-guide-old");
    expect(redirects).toContain("/private-guide-old /howto/editorial/private 301");
    expect(sitemap).toEqual([
      "https://pagequarry.com/howto/editorial/publishing-workflow",
    ]);
  });
});

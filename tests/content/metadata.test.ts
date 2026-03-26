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
      author: "bkk ai lab",
      canonicalUrl:
        "https://bkk-ai-lab-poc-20260326152341.pages.dev/howto/productivity/email-triage",
      description: "private inbox routing without another saas dependency",
      publishedAt: "2026-03-26T00:00:00Z",
      robots: { follow: true, index: true },
      seoTitle: "private email triage for personal and executive inboxes",
      social: {
        description: "local-first email triage with strict workflow control",
        image:
          "https://bkk-ai-lab-poc-20260326152341.pages.dev/og/guide.svg",
        imageVariant: "guide",
        title: "private email triage",
        twitterCard: "summary_large_image",
      },
      summary: "local-first email triage with strict workflow control",
      title: "private email triage",
      updatedAt: "2026-03-27T00:00:00Z",
    },
    pageId: "howto-productivity-email-triage",
    redirectFrom: ["/guides/email-triage"],
    revisionId: "rev-guide",
    slug: "/howto/productivity/email-triage",
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

    expect(metadata.title).toBe("private email triage for personal and executive inboxes");
    expect(metadata.alternates?.canonical).toBe(
      "https://bkk-ai-lab-poc-20260326152341.pages.dev/howto/productivity/email-triage"
    );
    expect(metadata.robots).toEqual({ follow: true, index: true });
    expect(metadata.openGraph?.type).toBe("article");
    expect(metadata.openGraph?.images?.[0]?.url).toBe(
      "https://bkk-ai-lab-poc-20260326152341.pages.dev/og/guide.svg"
    );
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
        canonicalUrl:
          "https://bkk-ai-lab-poc-20260326152341.pages.dev/howto/productivity/draft",
      },
      pageId: "draft-guide",
      redirectFrom: ["/draft-guide-old"],
      slug: "/howto/productivity/draft",
      status: "draft",
    });
    const noindex = guidePage({
      meta: {
        ...guidePage().meta,
        canonicalUrl:
          "https://bkk-ai-lab-poc-20260326152341.pages.dev/howto/productivity/private",
        robots: { follow: true, index: false },
      },
      pageId: "private-guide",
      redirectFrom: ["/private-guide-old"],
      slug: "/howto/productivity/private",
    });

    const redirects = buildRedirectsFile([published, draft, noindex]);
    const sitemap = buildSitemapEntries([published, draft, noindex]);

    expect(redirects).toContain("/guides/email-triage /howto/productivity/email-triage 301");
    expect(redirects).not.toContain("/draft-guide-old");
    expect(redirects).not.toContain("/private-guide-old");
    expect(sitemap).toEqual([
      "https://bkk-ai-lab-poc-20260326152341.pages.dev/howto/productivity/email-triage",
    ]);
  });
});

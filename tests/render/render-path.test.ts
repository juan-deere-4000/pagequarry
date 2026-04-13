import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { afterEach, describe, expect, it } from "vitest";

import { RenderBlock } from "@/components/renderers/render-block";
import { RenderPage } from "@/components/renderers/render-page";
import {
  blockContentFingerprint,
  blockRenderKeys,
} from "@/components/templates/block-keys";
import type { ContentBlock, ManagedPage } from "@/content/types";
import { listPages, submitDraftFile } from "@/lib/content/state";
import { siteBlockRegistry } from "@/site/blocks";
import { siteTemplateRegistry } from "@/site/templates";
import { createTempRoot, copyFixture } from "@/tests/helpers/temp-root";

const originalHeroBlock = siteBlockRegistry.hero;
const originalGuideTemplate = siteTemplateRegistry.guide;

function makePage(overrides: Partial<ManagedPage> = {}): ManagedPage {
  return {
    blocks: [],
    meta: {
      author: "PageQuarry",
      canonicalUrl: "/guide",
      description: "guide description",
      robots: {
        follow: true,
        index: true,
      },
      seoTitle: "guide title",
      social: {
        description: "guide description",
        image: "/social/guide.png",
        imageVariant: "guide",
        title: "guide title",
        twitterCard: "summary_large_image",
      },
      summary: "guide summary",
      title: "guide title",
    },
    pageId: "guide-page",
    redirectFrom: [],
    revisionId: "revision-1",
    slug: "/guide",
    sourceHash: "source-hash",
    status: "published",
    template: "guide",
    ...overrides,
  };
}

describe("render path", () => {
  afterEach(() => {
    siteBlockRegistry.hero = originalHeroBlock;
    siteTemplateRegistry.guide = originalGuideTemplate;
  });

  it("derives block keys from full block content instead of title-only fallbacks", () => {
    const first: ContentBlock = {
      type: "hero",
      eyebrow: "alpha",
      title: "same title",
      deck: "first deck",
    };
    const second: ContentBlock = {
      type: "hero",
      eyebrow: "beta",
      title: "same title",
      deck: "second deck",
    };
    const duplicate: ContentBlock = {
      type: "hero",
      eyebrow: "alpha",
      title: "same title",
      deck: "first deck",
    };

    expect(blockContentFingerprint(first)).not.toBe(blockContentFingerprint(second));
    expect(blockRenderKeys([first, duplicate])).toEqual([
      `${blockContentFingerprint(first)}-0`,
      `${blockContentFingerprint(first)}-1`,
    ]);
  });

  it("renders site block overrides before the core registry", () => {
    siteBlockRegistry.hero = function SiteHeroBlock({ title }) {
      return createElement("div", { "data-site-block": "hero" }, title);
    };

    const html = renderToStaticMarkup(
      createElement(RenderBlock, {
        block: {
          type: "hero",
          eyebrow: "eyebrow",
          title: "site hero",
          deck: "deck",
        },
      })
    );

    expect(html).toContain('data-site-block="hero"');
    expect(html).toContain("site hero");
  });

  it("renders site template overrides before the core registry", () => {
    siteTemplateRegistry.guide = function SiteGuideTemplate({ page }) {
      return createElement("main", { "data-site-template": page.template }, page.meta.title);
    };

    const html = renderToStaticMarkup(createElement(RenderPage, { page: makePage() }));

    expect(html).toContain('data-site-template="guide"');
    expect(html).toContain("guide title");
  });

  it("renders accepted content pages through the site template seam", () => {
    const rootDir = createTempRoot();
    const filePath = copyFixture(rootDir, "home.md");
    const submit = submitDraftFile({ filePath, rootDir });
    expect(submit.ok).toBe(true);

    const page = listPages(rootDir).find((entry) => entry.slug === "/");
    expect(page).toBeTruthy();

    const html = renderToStaticMarkup(createElement(RenderPage, { page: page! }));

    expect(html).toContain("markdown-first publishing");
    expect(html).toContain("ship a site that edits through markdown");
    expect(html).toContain("start by editing the site config and starter pages");
  });
});

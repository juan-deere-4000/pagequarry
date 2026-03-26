import fs from "node:fs";
import crypto from "node:crypto";

import { describe, expect, it } from "vitest";

import { parseDraftSource } from "@/lib/content/markdown";
import { fixturePath } from "@/tests/helpers/temp-root";

describe("parseDraftSource", () => {
  it("accepts a valid home fixture", () => {
    const source = fs.readFileSync(fixturePath("home.md"), "utf8");
    const result = parseDraftSource({
      revisionId: "rev-home",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page.pageId).toBe("home");
      expect(result.page.slug).toBe("/");
      expect(result.page.template).toBe("home");
      expect(result.page.blocks.map((block) => block.type)).toEqual([
        "hero",
        "metrics",
        "sectionCopy",
        "sectionCopy",
        "sectionCopy",
        "process",
        "quote",
        "cta",
      ]);
    }
  });

  it("rejects malformed frontmatter", () => {
    const source = [
      "---",
      "template: home",
      "slug: /",
      "title",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-bad-frontmatter",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("frontmatter is invalid yaml"))).toBe(true);
    }
  });

  it("rejects root-level prose outside approved tags", () => {
    const source = [
      "---",
      "template: hub",
      "slug: /services",
      "title: services",
      "description: desc",
      "---",
      "",
      "hello world",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-root-text",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some((issue) =>
          issue.message.includes("document body may contain only approved block tags")
        )
      ).toBe(true);
    }
  });

  it("rejects invalid template block order", () => {
    const source = [
      "---",
      "template: home",
      "slug: /",
      "title: home",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-home-order",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("home requires metrics"))).toBe(true);
      expect(result.issues.some((issue) => issue.message.includes("home requires one process block"))).toBe(true);
    }
  });

  it("rejects ordered lists in sectionCopy", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /guide",
      "title: guide",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "",
      "1. bad",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-ordered-list",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some((issue) => issue.message.includes("sectionCopy lists must be unordered"))
      ).toBe(true);
    }
  });

  it("rejects reserved slugs", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /_next",
      "title: reserved",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-reserved",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("is reserved"))).toBe(true);
    }
  });

  it("rejects partial hero actions and pages with no valid blocks", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /empty",
      "title: empty",
      "description: desc",
      "---",
      "",
      "just prose",
      "",
      '{% hero eyebrow="x" title="y" deck="z" actionHref="/contact" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-empty",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some((issue) => issue.message.includes("document body may contain only approved block tags"))
      ).toBe(true);
      expect(
        result.issues.some((issue) => issue.message.includes("actionHref and actionLabel must be provided together"))
      ).toBe(true);
    }
  });

  it("rejects a page that has no valid blocks at all", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /empty",
      "title: empty",
      "description: desc",
      "---",
      "",
      "just prose",
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-no-blocks",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("page blocks"))).toBe(true);
    }
  });

  it("rejects empty and malformed process blocks", () => {
    const emptyProcess = [
      "---",
      "template: narrative",
      "slug: /process-empty",
      "title: process empty",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% process eyebrow="x" title="flow" %}',
      "{% /process %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");
    const wrongChildProcess = emptyProcess.replace("{% /process %}", '{% metric label="x" value="y" /%}\n{% /process %}');

    const emptyResult = parseDraftSource({
      revisionId: "rev-process-empty",
      source: emptyProcess,
      sourceHash: crypto.createHash("sha256").update(emptyProcess).digest("hex"),
    });
    const childResult = parseDraftSource({
      revisionId: "rev-process-child",
      source: wrongChildProcess,
      sourceHash: crypto.createHash("sha256").update(wrongChildProcess).digest("hex"),
    });

    expect(emptyResult.ok).toBe(false);
    expect(childResult.ok).toBe(false);
    if (!emptyResult.ok) {
      expect(emptyResult.issues.some((issue) => issue.message.includes("process must contain"))).toBe(true);
    }
    if (!childResult.ok) {
      expect(childResult.issues.some((issue) => issue.message.includes("process may only contain"))).toBe(true);
    }
  });

  it("rejects invalid sectionCopy children and bullet-only sections", () => {
    const invalidChild = [
      "---",
      "template: guide",
      "slug: /bad-section",
      "title: bad section",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% sectionCopy title="Body" %}',
      '{% metric label="x" value="y" /%}',
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");
    const bulletOnly = invalidChild.replace('{% metric label="x" value="y" /%}', "- only a bullet");

    const invalidChildResult = parseDraftSource({
      revisionId: "rev-invalid-section-child",
      source: invalidChild,
      sourceHash: crypto.createHash("sha256").update(invalidChild).digest("hex"),
    });
    const bulletOnlyResult = parseDraftSource({
      revisionId: "rev-bullet-only",
      source: bulletOnly,
      sourceHash: crypto.createHash("sha256").update(bulletOnly).digest("hex"),
    });

    expect(invalidChildResult.ok).toBe(false);
    expect(bulletOnlyResult.ok).toBe(false);
    if (!invalidChildResult.ok) {
      expect(
        invalidChildResult.issues.some((issue) => issue.message.includes("sectionCopy may contain only"))
      ).toBe(true);
    }
    if (!bulletOnlyResult.ok) {
      expect(
        bulletOnlyResult.issues.some((issue) => issue.message.includes("sectionCopy requires at least one body paragraph"))
      ).toBe(true);
    }
  });

  it("rejects invalid metrics children", () => {
    const source = [
      "---",
      "template: caseStudy",
      "slug: /bad-metrics",
      "title: bad metrics",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      "{% metrics %}",
      '{% step title="x" body="y" /%}',
      "{% /metrics %}",
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-bad-metrics",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("metrics may only contain metric child tags"))).toBe(true);
    }
  });

  it("rejects empty metrics blocks", () => {
    const source = [
      "---",
      "template: caseStudy",
      "slug: /empty-metrics",
      "title: empty metrics",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      "{% metrics %}",
      "{% /metrics %}",
      "",
      '{% sectionCopy title="Body" %}',
      "body",
      "{% /sectionCopy %}",
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-empty-metrics",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("metrics must contain at least one metric child tag"))).toBe(true);
    }
  });

  it("rejects unknown top-level tags without crashing", () => {
    const source = [
      "---",
      "template: guide",
      "slug: /unknown-top-level",
      "title: unknown top level",
      "description: desc",
      "---",
      "",
      '{% hero eyebrow="x" title="y" deck="z" /%}',
      "",
      '{% madeUpBlock title="nope" /%}',
      "",
      '{% cta title="x" body="y" actionHref="/contact" actionLabel="book a consultation" /%}',
    ].join("\n");

    const result = parseDraftSource({
      revisionId: "rev-unknown-top-level",
      source,
      sourceHash: crypto.createHash("sha256").update(source).digest("hex"),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.message.includes("unknown top-level tag"))).toBe(true);
    }
  });
});

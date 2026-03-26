import { describe, expect, it } from "vitest";

import type { ContentBlock } from "@/content/types";
import {
  describeTemplate,
  slugToPageId,
  validateTemplateSequence,
} from "@/lib/content/contracts";

function hero(): ContentBlock {
  return {
    type: "hero",
    eyebrow: "eyebrow",
    title: "title",
    deck: "deck",
  };
}

function metrics(): ContentBlock {
  return {
    type: "metrics",
    items: [{ label: "label", value: "value" }],
  };
}

function sectionCopy(): ContentBlock {
  return {
    type: "sectionCopy",
    title: "section",
    body: "body",
  };
}

function processBlock(): ContentBlock {
  return {
    type: "process",
    eyebrow: "flow",
    title: "process",
    steps: [{ title: "step", body: "body" }],
  };
}

function quote(): ContentBlock {
  return {
    type: "quote",
    quote: "quote",
    attribution: "attr",
    context: "context",
  };
}

function cta(): ContentBlock {
  return {
    type: "cta",
    title: "cta",
    body: "body",
    action: { href: "/contact", label: "book a consultation" },
  };
}

describe("content contracts", () => {
  it("describes templates and normalizes slugs into page ids", () => {
    const home = describeTemplate("home");

    expect(home.steps).toEqual(["hero", "metrics", "sectionCopy+", "process", "quote", "cta"]);
    expect(slugToPageId("/")).toBe("home");
    expect(slugToPageId("/case-studies/individuals/personal-health-ai")).toBe(
      "case-studies-individuals-personal-health-ai"
    );
  });

  it("validates home template rules including duplicate singleton blocks", () => {
    const errors = validateTemplateSequence("home", [
      hero(),
      metrics(),
      sectionCopy(),
      processBlock(),
      processBlock(),
      quote(),
      quote(),
      cta(),
    ]);

    expect(errors).toContain("home allows only one process block");
    expect(errors).toContain("home allows only one quote block");
  });

  it("validates hub and guide restrictions", () => {
    const hubErrors = validateTemplateSequence("hub", [sectionCopy(), metrics(), processBlock(), quote()]);
    const guideErrors = validateTemplateSequence("guide", [hero(), sectionCopy(), metrics(), cta()]);

    expect(hubErrors).toEqual(
      expect.arrayContaining([
        "hub must start with hero",
        "hub must end with cta",
        "hub does not allow metrics",
        "hub does not allow process",
        "hub does not allow quote",
      ])
    );
    expect(guideErrors).toContain("guide does not allow metrics");
  });

  it("validates caseStudy and narrative restrictions", () => {
    const caseStudyErrors = validateTemplateSequence("caseStudy", [
      sectionCopy(),
      sectionCopy(),
      processBlock(),
      quote(),
      cta(),
    ]);
    const narrativeErrors = validateTemplateSequence("narrative", [
      hero(),
      sectionCopy(),
      metrics(),
      quote(),
      processBlock(),
      processBlock(),
      cta(),
    ]);

    expect(caseStudyErrors).toEqual(
      expect.arrayContaining([
        "caseStudy must start with hero",
        "caseStudy requires metrics immediately after hero",
        "caseStudy does not allow process",
        "caseStudy does not allow quote",
      ])
    );
    expect(narrativeErrors).toEqual(
      expect.arrayContaining([
        "narrative does not allow metrics",
        "narrative does not allow quote",
        "narrative allows at most one process block",
      ])
    );
  });

  it("accepts valid block sequences for every template family", () => {
    expect(
      validateTemplateSequence("home", [hero(), metrics(), sectionCopy(), processBlock(), quote(), cta()])
    ).toEqual([]);
    expect(validateTemplateSequence("hub", [hero(), sectionCopy(), cta()])).toEqual([]);
    expect(validateTemplateSequence("guide", [hero(), sectionCopy(), cta()])).toEqual([]);
    expect(validateTemplateSequence("caseStudy", [hero(), metrics(), sectionCopy(), cta()])).toEqual([]);
    expect(validateTemplateSequence("narrative", [hero(), sectionCopy(), processBlock(), cta()])).toEqual([]);
  });
});

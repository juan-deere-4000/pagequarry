import Markdoc from "@markdoc/markdoc";
import yaml from "js-yaml";
import type { Config, Node as MarkdocNode } from "@markdoc/markdoc";

import type {
  ContentBlock,
  ManagedPage,
  PageTemplateKey,
} from "@/content/types";
import {
  contentBlockSchema,
  frontmatterSchema,
  managedPageSchema,
  reservedSlugs,
  slugToPageId,
  validateTemplateSequence,
} from "@/lib/content/contracts";

export type LintIssue = {
  line?: number;
  message: string;
};

export type ParseDraftSuccess = {
  ok: true;
  page: ManagedPage;
};

export type ParseDraftFailure = {
  issues: LintIssue[];
  ok: false;
};

export type ParseDraftResult = ParseDraftSuccess | ParseDraftFailure;

const sectionTone = ["default", "subtle"] as const;

const markdocConfig = {
  tags: {
    cta: {
      attributes: {
        actionHref: { type: String, required: true },
        actionLabel: { type: String, required: true },
        body: { type: String, required: true },
        title: { type: String, required: true },
      },
    },
    hero: {
      attributes: {
        actionHref: { type: String },
        actionLabel: { type: String },
        aside: { type: String },
        deck: { type: String, required: true },
        eyebrow: { type: String, required: true },
        title: { type: String, required: true },
      },
    },
    linkItem: {
      attributes: {
        href: { type: String, required: true },
        label: { type: String, required: true },
        summary: { type: String },
      },
    },
    metric: {
      attributes: {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    },
    metrics: {
      validate(node: MarkdocNode) {
        const items = node.children.filter((child) => child.type === "tag");
        if (items.length < 1) {
          return [
            {
              id: "metrics-empty",
              level: "critical",
              message: "metrics must contain at least one metric child tag.",
            },
          ];
        }
        if (items.some((child) => child.tag !== "metric")) {
          return [
            {
              id: "metrics-children",
              level: "critical",
              message: "metrics may only contain metric child tags.",
            },
          ];
        }
        return [];
      },
    },
    process: {
      attributes: {
        eyebrow: { type: String, required: true },
        title: { type: String, required: true },
      },
      validate(node: MarkdocNode) {
        const items = node.children.filter((child) => child.type === "tag");
        if (items.length < 1) {
          return [
            {
              id: "process-empty",
              level: "critical",
              message: "process must contain at least one step child tag.",
            },
          ];
        }
        if (items.some((child) => child.tag !== "step")) {
          return [
            {
              id: "process-children",
              level: "critical",
              message: "process may only contain step child tags.",
            },
          ];
        }
        return [];
      },
    },
    quote: {
      attributes: {
        attribution: { type: String, required: true },
        context: { type: String, required: true },
        quote: { type: String, required: true },
      },
    },
    sectionCopy: {
      attributes: {
        eyebrow: { type: String },
        title: { type: String, required: true },
        tone: { type: String, matches: [...sectionTone] },
      },
      validate(node: MarkdocNode) {
        const invalid = node.children.find((child) => {
          if (child.type === "paragraph" || child.type === "list") return false;
          if (child.type === "tag" && child.tag === "linkItem") return false;
          return true;
        });
        if (invalid) {
          return [
            {
              id: "sectionCopy-children",
              level: "critical",
              message:
                "sectionCopy may contain only paragraphs, bullet lists, and linkItem tags.",
            },
          ];
        }
        return [];
      },
    },
    step: {
      attributes: {
        body: { type: String, required: true },
        title: { type: String, required: true },
      },
    },
  },
} satisfies Config;

function lineOf(node: MarkdocNode) {
  return node.location?.start?.line;
}

function issue(message: string, line?: number): LintIssue {
  return line ? { line, message } : { message };
}

function textFromNode(node: MarkdocNode): string {
  if (node.type === "text") {
    return String(node.attributes.content ?? "");
  }
  return node.children.map(textFromNode).join("");
}

function paragraphText(node: MarkdocNode) {
  return textFromNode(node).trim();
}

function listItemText(node: MarkdocNode) {
  return textFromNode(node).trim();
}

function normalizeAction(
  attrs: Record<string, unknown>,
  errors: LintIssue[],
  line?: number
) {
  const href = String(attrs.actionHref ?? "").trim();
  const label = String(attrs.actionLabel ?? "").trim();

  if (href && label) return { href, label };
  if (!href && !label) return undefined;

  errors.push(issue("actionHref and actionLabel must be provided together.", line));
  return undefined;
}

function parseBlock(
  candidate: unknown,
  tag: string,
  errors: LintIssue[],
  line?: number
) {
  const parsed = contentBlockSchema.safeParse(candidate);
  if (parsed.success) return parsed.data;

  for (const detail of parsed.error.issues) {
    const suffix = detail.path.length ? ` ${detail.path.join(".")}` : "";
    errors.push(issue(`${tag}${suffix}: ${detail.message}`, line));
  }

  return null;
}

function normalizeMetrics(node: MarkdocNode, errors: LintIssue[]) {
  const items = node.children
    .filter((child) => child.type === "tag" && child.tag === "metric")
    .map((child) => ({
      label: String(child.attributes.label ?? "").trim(),
      value: String(child.attributes.value ?? "").trim(),
    }));

  return parseBlock({
    items,
    type: "metrics",
  }, "metrics", errors, lineOf(node));
}

function normalizeProcess(node: MarkdocNode, errors: LintIssue[]) {
  const steps = node.children
    .filter((child) => child.type === "tag" && child.tag === "step")
    .map((child) => ({
      body: String(child.attributes.body ?? "").trim(),
      title: String(child.attributes.title ?? "").trim(),
    }));

  return parseBlock({
    eyebrow: String(node.attributes.eyebrow ?? "").trim(),
    steps,
    title: String(node.attributes.title ?? "").trim(),
    type: "process",
  }, "process", errors, lineOf(node));
}

function normalizeSectionCopy(node: MarkdocNode, errors: LintIssue[]) {
  const paragraphs: string[] = [];
  const bullets: string[] = [];
  const links: Array<{ href: string; label: string; summary?: string }> = [];

  for (const child of node.children) {
    if (child.type === "paragraph") {
      const text = paragraphText(child);
      if (text) paragraphs.push(text);
      continue;
    }

    if (child.type === "list") {
      if (child.attributes.ordered) {
        errors.push(issue("sectionCopy lists must be unordered bullet lists.", lineOf(child)));
        continue;
      }
      for (const item of child.children.filter((entry) => entry.type === "item")) {
        const text = listItemText(item);
        if (text) bullets.push(text);
      }
      continue;
    }

    if (child.type === "tag" && child.tag === "linkItem") {
      links.push({
        href: String(child.attributes.href ?? "").trim(),
        label: String(child.attributes.label ?? "").trim(),
        summary: child.attributes.summary
          ? String(child.attributes.summary).trim()
          : undefined,
      });
    }
  }

  if (!paragraphs.length) {
    errors.push(
      issue("sectionCopy requires at least one body paragraph.", lineOf(node))
    );
  }

  return parseBlock({
    body: paragraphs.join("\n\n"),
    bullets: bullets.length ? bullets : undefined,
    eyebrow: node.attributes.eyebrow
      ? String(node.attributes.eyebrow).trim()
      : undefined,
    links: links.length ? links : undefined,
    title: String(node.attributes.title ?? "").trim(),
    tone: node.attributes.tone
      ? String(node.attributes.tone).trim()
      : undefined,
    type: "sectionCopy",
  }, "sectionCopy", errors, lineOf(node));
}

function normalizeTopLevelTag(node: MarkdocNode, errors: LintIssue[]) {
  switch (node.tag) {
    case "hero":
      return parseBlock({
        action: normalizeAction(node.attributes, errors, lineOf(node)),
        aside: node.attributes.aside ? String(node.attributes.aside).trim() : undefined,
        deck: String(node.attributes.deck ?? "").trim(),
        eyebrow: String(node.attributes.eyebrow ?? "").trim(),
        title: String(node.attributes.title ?? "").trim(),
        type: "hero",
      }, "hero", errors, lineOf(node));
    case "metrics":
      return normalizeMetrics(node, errors);
    case "sectionCopy":
      return normalizeSectionCopy(node, errors);
    case "process":
      return normalizeProcess(node, errors);
    case "quote":
      return parseBlock({
        attribution: String(node.attributes.attribution ?? "").trim(),
        context: String(node.attributes.context ?? "").trim(),
        quote: String(node.attributes.quote ?? "").trim(),
        type: "quote",
      }, "quote", errors, lineOf(node));
    case "cta":
      return parseBlock({
        action: {
          href: String(node.attributes.actionHref ?? "").trim(),
          label: String(node.attributes.actionLabel ?? "").trim(),
        },
        body: String(node.attributes.body ?? "").trim(),
        title: String(node.attributes.title ?? "").trim(),
        type: "cta",
      }, "cta", errors, lineOf(node));
    default:
      errors.push(issue(`unknown top-level tag: ${node.tag}`, lineOf(node)));
      return null;
  }
}

function parseFrontmatter(ast: MarkdocNode, errors: LintIssue[]) {
  const raw = ast.attributes.frontmatter;
  if (!raw || typeof raw !== "string") {
    errors.push(issue("frontmatter is required."));
    return null;
  }

  let loaded: unknown;
  try {
    loaded = yaml.load(raw);
  } catch (error) {
    errors.push(issue(`frontmatter is invalid yaml: ${(error as Error).message}`));
    return null;
  }

  if (
    loaded &&
    typeof loaded === "object" &&
    "slug" in loaded &&
    typeof loaded.slug === "string" &&
    reservedSlugs.has(loaded.slug)
  ) {
    errors.push(issue(`slug ${loaded.slug} is reserved.`));
    return null;
  }

  const parsed = frontmatterSchema.safeParse(loaded);
  if (!parsed.success) {
    for (const detail of parsed.error.issues) {
      errors.push(issue(`frontmatter ${detail.path.join(".")}: ${detail.message}`));
    }
    return null;
  }

  return parsed.data;
}

export function parseDraftSource(input: {
  revisionId: string;
  source: string;
  sourceHash: string;
}): ParseDraftResult {
  const errors: LintIssue[] = [];
  const ast = Markdoc.parse(input.source);
  const frontmatter = parseFrontmatter(ast, errors);

  const markdocErrors = Markdoc.validate(ast, markdocConfig);
  for (const error of markdocErrors) {
    errors.push(
      issue(error.error.message, error.location?.start?.line)
    );
  }

  const nonTag = ast.children.find((child) => child.type !== "tag");
  if (nonTag) {
    errors.push(
      issue(
        "document body may contain only approved block tags at the root level.",
        lineOf(nonTag)
      )
    );
  }

  const blocks = ast.children
    .filter((child) => child.type === "tag")
    .map((child) => normalizeTopLevelTag(child, errors))
    .filter(Boolean) as ContentBlock[];

  if (!frontmatter) {
    return { issues: errors, ok: false };
  }

  const templateErrors = validateTemplateSequence(frontmatter.template, blocks);
  for (const message of templateErrors) {
    errors.push(issue(message));
  }

  const page: ManagedPage = {
    blocks,
    meta: {
      description: frontmatter.description,
      title: frontmatter.title,
    },
    pageId: frontmatter.page_id ?? slugToPageId(frontmatter.slug),
    revisionId: input.revisionId,
    slug: frontmatter.slug,
    sourceHash: input.sourceHash,
    template: frontmatter.template as PageTemplateKey,
  };

  const parsedPage = managedPageSchema.safeParse(page);
  if (!parsedPage.success) {
    for (const detail of parsedPage.error.issues) {
      errors.push(issue(`page ${detail.path.join(".")}: ${detail.message}`));
    }
  }

  if (errors.length) return { issues: errors, ok: false };
  return { ok: true, page };
}

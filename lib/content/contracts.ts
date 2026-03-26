import { z } from "zod";

import type {
  ContentBlock,
  LinkItem,
  ManagedPage,
  PageTemplateKey,
  TemplateRule,
} from "@/content/types";

const actionLinkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
});

const linkItemSchema: z.ZodType<LinkItem> = actionLinkSchema.extend({
  summary: z.string().min(1).optional(),
});

const heroSchema = z.object({
  type: z.literal("hero"),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  deck: z.string().min(1),
  aside: z.string().min(1).optional(),
  action: actionLinkSchema.optional(),
});

const sectionCopySchema = z.object({
  type: z.literal("sectionCopy"),
  eyebrow: z.string().min(1).optional(),
  title: z.string().min(1),
  body: z.string().min(1),
  bullets: z.array(z.string().min(1)).optional(),
  links: z.array(linkItemSchema).optional(),
  tone: z.enum(["default", "subtle"]).optional(),
});

const metricsSchema = z.object({
  type: z.literal("metrics"),
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .min(1),
});

const processSchema = z.object({
  type: z.literal("process"),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  steps: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1),
      })
    )
    .min(1),
});

const quoteSchema = z.object({
  type: z.literal("quote"),
  quote: z.string().min(1),
  attribution: z.string().min(1),
  context: z.string().min(1),
});

const ctaSchema = z.object({
  type: z.literal("cta"),
  title: z.string().min(1),
  body: z.string().min(1),
  action: actionLinkSchema,
});

export const contentBlockSchema: z.ZodType<ContentBlock> = z.discriminatedUnion(
  "type",
  [heroSchema, sectionCopySchema, metricsSchema, processSchema, quoteSchema, ctaSchema]
);

export const templateKeys = [
  "caseStudy",
  "guide",
  "home",
  "hub",
  "narrative",
] as const satisfies readonly PageTemplateKey[];

export const frontmatterSchema = z.object({
  template: z.enum(templateKeys),
  slug: z
    .string()
    .min(1)
    .refine((value) => value.startsWith("/"), "slug must start with /")
    .refine((value) => value === "/" || !value.endsWith("/"), "slug must not end with /")
    .refine((value) => !value.includes(".."), "slug must not contain ..")
    .refine(
      (value) => /^\/[a-z0-9/-]*$/.test(value) || value === "/",
      "slug must contain only lowercase letters, numbers, hyphens, and slashes"
    ),
  title: z.string().min(1),
  description: z.string().min(1),
  page_id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});

export const managedPageSchema: z.ZodType<ManagedPage> = z.object({
  pageId: z.string().min(1),
  slug: frontmatterSchema.shape.slug,
  template: z.enum(templateKeys),
  meta: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  blocks: z.array(contentBlockSchema).min(1),
  revisionId: z.string().min(1),
  sourceHash: z.string().min(1),
});

export const templateRules: Record<PageTemplateKey, TemplateRule> = {
  caseStudy: {
    description: "hero, metrics, one or more sectionCopy blocks, then a cta",
    steps: ["hero", "metrics", "sectionCopy+", "cta"],
  },
  guide: {
    description: "hero, one or more sectionCopy blocks, then a cta",
    steps: ["hero", "sectionCopy+", "cta"],
  },
  home: {
    description: "hero, metrics, one or more sectionCopy blocks, process, quote, cta",
    steps: ["hero", "metrics", "sectionCopy+", "process", "quote", "cta"],
  },
  hub: {
    description: "hero, one or more sectionCopy blocks, then a cta",
    steps: ["hero", "sectionCopy+", "cta"],
  },
  narrative: {
    description: "hero, one or more sectionCopy blocks, optional process, then a cta",
    steps: ["hero", "sectionCopy+", "process?", "cta"],
  },
};

export const templateExamples: Record<PageTemplateKey, string[]> = {
  caseStudy: [
    "{% hero eyebrow=\"example case study\" title=\"a private health command center\" deck=\"...\" actionHref=\"/contact\" actionLabel=\"book a consultation\" /%}",
    "{% metrics %}",
    "{% metric label=\"system type\" value=\"personal health ai\" /%}",
    "{% /metrics %}",
    "{% sectionCopy eyebrow=\"problem\" title=\"the challenge\" %}",
  ],
  guide: [
    "{% hero eyebrow=\"example guide\" title=\"private email triage\" deck=\"...\" actionHref=\"/contact\" actionLabel=\"book a consultation\" /%}",
    "{% sectionCopy eyebrow=\"guide\" title=\"what it is\" %}",
  ],
  home: [
    "{% hero eyebrow=\"private ai systems\" title=\"the ai should feel like infrastructure\" deck=\"...\" actionHref=\"/contact\" actionLabel=\"book a consultation\" /%}",
    "{% metrics %}",
    "{% metric label=\"positioning\" value=\"private by default\" /%}",
    "{% /metrics %}",
  ],
  hub: [
    "{% hero eyebrow=\"service hub\" title=\"the same system, seen from different angles\" deck=\"...\" actionHref=\"/contact\" actionLabel=\"book a consultation\" /%}",
    "{% sectionCopy eyebrow=\"lens\" title=\"personal ai\" %}",
  ],
  narrative: [
    "{% hero eyebrow=\"how it works\" title=\"private ai in plain english\" deck=\"...\" actionHref=\"/contact\" actionLabel=\"book a consultation\" /%}",
    "{% sectionCopy eyebrow=\"step one\" title=\"connect to existing tools\" %}",
  ],
};

export const blockDocs = {
  cta: {
    description: "closing call to action with one button",
    syntax:
      "{% cta title=\"talk about the real build\" body=\"...\" actionHref=\"/contact\" actionLabel=\"book a consultation\" /%}",
  },
  hero: {
    description: "lead hero with optional aside and action button",
    syntax:
      "{% hero eyebrow=\"private ai systems\" title=\"the ai should feel like infrastructure\" deck=\"...\" aside=\"...\" actionHref=\"/contact\" actionLabel=\"book a consultation\" /%}",
  },
  metrics: {
    description: "row of label/value metrics built from metric child tags",
    syntax: "{% metrics %}\\n{% metric label=\"privacy\" value=\"local-first\" /%}\\n{% /metrics %}",
  },
  process: {
    description: "ordered steps built from step child tags",
    syntax:
      "{% process eyebrow=\"engagement model\" title=\"simple on the surface\" %}\\n{% step title=\"scope the bottleneck\" body=\"...\" /%}\\n{% /process %}",
  },
  quote: {
    description: "editorial pull quote with attribution and context",
    syntax:
      "{% quote quote=\"the right vibe here is not futuristic\" attribution=\"prototype direction\" context=\"derived from the visual guide\" /%}",
  },
  sectionCopy: {
    description: "editorial text section with markdown paragraphs, optional bullets, and optional linkItem tags",
    syntax:
      "{% sectionCopy eyebrow=\"guide\" title=\"what it is\" tone=\"subtle\" %}\\nbody paragraph\\n\\n- bullet one\\n- bullet two\\n\\n{% linkItem href=\"/services\" label=\"service hub\" summary=\"see the broader capability map\" /%}\\n{% /sectionCopy %}",
  },
} as const;

export const reservedSlugs = new Set(["/_next", "/favicon.ico"]);

export function slugToPageId(slug: string) {
  if (slug === "/") return "home";
  return slug
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean)
    .join("-")
    .replace(/[^a-z0-9-]/g, "");
}

export function describeTemplate(template: PageTemplateKey) {
  const rule = templateRules[template];
  return {
    description: rule.description,
    examples: templateExamples[template],
    steps: rule.steps,
    template,
  };
}

export function validateTemplateSequence(
  template: PageTemplateKey,
  blocks: ContentBlock[]
) {
  const types = blocks.map((block) => block.type);
  const errors: string[] = [];

  const expectSections = () => {
    const count = types.filter((type) => type === "sectionCopy").length;
    if (count < 1) errors.push("template requires at least one sectionCopy block");
  };

  switch (template) {
    case "home":
      if (types[0] !== "hero") errors.push("home must start with hero");
      if (types[1] !== "metrics") errors.push("home requires metrics immediately after hero");
      if (types.at(-1) !== "cta") errors.push("home must end with cta");
      if (!types.includes("process")) errors.push("home requires one process block");
      if (!types.includes("quote")) errors.push("home requires one quote block");
      if (types.filter((type) => type === "process").length > 1)
        errors.push("home allows only one process block");
      if (types.filter((type) => type === "quote").length > 1)
        errors.push("home allows only one quote block");
      expectSections();
      break;
    case "hub":
    case "guide":
      if (types[0] !== "hero") errors.push(`${template} must start with hero`);
      if (types.at(-1) !== "cta") errors.push(`${template} must end with cta`);
      if (types.includes("metrics")) errors.push(`${template} does not allow metrics`);
      if (types.includes("process")) errors.push(`${template} does not allow process`);
      if (types.includes("quote")) errors.push(`${template} does not allow quote`);
      expectSections();
      break;
    case "caseStudy":
      if (types[0] !== "hero") errors.push("caseStudy must start with hero");
      if (types[1] !== "metrics") errors.push("caseStudy requires metrics immediately after hero");
      if (types.at(-1) !== "cta") errors.push("caseStudy must end with cta");
      if (types.includes("process")) errors.push("caseStudy does not allow process");
      if (types.includes("quote")) errors.push("caseStudy does not allow quote");
      expectSections();
      break;
    case "narrative":
      if (types[0] !== "hero") errors.push("narrative must start with hero");
      if (types.at(-1) !== "cta") errors.push("narrative must end with cta");
      if (types.includes("metrics")) errors.push("narrative does not allow metrics");
      if (types.includes("quote")) errors.push("narrative does not allow quote");
      if (types.filter((type) => type === "process").length > 1)
        errors.push("narrative allows at most one process block");
      expectSections();
      break;
  }

  return errors;
}

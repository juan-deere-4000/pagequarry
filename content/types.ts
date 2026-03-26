export type ActionLink = {
  href: string;
  label: string;
};

export type LinkItem = ActionLink & {
  summary?: string;
};

export type SiteNavigationItem = {
  label: string;
  href?: string;
  items?: SiteNavigationItem[];
};

export type PageStatus = "draft" | "published";

export type SocialImageVariant =
  | "site"
  | "home"
  | "hub"
  | "guide"
  | "caseStudy"
  | "narrative";

export type TwitterCardType = "summary" | "summary_large_image";

export type PageMeta = {
  title: string;
  description: string;
  summary: string;
  seoTitle: string;
  canonicalUrl: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
  social: {
    title: string;
    description: string;
    image: string;
    imageVariant: SocialImageVariant;
    twitterCard: TwitterCardType;
  };
  author: string;
  publishedAt?: string;
  updatedAt?: string;
};

export type HeroBlockData = {
  eyebrow: string;
  title: string;
  deck: string;
  aside?: string;
  action?: ActionLink;
};

export type SectionCopyBlockData = {
  eyebrow?: string;
  title: string;
  body: string;
  bullets?: string[];
  links?: LinkItem[];
  tone?: "default" | "subtle";
};

export type CtaBlockData = {
  title: string;
  body: string;
  action: ActionLink;
};

export type MetricStripBlockData = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export type ProcessBlockData = {
  eyebrow: string;
  title: string;
  steps: Array<{ title: string; body: string }>;
};

export type QuoteBlockData = {
  quote: string;
  attribution: string;
  context: string;
};

export type BlockPropsMap = {
  cta: CtaBlockData;
  hero: HeroBlockData;
  metrics: MetricStripBlockData;
  process: ProcessBlockData;
  quote: QuoteBlockData;
  sectionCopy: SectionCopyBlockData;
};

export type BlockKey = keyof BlockPropsMap;

export type ContentBlock = {
  [K in BlockKey]: { type: K } & BlockPropsMap[K];
}[BlockKey];

export type PageTemplateKey =
  | "caseStudy"
  | "guide"
  | "home"
  | "hub"
  | "narrative";

export type ManagedPage = {
  pageId: string;
  slug: string;
  template: PageTemplateKey;
  status: PageStatus;
  redirectFrom: string[];
  meta: PageMeta;
  blocks: ContentBlock[];
  revisionId: string;
  sourceHash: string;
};

export type AcceptedRevision = {
  acceptedAt: string;
  page: ManagedPage;
  pageId: string;
  revisionId: string;
  source: string;
  sourceHash: string;
  slug: string;
  template: PageTemplateKey;
};

export type PageCurrentState = {
  currentRevisionId: string;
  page: ManagedPage;
  pageId: string;
  sourceHash: string;
  updatedAt: string;
};

export type LiveContentIndex = {
  generatedAt: string;
  pages: ManagedPage[];
};

export type TemplateRule = {
  description: string;
  steps: string[];
};

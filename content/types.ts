export type ActionLink = {
  href: string;
  label: string;
};

export type LinkItem = ActionLink & {
  summary?: string;
};

export type PageMeta = {
  title: string;
  description: string;
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

type PageBase<TTemplate extends string> = {
  template: TTemplate;
  path: string;
  meta: PageMeta;
};

export type HomePage = PageBase<"home"> & {
  hero: HeroBlockData;
  metrics: MetricStripBlockData;
  sections: SectionCopyBlockData[];
  process: ProcessBlockData;
  quote: QuoteBlockData;
  cta: CtaBlockData;
};

export type HubPage = PageBase<"hub"> & {
  hero: HeroBlockData;
  sections: SectionCopyBlockData[];
  cta: CtaBlockData;
};

export type NarrativePage = PageBase<"narrative"> & {
  hero: HeroBlockData;
  sections: SectionCopyBlockData[];
  process?: ProcessBlockData;
  cta: CtaBlockData;
};

export type GuidePage = PageBase<"guide"> & {
  hero: HeroBlockData;
  whatItIs: string;
  architecture: string;
  personalIntro: string;
  personalUseCases: string[];
  businessIntro: string;
  businessUseCases: string[];
  relatedIntro: string;
  relatedLinks: LinkItem[];
  cta: CtaBlockData;
};

export type CaseStudyPage = PageBase<"caseStudy"> & {
  hero: HeroBlockData;
  metrics: MetricStripBlockData;
  challengeIntro: string;
  challenge: string[];
  solutionIntro: string;
  solution: string[];
  resultIntro: string;
  results: string[];
  configuration: string;
  relatedLinks: LinkItem[];
  cta: CtaBlockData;
};

export type PageTemplateMap = {
  caseStudy: CaseStudyPage;
  guide: GuidePage;
  home: HomePage;
  hub: HubPage;
  narrative: NarrativePage;
};

export type PageTemplateKey = keyof PageTemplateMap;

export type SitePage = PageTemplateMap[PageTemplateKey];

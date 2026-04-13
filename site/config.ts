import type {
  ActionLink,
  PageTemplateKey,
  SocialImageVariant,
  TwitterCardType,
} from "@/content/types";

export const socialImageVariants = {
  caseStudy: {
    alt: "PageQuarry case study social card",
    path: "/og/case-study.svg",
  },
  guide: {
    alt: "PageQuarry guide social card",
    path: "/og/guide.svg",
  },
  home: {
    alt: "PageQuarry home social card",
    path: "/og/home.svg",
  },
  hub: {
    alt: "PageQuarry feature hub social card",
    path: "/og/hub.svg",
  },
  narrative: {
    alt: "PageQuarry narrative page social card",
    path: "/og/narrative.svg",
  },
  site: {
    alt: "PageQuarry site social card",
    path: "/og/site.svg",
  },
} as const satisfies Record<SocialImageVariant, { alt: string; path: string }>;

export const templateMetadataDefaults = {
  caseStudy: {
    openGraphType: "article",
    schemaType: "Article",
    socialImage: "caseStudy",
    twitterCard: "summary_large_image",
  },
  guide: {
    openGraphType: "article",
    schemaType: "Article",
    socialImage: "guide",
    twitterCard: "summary_large_image",
  },
  home: {
    openGraphType: "website",
    schemaType: "WebSite",
    socialImage: "home",
    twitterCard: "summary_large_image",
  },
  hub: {
    openGraphType: "website",
    schemaType: "Service",
    socialImage: "hub",
    twitterCard: "summary_large_image",
  },
  narrative: {
    openGraphType: "website",
    schemaType: "WebPage",
    socialImage: "narrative",
    twitterCard: "summary_large_image",
  },
} as const satisfies Record<
  PageTemplateKey,
  {
    openGraphType: "article" | "website";
    schemaType: "Article" | "Service" | "WebPage" | "WebSite";
    socialImage: SocialImageVariant;
    twitterCard: TwitterCardType;
  }
>;

const primaryAction = {
  href: "https://github.com/juan-deere-4000/pagequarry",
  label: "View on GitHub",
} as const satisfies ActionLink;

const navigation = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/howto", label: "Guides" },
  { href: "/case-studies", label: "Proof" },
] as const satisfies readonly ActionLink[];

export const siteConfig = {
  contact: {
    email: "hello@pagequarry.com",
    location: "Bangkok",
    primaryAction,
  },
  footer: {
    meta: "Build the presentation layer in React. Publish through structured markdown blocks.",
    note: "Templates, site chrome, SEO defaults, and validation stay in code while humans and agents write inside the system.",
    tagline: "A modern block-based CMS for AI agents and their humans.",
  },
  identity: {
    description:
      "A modern block-based CMS for teams using AI agents to publish to React sites without giving up control of the design system.",
    locale: "en_US",
    name: "PageQuarry",
    navigation,
    shortName: "PageQuarry",
    siteUrl: "https://pagequarry.com",
    subheader: "A Modern Block-Based CMS for AI Agents and their Humans",
    title: "PageQuarry",
  },
  manifest: {
    backgroundColor: "#f7f0e8",
    description:
      "Agent-native publishing for React sites.",
    name: "PageQuarry",
    shortName: "PageQuarry",
    themeColor: "#f7f0e8",
  },
  metadata: {
    defaultAuthor: "PageQuarry",
    organization: {
      logo: "/icon.svg",
      name: "PageQuarry",
      sameAs: ["https://github.com/juan-deere-4000/pagequarry"] as string[],
    },
    robots: {
      follow: true,
      index: true,
    },
  },
  social: {
    defaultTwitterCard: "summary_large_image" as const,
    images: socialImageVariants,
    siteName: "PageQuarry",
  },
} as const;

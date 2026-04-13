import type {
  ActionLink,
  PageTemplateKey,
  SiteNavigationItem,
  SocialImageVariant,
  TwitterCardType,
} from "@/content/types";

export const socialImageVariants = {
  caseStudy: {
    alt: "Pagequarry case study social card",
    path: "/og/case-study.svg",
  },
  guide: {
    alt: "Pagequarry guide social card",
    path: "/og/guide.svg",
  },
  home: {
    alt: "Pagequarry home social card",
    path: "/og/home.svg",
  },
  hub: {
    alt: "Pagequarry feature hub social card",
    path: "/og/hub.svg",
  },
  narrative: {
    alt: "Pagequarry narrative page social card",
    path: "/og/narrative.svg",
  },
  site: {
    alt: "Pagequarry site social card",
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
  href: "/contact",
  label: "contact",
} as const satisfies ActionLink;

export const siteConfig = {
  contact: {
    email: "hello@pagequarry.com",
    location: "replace this with your own studio, team, or organization",
    primaryAction,
  },
  footer: {
    meta: "static-export ready. light, editorial, text-first.",
    note: "starter content ships with safe placeholder copy. edit site/config.ts before launch.",
    tagline: "self-hostable, markdown-first publishing with generated runtime state.",
  },
  identity: {
    description:
      "self-hostable site framework with a strict markdown publishing pipeline, generated runtime state, and reusable page templates.",
    locale: "en_US",
    name: "Pagequarry",
    shortName: "cms",
    siteUrl: "https://pagequarry.com",
    title: "Pagequarry",
  },
  manifest: {
    backgroundColor: "#f4efe8",
    description:
      "self-hostable, markdown-first publishing with generated runtime state.",
    name: "Pagequarry",
    shortName: "cms",
    themeColor: "#f4efe8",
  },
  metadata: {
    defaultAuthor: "Pagequarry",
    organization: {
      logo: "/icon.svg",
      name: "Pagequarry",
      sameAs: [] as string[],
    },
    robots: {
      follow: true,
      index: true,
    },
  },
  navigation: [
    { href: "/", label: "home" },
    { href: "/features", label: "features" },
    { href: "/how-it-works", label: "how it works" },
    { href: "/howto", label: "how-to" },
    { href: "/case-studies", label: "case studies" },
    { href: "/contact", label: "contact" },
  ] as const satisfies readonly SiteNavigationItem[],
  social: {
    defaultTwitterCard: "summary_large_image" as const,
    images: socialImageVariants,
    siteName: "Pagequarry",
  },
} as const;

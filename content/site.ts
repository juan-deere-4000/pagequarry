import type {
  PageTemplateKey,
  SocialImageVariant,
  TwitterCardType,
} from "@/content/types";

export const socialImageVariants = {
  caseStudy: {
    alt: "bkk ai lab case study social card",
    path: "/og/case-study.svg",
  },
  guide: {
    alt: "bkk ai lab guide social card",
    path: "/og/guide.svg",
  },
  home: {
    alt: "bkk ai lab home social card",
    path: "/og/home.svg",
  },
  hub: {
    alt: "bkk ai lab service hub social card",
    path: "/og/hub.svg",
  },
  narrative: {
    alt: "bkk ai lab narrative page social card",
    path: "/og/narrative.svg",
  },
  site: {
    alt: "bkk ai lab site social card",
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

export const siteConfig = {
  contactEmail: "hello@example.com",
  description:
    "prototype site exploring the architecture, visual system, and page-family approach for bkk ai lab.",
  footer: {
    note: "prototype repo for architecture and style exploration.",
    tagline: "private ai systems, built as owned infrastructure.",
  },
  locale: "en_US",
  manifest: {
    backgroundColor: "#f4efe8",
    description:
      "private ai systems, built as owned infrastructure.",
    name: "bkk ai lab",
    shortName: "bkk ai lab",
    themeColor: "#f4efe8",
  },
  metadata: {
    defaultAuthor: "bkk ai lab",
    organization: {
      logo: "/favicon.ico",
      name: "bkk ai lab",
      sameAs: [] as string[],
    },
    robots: {
      follow: true,
      index: true,
    },
  },
  name: "bkk ai lab",
  navigation: [
    { href: "/", label: "home" },
    { href: "/services", label: "services" },
    { href: "/how-it-works", label: "how it works" },
    { href: "/howto/productivity/email-triage", label: "guide" },
    {
      href: "/case-studies/individuals/personal-health-ai",
      label: "case study",
    },
  ],
  siteUrl: "https://bkk-ai-lab-poc-20260326152341.pages.dev",
  social: {
    defaultTwitterCard: "summary_large_image" as const,
    images: socialImageVariants,
    siteName: "bkk ai lab",
  },
  title: "bkk ai lab poc",
} as const;

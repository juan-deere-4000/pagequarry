import type {
  PageTemplateKey,
  SocialImageVariant,
  TwitterCardType,
} from "@/content/types";

export const socialImageVariants = {
  caseStudy: {
    alt: "siam ai lab case study social card",
    path: "/og/case-study.svg",
  },
  guide: {
    alt: "siam ai lab guide social card",
    path: "/og/guide.svg",
  },
  home: {
    alt: "siam ai lab home social card",
    path: "/og/home.svg",
  },
  hub: {
    alt: "siam ai lab service hub social card",
    path: "/og/hub.svg",
  },
  narrative: {
    alt: "siam ai lab narrative page social card",
    path: "/og/narrative.svg",
  },
  site: {
    alt: "siam ai lab site social card",
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
    "private ai systems in Bangkok, built as owned infrastructure.",
  footer: {
    note: "prototype repo for architecture and style exploration.",
    tagline: "private ai systems, built as owned infrastructure.",
  },
  locale: "en_US",
  manifest: {
    backgroundColor: "#f4efe8",
    description:
      "private ai systems, built as owned infrastructure.",
    name: "siam ai lab",
    shortName: "siam ai lab",
    themeColor: "#f4efe8",
  },
  metadata: {
    defaultAuthor: "siam ai lab",
    organization: {
      logo: "/favicon.ico",
      name: "siam ai lab",
      sameAs: [] as string[],
    },
    robots: {
      follow: true,
      index: true,
    },
  },
  name: "siam ai lab",
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
  siteUrl: "https://siamailab.com",
  social: {
    defaultTwitterCard: "summary_large_image" as const,
    images: socialImageVariants,
    siteName: "siam ai lab",
  },
  title: "siam ai lab",
} as const;

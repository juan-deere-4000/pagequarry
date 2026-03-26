export const siteConfig = {
  contactEmail: "hello@example.com",
  description:
    "prototype site exploring the architecture, visual system, and page-family approach for bkk ai lab.",
  footer: {
    note: "prototype repo for architecture and style exploration.",
    tagline: "private ai systems, built as owned infrastructure.",
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
  title: "bkk ai lab poc",
} as const;

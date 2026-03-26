import type {
  CaseStudyPage,
  GuidePage,
  HomePage,
  HubPage,
  NarrativePage,
} from "@/content/types";
import { siteConfig } from "@/content/site";

export const homePage: HomePage = {
  template: "home",
  path: "/",
  meta: {
    title: "home",
    description: siteConfig.description,
  },
  hero: {
    eyebrow: "private ai systems",
    title: "the ai should feel like infrastructure, not a chatbot.",
    deck:
      "bkk ai lab is a premium studio for private ai systems that run on your hardware, connect to your existing tools, and stay yours when the engagement ends.",
    aside:
      "one product, many entry points. the same system can index a law firm’s contracts, run a personal health command center, or prepare every meeting like a staff chief of staff.",
    action: {
      href: "/contact",
      label: "book a consultation",
    },
  },
  metrics: {
    items: [
      { label: "positioning", value: "private by default" },
      { label: "delivery model", value: "built as owned infrastructure" },
      { label: "site approach", value: "editorial, not saas-y" },
    ],
  },
  sections: [
    {
      eyebrow: "what we build",
      title: "one system, configured for the person or team using it.",
      body:
        "the core offer is a private ai layer that sits across tools and data you already use. it reads, retrieves, summarizes, drafts, routes, and coordinates. for an individual that can mean health, email, travel, and documents. for a business that can mean client context, compliance, reporting, and document intelligence.",
      links: [
        {
          href: "/services",
          label: "browse capability areas",
          summary:
            "a service hub that explains the same system from several operational angles.",
        },
        {
          href: "/how-it-works",
          label: "see how it works",
          summary:
            "a plain-language explanation of the deployment, privacy, and support model.",
        },
      ],
    },
    {
      eyebrow: "what we do not build",
      title: "the line matters as much as the pitch.",
      body:
        "this is not customer-facing ai, not growth automation, not content sludge, and not a wrapper around somebody else’s dashboard. the product is inward-facing. it makes a person or a team better informed, faster, calmer, and harder to knock off balance.",
      bullets: [
        "no marketing automation or lead-gen machinery",
        "no customer-facing chatbots",
        "no content mill or newsletter conveyor belt",
        "no vendor-lock-in software subscription pretending to be consulting",
      ],
      tone: "subtle",
    },
    {
      eyebrow: "why this prototype looks the way it does",
      title: "the site behaves more like a well-set document than a startup landing page.",
      body:
        "the visual direction comes straight from the planning docs: light-only, serif-led, text-first, almost no imagery, and no default saas furniture. the implementation is intentionally constrained so future ai coding agents build from approved tokens, recipes, blocks, and templates instead of freelancing every margin and card treatment.",
      links: [
        {
          href: "/howto/productivity/email-triage",
          label: "example guide page",
          summary:
            "a representative how-to page using the guide template and shared blocks.",
        },
        {
          href: "/case-studies/individuals/personal-health-ai",
          label: "example case study page",
          summary:
            "a representative proof page showing the same system through a specific use case.",
        },
      ],
    },
  ],
  process: {
    eyebrow: "engagement model",
    title: "simple on the surface, serious under the hood.",
    steps: [
      {
        title: "scope the real bottleneck",
        body:
          "start with the actual operational pain, not a feature wishlist. the right answer might be one capability or a connected bundle of several.",
      },
      {
        title: "deploy on infrastructure the client controls",
        body:
          "the default is client-owned hardware or private infrastructure. data stays local, credentials stay client-owned, and the architecture is legible.",
      },
      {
        title: "expand from utility, not theatre",
        body:
          "once the first capability proves itself, the same system grows into adjacent workflows without turning into a second software estate.",
      },
    ],
  },
  quote: {
    quote:
      "the right vibe here is not futuristic. it is competent, calm, and owned.",
    attribution: "prototype design direction",
    context: "derived from the repo’s visual and writing guides",
  },
  cta: {
    title: "if this were the actual build, the next move would be content and deployment.",
    body:
      "this poc proves the page system, tone, and design structure. the real build would replace the hard-coded examples with a typed content pipeline and a clean publish flow.",
    action: {
      href: "/contact",
      label: "talk about the real build",
    },
  },
};

export const servicesPage: HubPage = {
  template: "hub",
  path: "/services",
  meta: {
    title: "services",
    description:
      "service hub prototype showing how the same private-ai system is framed across personal, document, and operations use cases.",
  },
  hero: {
    eyebrow: "service hub",
    title: "the same system, seen from different operational angles.",
    deck:
      "the product does not change between personal and business use. what changes is the data you connect, the workflows you care about, and the way the value becomes visible.",
    action: {
      href: "/contact",
      label: "book a consultation",
    },
  },
  sections: [
    {
      eyebrow: "persona lens",
      title: "personal ai",
      body:
        "for individuals, the system can act like a health command center, life ops layer, and private knowledge vault all at once. the experience is less app-switching, fewer hidden obligations, and much more continuity across health, email, documents, and scheduling.",
      links: [
        {
          href: "/case-studies/individuals/personal-health-ai",
          label: "see the health case study",
        },
        {
          href: "/howto/productivity/email-triage",
          label: "see the email triage guide",
        },
      ],
    },
    {
      eyebrow: "capability lens",
      title: "private knowledge and document intelligence",
      body:
        "the clearest business angle is often not a giant ai dashboard. it is the sudden ability to find the right thing instantly, brief a meeting correctly, or review a large document set without burning billable human time on retrieval.",
      bullets: [
        "cross-file search and summarization",
        "deadline, renewal, and obligation extraction",
        "pre-meeting briefs with relevant history already assembled",
        "all on infrastructure the client actually controls",
      ],
      tone: "subtle",
    },
    {
      eyebrow: "ops lens",
      title: "operations that stop living in spreadsheets and memory",
      body:
        "on the operations side, the same stack can monitor compliance, compile reports, route follow-ups, and keep project state coherent across tools that were never designed to cooperate with each other.",
      links: [
        {
          href: "/how-it-works",
          label: "read the plain-language architecture",
        },
        {
          href: "/contact",
          label: "turn this into a scoped engagement",
        },
      ],
    },
  ],
  cta: {
    title: "the site structure already points to a real product system.",
    body:
      "the proof of concept uses just a few pages, but they map directly to the actual architecture the planning vault was already implying: home, hub pages, how-to guides, and case studies.",
    action: {
      href: "/contact",
      label: "start with your use case",
    },
  },
};

export const howItWorksPage: NarrativePage = {
  template: "narrative",
  path: "/how-it-works",
  meta: {
    title: "how it works",
    description:
      "plain-language architecture page covering local-first deployment, privacy boundaries, and capability expansion.",
  },
  hero: {
    eyebrow: "how it works",
    title: "private ai should be explainable in plain english.",
    deck:
      "the useful version of this story is simple: connect to what already exists, keep the data where it belongs, and choose the inference path that matches the privacy bar.",
    action: {
      href: "/contact",
      label: "talk through your setup",
    },
  },
  sections: [
    {
      eyebrow: "step one",
      title: "connect to the tools already in use.",
      body:
        "email stays email. calendars stay calendars. file servers stay file servers. the system becomes a connective layer that makes those sources legible and operationally useful together.",
    },
    {
      eyebrow: "step two",
      title: "keep the data in the client’s environment.",
      body:
        "the default position is local-first. either the models run locally, or the sensitive context stays local and only bounded inference requests leave the machine. ownership and revocability are not afterthoughts.",
      tone: "subtle",
    },
    {
      eyebrow: "step three",
      title: "expand by adding capabilities, not replacing the stack.",
      body:
        "once the first workflow is live, the rest of the system grows by connecting more sources and turning on more skills. the architecture is unified, so the client does not accumulate five unrelated mini-products.",
    },
  ],
  process: {
    eyebrow: "what the prototype proves",
    title: "the poc site mirrors the product thesis in code.",
    steps: [
      {
        title: "strict visual vocabulary",
        body:
          "the prototype is built from a narrow set of containers, sections, blocks, and templates. no page-specific css hacks.",
      },
      {
        title: "typed content shapes",
        body:
          "the example pages are driven by structured content objects that map cleanly to the future markdown and block system.",
      },
      {
        title: "coherent page families",
        body:
          "home, hub, guide, case study, and narrative pages each have a stable structure and a stable job.",
      },
    ],
  },
  cta: {
    title: "the real build would replace hard-coded content with a controlled authoring system.",
    body:
      "that means markdown-backed content, shared blocks, validation, and a content api for OpenClaw instead of editing JSX directly.",
    action: {
      href: "/contact",
      label: "move from poc to production",
    },
  },
};

export const guidePage: GuidePage = {
  template: "guide",
  path: "/howto/productivity/email-triage",
  meta: {
    title: "email triage guide",
    description:
      "guide-page prototype for private email triage using the shared editorial block and template system.",
  },
  hero: {
    eyebrow: "example guide",
    title: "private email triage, without turning your inbox into another saas dependency.",
    deck:
      "this page is a prototype of the how-to family. it takes the existing outline structure from the planning vault and renders it through the shared editorial system.",
    action: {
      href: "/contact",
      label: "use this pattern in the real site",
    },
    aside:
      "guide pages are doing two jobs at once: teaching the capability clearly, and proving that the site can scale through tightly structured content.",
  },
  whatItIs:
    "a private email management system where the agent classifies messages, applies sender rules, drafts routine replies, and queues everything for approval. the point is not to fire off autonomous mail. the point is to reduce overhead while keeping the human in the loop.",
  architecture:
    "the system connects over standard mail protocols, stores state locally, and uses the shared retrieval and task-routing layer that powers the rest of the stack. classification and retrieval can stay local. more complex drafting can use either local or hosted models depending on the deployment mode.",
  personalIntro:
    "for an individual or operator, the experience is about reclaiming mornings and lowering cognitive load.",
  personalUseCases: [
    "morning briefings that surface only the messages that actually require human judgment",
    "sender-specific rules for archives, defer buckets, and follow-up reminders",
    "draft assistance that sounds like you instead of like a vendor template",
  ],
  businessIntro:
    "for a business, the exact same system becomes operational email routing with a much higher privacy bar than a generic cloud copilot.",
  businessUseCases: [
    "executive inbox triage without handing all internal communication to a third-party dashboard",
    "law firm or professional-services email routing that preserves confidentiality assumptions",
    "lead or request classification that feeds into downstream follow-up and meeting prep",
  ],
  relatedIntro:
    "in the full site, this section would link laterally into adjacent capabilities and vertically back into the relevant service pages.",
  relatedLinks: [
    {
      href: "/services",
      label: "service hub",
      summary: "see how the same product is framed across capabilities.",
    },
    {
      href: "/how-it-works",
      label: "how it works",
      summary: "see the deployment and privacy model in plain language.",
    },
  ],
  cta: {
    title: "the interesting thing here is not email.",
    body:
      "it is that the same technical and visual system can keep producing pages like this without turning the frontend into a pile of one-off decisions.",
    action: {
      href: "/contact",
      label: "turn this into a production content system",
    },
  },
};

export const caseStudyPage: CaseStudyPage = {
  template: "caseStudy",
  path: "/case-studies/individuals/personal-health-ai",
  meta: {
    title: "personal health ai case study",
    description:
      "case-study prototype showing the same private-ai system configured as a personal health command center.",
  },
  hero: {
    eyebrow: "example case study",
    title: "a personal health command center that turns scattered signals into one operating picture.",
    deck:
      "this page is a prototype of the case study family. it is based on the existing vault structure, but rendered as a more convincing editorial proof page instead of a bare outline.",
    action: {
      href: "/contact",
      label: "scope a comparable build",
    },
    aside:
      "case studies are one of the two pseo engines in the planning docs, so they need a format that is repeatable, credible, and easy to scale.",
  },
  metrics: {
    items: [
      { label: "system type", value: "personal health ai" },
      { label: "core change", value: "one connected health view" },
      { label: "privacy model", value: "local-first" },
    ],
  },
  challengeIntro:
    "the problem is not lack of data. it is too many disconnected health surfaces that never meet each other.",
  challenge: [
    "wearables, bloodwork, food logging, medications, and notes all live in separate places",
    "manual review does not survive a busy schedule",
    "sensitive health information should not default to broad cloud exposure",
  ],
  solutionIntro:
    "the same private ai architecture was configured for a personal health stack instead of a business document stack.",
  solution: [
    "daily health briefing across sleep, movement, fasting, and recovery",
    "lab result ingestion with trend-aware marker review",
    "medication and supplement context attached to biomarker changes",
    "searchable personal history instead of isolated snapshots",
  ],
  resultIntro:
    "the outcome is not a prettier dashboard. it is a materially better decision environment.",
  results: [
    "a full-picture health view available in seconds",
    "less manual journaling and less context loss between check-ins",
    "one operating system for day-to-day decisions instead of five separate apps",
  ],
  configuration:
    "the underlying technology is the same one described elsewhere in the vault for document review, life ops, and business operations. what changed here is the data connected to it and the surfaces exposed to the user. that is exactly the thesis the whole site needs to communicate.",
  relatedLinks: [
    {
      href: "/howto/productivity/email-triage",
      label: "see the guide page family",
      summary: "compare how a proof page and a capability page differ while sharing the same system.",
    },
    {
      href: "/services",
      label: "return to services",
      summary: "see how the broader capability map is presented.",
    },
  ],
  cta: {
    title: "this is what the site gets to sell once the page system is coherent.",
    body:
      "the prototype case study is only one example, but it proves the content flywheel can be rendered without falling back to generic startup page patterns.",
    action: {
      href: "/contact",
      label: "talk about a real deployment",
    },
  },
};

export const contactPage: NarrativePage = {
  template: "narrative",
  path: "/contact",
  meta: {
    title: "contact",
    description:
      "contact-page prototype for a direct, low-theatre consultation entry point.",
  },
  hero: {
    eyebrow: "contact",
    title: "the real job of the site is to make the right conversation easy to start.",
    deck:
      "no pricing table, no funnel theatre. just a direct path into a scoped conversation about whether the private-ai model actually fits the situation.",
    action: {
      href: `mailto:${siteConfig.contactEmail}`,
      label: `email ${siteConfig.contactEmail}`,
    },
  },
  sections: [
    {
      eyebrow: "what to bring",
      title: "a bottleneck, a workflow, or a stack that feels fragmented.",
      body:
        "the best starting point is not a shopping list of ai features. it is a real operational pain point. a messy inbox. document overload. scattered personal health data. project state that lives half in people’s heads and half in five tools.",
    },
    {
      eyebrow: "what happens next",
      title: "scope first, architecture second, implementation after that.",
      body:
        "the goal of the first call is not to sell theatrically. it is to identify whether the private, owned-infrastructure model is the right shape at all. if it is, then the conversation becomes about the minimum useful deployment and the best first capability to prove.",
      tone: "subtle",
    },
  ],
  cta: {
    title: "this page would eventually become a real conversion surface.",
    body:
      "for the poc, it mostly proves that the restrained visual system can still support clear calls to action without turning into a template kit.",
    action: {
      href: "/",
      label: "back to the prototype home",
    },
  },
};

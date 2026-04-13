import Link from "next/link";

import { Button } from "@/components/site/button";
import { PageContainer } from "@/components/site/page-container";
import { Section } from "@/components/site/section";
import { Text } from "@/components/site/text";
import type {
  CtaBlockData,
  HeroBlockData,
  MetricStripBlockData,
  ProcessBlockData,
  QuoteBlockData,
  SectionCopyBlockData,
} from "@/content/types";
import { cn } from "@/lib/cn";

const glassPanelClass =
  "rounded-[2rem] border border-white/70 bg-white/78 shadow-[0_24px_60px_rgba(16,32,48,0.08)] backdrop-blur-xl";

const raisedPanelClass =
  "rounded-[1.5rem] border border-slate-200/80 bg-white/90 shadow-[0_22px_54px_rgba(16,32,48,0.09)]";

const darkPanelClass =
  "rounded-[2rem] border border-slate-700/40 bg-[linear-gradient(180deg,rgba(13,25,39,0.96),rgba(16,33,53,0.94))] shadow-[0_28px_70px_rgba(8,18,31,0.28)]";

function PageQuarryCodePreview() {
  const lines = [
    '{% hero',
    '  eyebrow="Markdown-First Sites"',
    '  title="A Calm Publishing System..."',
    '  actionLabel="View on GitHub"',
    '/%}',
  ];

  return (
    <div className={cn(darkPanelClass, "overflow-hidden")}>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
        </div>
        <span className="font-mono text-[0.72rem] font-medium tracking-[0.08em] text-slate-400">
          content/archive/index/current.md
        </span>
      </div>

      <pre className="overflow-x-auto px-4 py-4 text-[0.82rem] leading-7 text-slate-200 sm:px-5">
        <code>
          {lines.map((line, index) => (
            <span className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4" key={line}>
              <span className="text-right text-slate-500">{index + 1}</span>
              <span>{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export function PageQuarryHeroBlock({
  eyebrow,
  title,
  deck,
  action,
  aside,
}: HeroBlockData) {
  return (
    <Section spacing="hero" className="pt-10 sm:pt-14">
      <PageContainer>
        <div className={cn(glassPanelClass, "overflow-hidden px-6 py-8 sm:px-10 sm:py-12")}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div className="max-w-4xl">
              <Text className="mb-5" variant="eyebrow">
                {eyebrow}
              </Text>
              <Text as="h1" className="max-w-4xl text-balance" variant="display">
                {title}
              </Text>
              <Text as="p" className="mt-6 max-w-2xl" variant="lead">
                {deck}
              </Text>
              {action ? (
                <div className="mt-8">
                  <Button asChild variant="solid">
                    <Link href={action.href}>{action.label}</Link>
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              {aside ? (
                <div className={cn(raisedPanelClass, "p-6")}>
                  <div className="mb-5 h-px w-14 bg-accent/35" />
                  <Text as="p" className="leading-7 text-foreground" variant="bodySmall">
                    {aside}
                  </Text>
                </div>
              ) : null}

              <div className="space-y-3">
                <Text as="p" className="text-slate-500" variant="eyebrow">
                  Code Sample
                </Text>
                <PageQuarryCodePreview />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}

export function PageQuarryMetricStripBlock({ items }: MetricStripBlockData) {
  return (
    <Section spacing="compact" className="-mt-2 sm:-mt-4">
      <PageContainer>
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              className="rounded-[1.5rem] border border-white/70 bg-white/78 px-5 py-5 shadow-[0_20px_48px_rgba(16,32,48,0.08)] backdrop-blur-xl"
              key={item.label}
            >
              <Text variant="metricLabel">{item.label}</Text>
              <Text className="mt-4" variant="metricValue">
                {item.value}
              </Text>
            </div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}

export function PageQuarrySectionCopyBlock({
  eyebrow,
  title,
  body,
  bullets,
  links,
  tone = "default",
}: SectionCopyBlockData) {
  const panelClass = tone === "subtle" ? "bg-white/68" : "bg-white/78";

  return (
    <Section spacing="default">
      <PageContainer className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-28">
          {eyebrow ? (
            <Text className="mb-3" variant="eyebrow">
              {eyebrow}
            </Text>
          ) : null}
          <Text as="h2" variant="sectionTitle">
            {title}
          </Text>
        </div>

        <div
          className={cn(
            "rounded-[1.75rem] border border-white/70 p-6 shadow-[0_24px_60px_rgba(16,32,48,0.08)] backdrop-blur-xl sm:p-8",
            panelClass
          )}
        >
          <div className="space-y-5">
            {body.split(/\n\n+/).map((paragraph, i) => (
              <Text as="p" key={i} variant="body">
                {paragraph}
              </Text>
            ))}
          </div>

          {bullets?.length ? (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {bullets.map((item) => (
                <li
                  className="rounded-[1.25rem] border border-slate-200/80 bg-white/78 px-4 py-4"
                  key={item}
                >
                  <Text as="span" className="text-foreground" variant="body">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          ) : null}

          {links?.length ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <Link
                  className="rounded-[1.25rem] border border-slate-200/80 bg-white/90 px-5 py-5 shadow-[0_18px_44px_rgba(16,32,48,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
                  href={link.href}
                  key={link.href}
                >
                  <Text as="span" className="inline-flex items-center gap-2" variant="link">
                    <span>{link.label}</span>
                    <span aria-hidden="true">→</span>
                  </Text>
                  {link.summary ? (
                    <Text as="p" className="mt-2" variant="bodySmall">
                      {link.summary}
                    </Text>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </Section>
  );
}

export function PageQuarryProcessBlock({
  eyebrow,
  title,
  steps,
}: ProcessBlockData) {
  return (
    <Section spacing="default">
      <PageContainer className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <div>
          <Text className="mb-3" variant="eyebrow">
            {eyebrow}
          </Text>
          <Text as="h2" variant="sectionTitle">
            {title}
          </Text>
        </div>

        <ol className="grid gap-4">
          {steps.map((step, index) => (
            <li
              className="rounded-[1.75rem] border border-white/70 bg-white/78 p-5 shadow-[0_24px_60px_rgba(16,32,48,0.08)] backdrop-blur-xl sm:p-6"
              key={step.title}
            >
              <div className="grid gap-4 sm:grid-cols-[4.25rem_minmax(0,1fr)]">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-semibold tracking-[0.12em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <Text as="h3" variant="subhead">
                    {step.title}
                  </Text>
                  <Text as="p" className="mt-3" variant="body">
                    {step.body}
                  </Text>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </PageContainer>
    </Section>
  );
}

export function PageQuarryQuoteBlock({
  quote,
  attribution,
  context,
}: QuoteBlockData) {
  return (
    <Section spacing="default">
      <PageContainer width="reading">
        <div
          className="rounded-[2rem] border border-white/70 bg-white/78 px-6 py-8 shadow-[0_24px_60px_rgba(16,32,48,0.08)] backdrop-blur-xl sm:px-10 sm:py-10"
        >
          <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-mono text-base font-semibold">
            01
          </div>
          <blockquote>
            <Text variant="quote">“{quote}”</Text>
            <footer className="mt-8 space-y-1">
              <Text as="p" className="font-medium text-foreground" variant="bodySmall">
                {attribution}
              </Text>
              <Text as="p" variant="bodySmall">
                {context}
              </Text>
            </footer>
          </blockquote>
        </div>
      </PageContainer>
    </Section>
  );
}

export function PageQuarryCtaBlock({ title, body, action }: CtaBlockData) {
  return (
    <Section spacing="cta">
      <PageContainer>
        <div className={cn(darkPanelClass, "px-6 py-8 text-accent-foreground sm:px-10 sm:py-10")}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <Text as="h2" className="text-accent-foreground sm:text-[3.4rem]" variant="sectionTitle">
                {title}
              </Text>
              <Text
                as="p"
                className="mt-4 text-accent-foreground/76 sm:text-[1.18rem]"
                variant="lead"
              >
                {body}
              </Text>
            </div>

            <Button
              asChild
              className="w-full justify-center !bg-white !text-foreground shadow-[0_16px_32px_rgba(8,18,31,0.22)] hover:!bg-white/92 lg:w-auto"
              variant="solid"
            >
              <Link href={action.href}>{action.label}</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}

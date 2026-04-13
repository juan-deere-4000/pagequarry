import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

export const textVariants = cva("", {
  variants: {
    variant: {
      brand:
        "font-serif text-sm font-semibold uppercase tracking-[0.34em] text-foreground",
      eyebrow:
        "font-mono text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground",
      display:
        "font-serif text-5xl font-medium leading-[0.92] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl",
      lead: "text-lg leading-8 text-muted-foreground sm:text-[1.22rem] sm:leading-9",
      sectionTitle:
        "font-serif text-3xl font-medium leading-[1.02] tracking-[-0.04em] text-foreground sm:text-5xl",
      body: "text-base leading-8 text-muted-foreground sm:text-[1.05rem]",
      bodySmall: "text-sm leading-6 text-muted-foreground",
      subhead:
        "font-serif text-2xl font-medium leading-tight tracking-[-0.03em] text-foreground",
      link:
        "font-medium text-accent underline decoration-current underline-offset-4",
      inlineLink:
        "text-accent underline decoration-current underline-offset-4",
      metricLabel:
        "font-mono text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground",
      metricValue:
        "font-serif text-4xl font-medium leading-none tracking-[-0.05em] text-foreground",
      quote:
        "font-serif text-3xl font-medium leading-[1.04] tracking-[-0.05em] text-foreground sm:text-[3.2rem]",
      nav: "font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent",
      navTop:
        "font-mono text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground",
      navSection:
        "font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground",
      navChild: "text-sm text-muted-foreground hover:text-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TextOwnProps<TAs extends ElementType> = VariantProps<typeof textVariants> & {
  as?: TAs;
  className?: string;
};

export type TextProps<TAs extends ElementType = "p"> = TextOwnProps<TAs> &
  Omit<ComponentPropsWithoutRef<TAs>, keyof TextOwnProps<TAs>>;

export function Text<TAs extends ElementType = "p">({
  as,
  className,
  variant,
  ...props
}: TextProps<TAs>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}

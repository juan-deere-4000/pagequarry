import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

export const textVariants = cva("", {
  variants: {
    variant: {
      brand: "font-serif text-xl font-semibold tracking-tight text-foreground",
      eyebrow: "text-xs uppercase tracking-[0.22em] text-muted-foreground",
      display:
        "font-serif text-5xl leading-none tracking-tight text-foreground sm:text-6xl lg:text-7xl",
      lead: "text-lg leading-8 text-muted-foreground sm:text-xl",
      sectionTitle:
        "font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl",
      body: "text-base leading-8 text-muted-foreground sm:text-lg",
      bodySmall: "text-sm leading-6 text-muted-foreground",
      subhead: "font-serif text-xl leading-tight text-foreground",
      link:
        "font-medium text-foreground underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent",
      metricLabel:
        "text-xs uppercase tracking-[0.18em] text-muted-foreground",
      metricValue:
        "font-serif text-3xl leading-none tracking-tight text-foreground",
      quote:
        "font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl",
      nav: "text-sm text-muted-foreground hover:text-accent",
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

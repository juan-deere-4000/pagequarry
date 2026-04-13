import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const sectionVariants = cva("", {
  variants: {
    tone: {
      default: "",
      subtle: "",
      accent: "",
    },
    spacing: {
      hero: "py-14 sm:py-20",
      default: "py-10 sm:py-14",
      compact: "py-8 sm:py-10",
      cta: "py-14 sm:py-16",
    },
  },
  defaultVariants: {
    tone: "default",
    spacing: "default",
  },
});

type SectionProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionVariants>;

export function Section({
  className,
  tone,
  spacing,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ tone, spacing }), className)}
      {...props}
    />
  );
}

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
      hero: "py-16 sm:py-24",
      default: "py-14 sm:py-20",
      compact: "py-10 sm:py-14",
      cta: "py-16 sm:py-18",
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

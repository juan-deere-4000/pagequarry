import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const pageContainerVariants = cva("mx-auto w-full px-6 sm:px-8", {
  variants: {
    width: {
      narrow: "max-w-3xl",
      reading: "max-w-4xl",
      wide: "max-w-6xl",
      full: "max-w-7xl",
    },
  },
  defaultVariants: {
    width: "wide",
  },
});

type PageContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof pageContainerVariants>;

export function PageContainer({
  className,
  width,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(pageContainerVariants({ width }), className)}
      {...props}
    />
  );
}

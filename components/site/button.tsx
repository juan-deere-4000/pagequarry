import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex min-w-[9.75rem] transform-gpu items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color,border-color,color,box-shadow,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "bg-slate-900 text-white shadow-[0_18px_36px_rgba(16,32,48,0.18)] hover:-translate-y-px hover:bg-slate-800 hover:shadow-[0_22px_42px_rgba(16,32,48,0.24)] hover:brightness-[1.03] active:translate-y-0 active:shadow-[0_14px_28px_rgba(16,32,48,0.18)]",
        ghost:
          "border border-white/70 bg-white/70 text-foreground shadow-[0_18px_36px_rgba(16,32,48,0.08)] backdrop-blur-xl hover:-translate-y-px hover:border-accent/35 hover:bg-white/88 hover:shadow-[0_20px_40px_rgba(16,32,48,0.12)] active:translate-y-0 active:shadow-[0_14px_28px_rgba(16,32,48,0.08)]",
        link: "px-0 py-0 text-accent underline decoration-border underline-offset-4 hover:text-accent/85 hover:decoration-accent",
      },
    },
    defaultVariants: {
      variant: "ghost",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-ink-line bg-ink-raised text-paper-muted",
        long: "border-signal-long/40 bg-signal-longMuted text-signal-long",
        short: "border-signal-short/40 bg-signal-shortMuted text-signal-short",
        hold: "border-signal-hold/40 bg-signal-hold/10 text-signal-hold",
        brass: "border-brass/40 bg-brass/10 text-brass-bright",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-text-primary text-background",
        secondary: "bg-surface border border-border text-text-secondary",
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        error: "bg-error/10 text-error border border-error/20",
        accent: "bg-accent/10 text-accent border border-accent/20",
        feature: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
        fix: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
        refactor: "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20",
        investigation: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

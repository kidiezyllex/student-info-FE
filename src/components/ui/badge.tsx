import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer w-fit text-nowrap",
  {
    variants: {
      variant: {
        default:
          "border-transparent -foreground text-nowrap",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-white text-nowrap",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 text-nowrap",
        outline: "text-foreground border h-[30px] px-3 !border-white/50 bg-transparent text-[#343A40] font-semibold !rounded-none rounded-full text-nowrap",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

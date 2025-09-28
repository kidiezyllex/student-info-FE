import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 h-7 rounded-[6px] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer w-fit text-nowrap",
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
        orange: "bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-100 text-nowrap flex items-center gap-1",
        red: "bg-red-500 hover:bg-red-600 text-white border-2 border-red-100 text-nowrap flex items-center gap-1",
        amber: "bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-100 text-nowrap flex items-center gap-1",
        yellow: "bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-100 text-nowrap flex items-center gap-1",
        lime: "bg-lime-500 hover:bg-lime-600 text-white border-2 border-lime-100 text-nowrap flex items-center gap-1",
        green: "bg-green-500 hover:bg-green-600 text-white border-2 border-green-100 text-nowrap flex items-center gap-1",
        emerald: "bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-emerald-100 text-nowrap flex items-center gap-1",
        teal: "bg-teal-500 hover:bg-teal-600 text-white border-2 border-teal-100 text-nowrap flex items-center gap-1",
        cyan: "bg-cyan-500 hover:bg-cyan-600 text-white border-2 border-cyan-100 text-nowrap flex items-center gap-1",
        sky: "bg-sky-500 hover:bg-sky-600 text-white border-2 border-sky-100 text-nowrap flex items-center gap-1",
        blue: "bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-100 text-nowrap flex items-center gap-1",
        indigo: "bg-indigo-500 hover:bg-indigo-600 text-white border-2 border-indigo-100 text-nowrap flex items-center gap-1",
        violet: "bg-violet-500 hover:bg-violet-600 text-white border-2 border-violet-100 text-nowrap flex items-center gap-1",
        purple: "bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-100 text-nowrap flex items-center gap-1",
        fuchsia: "bg-fuchsia-500 hover:bg-fuchsia-600 text-white border-2 border-fuchsia-100 text-nowrap flex items-center gap-1",
        pink: "bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-100 text-nowrap flex items-center gap-1",
        rose: "bg-rose-500 hover:bg-rose-600 text-white border-2 border-rose-100 text-nowrap flex items-center gap-1",
        slate: "bg-slate-500 hover:bg-slate-600 text-white border-2 border-slate-100 text-nowrap flex items-center gap-1",
        gray: "bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-100 text-nowrap flex items-center gap-1",
        zinc: "bg-zinc-500 hover:bg-zinc-600 text-white border-2 border-zinc-100 text-nowrap flex items-center gap-1",
        neutral: "bg-neutral-500 hover:bg-neutral-600 text-white border-2 border-neutral-100 text-nowrap flex items-center gap-1",
        stone: "bg-stone-500 hover:bg-stone-600 text-white border-2 border-stone-100 text-nowrap flex items-center gap-1"
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

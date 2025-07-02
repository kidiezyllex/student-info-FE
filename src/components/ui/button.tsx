import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { RippleEffect } from "./ripple-effect";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 !margin-0",
	{
		variants: {
			variant: {
				default: "bg-[#1B61FF] text-maintext text-mainBackgroundV1 hover:bg-[#3EB1B9] font-semibold",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline: "border border-[#1B61FF] !bg-[#1B61FF20] !text-[#1B61FF] font-semibold hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-blue-50 hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-[6px] px-3 text-xs",
				lg: "h-10 rounded-[6px] px-8",
				icon: "h-9 w-9",
			  },
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	ripple?: boolean;
	rippleColor?: string;
	rippleDuration?: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ripple = false, rippleColor, rippleDuration, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		const buttonElement = (
			<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
		);

		if (ripple) {
			return (
				<RippleEffect
					rippleColor={rippleColor || "rgba(255, 255, 255, 0.4)"}
					duration={rippleDuration || 500}
					className="inline-flex"
				>
					{buttonElement}
				</RippleEffect>
			);
		}

		return buttonElement;
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };

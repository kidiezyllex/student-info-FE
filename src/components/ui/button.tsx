import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { RippleEffect } from "./ripple-effect";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 !margin-0",
	{
		variants: {
			variant: {
				default: "bg-[#F56C14] text-maintext text-mainBackgroundV1 hover:bg-[#3EB1B9] font-semibold",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline: "border border-[#F56C14] !bg-[#F56C1420] !text-[#F56C14] font-semibold hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-orange-50 hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 px-3 text-xs",
				lg: "h-10 px-8",
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

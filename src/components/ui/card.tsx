import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground overflow-hidden", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("flex flex-row bg-[#F9FAFB] overflow-hidden border-b border-b-lightBorderV1 px-4 py-[10px] text-base font-semibold text-mainTextV1", className)}
			{...props}
		/>
	),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
	),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, ...props }, ref) => (
		<p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
	),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn("pt-0 px-4 py-[10px] flex-1", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("flex min-h-10 items-center pt-0 px-4 py-[10px] border-t border-t-lightBorderV1", className)}
			{...props}
		/>
	),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

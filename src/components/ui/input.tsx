import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-9 w-full rounded-sm bg-mainCardV1 px-3 py-1 text-base transition-colors file:border-0 file:bg-mainCardV1 file:text-sm file:font-medium file:text-foreground focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:!border-mainActiveV1/50 focus:!ring-mainActiveV1/50 border !border-lightBorderV1",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };

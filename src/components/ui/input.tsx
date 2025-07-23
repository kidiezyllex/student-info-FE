import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md bg-mainCardV1 px-3 py-1 text-base transition-colors file:border-0 file:bg-mainCardV1 file:text-sm file:font-semibold file:text-foreground focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:!border-gray-700 focus:!ring-gray-700/50 border !border-lightBorderV1",
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

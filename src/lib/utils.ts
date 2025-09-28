import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
	if (!address) return "";
	if (address.length < 10) return address;

	return `${address.substring(0, 4)}…${address.substring(address.length - 4)}`;
}

export function formatTimestamp(timestamp: number): string {
	const now = Date.now();
	const diff = now - timestamp;

	if (diff < 60000) {
		return "Just Now";
	} else if (diff < 3600000) {
		const minutes = Math.floor(diff / 60000);
		return `${minutes} min${minutes > 1 ? "s" : ""}`;
	} else if (diff < 86400000) {
		const hours = Math.floor(diff / 3600000);
		return `${hours} hour${hours > 1 ? "s" : ""}`;
	} else {
		const days = Math.floor(diff / 86400000);
		return `${days} day${days > 1 ? "s" : ""}`;
	}
}

export function formatCurrency(value: number): string {
	if (value === 0) return "$0.00";

	if (Math.abs(value) < 0.01) {
		return value < 0 ? "<-$0.01" : "<$0.01";
	}

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

export function gweiToEth(gweiValue: string | number): string {
	const gwei = typeof gweiValue === "string" ? Number.parseFloat(gweiValue) : gweiValue;
	const eth = gwei * 1e-9;
	return eth.toFixed(9);
}

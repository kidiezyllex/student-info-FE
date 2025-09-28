export const formatCurrency = (value: string) => {
	const num = Number.parseFloat(value);
	if (Number.isNaN(num)) return "0";

	if (num >= 1000000000000) {
		return `$${(num / 1000000000000).toFixed(0)}T`;
	} else if (num >= 1000000000) {
		return `$${(num / 1000000000).toFixed(2)}B`;
	} else if (num >= 1000000) {
		return `$${(num / 1000000).toFixed(2)}M`;
	} else if (num >= 1000) {
		return `$${(num / 1000).toFixed(2)}K`;
	} else {
		return `$${num.toFixed(2)}`;
	}
};

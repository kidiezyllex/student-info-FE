import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		screens: {
			xs: "360px",
			sm: "568px",
			md: "768px",
			lg: "992px",
			xl: "1280px",
			xxl: "1560px",
			xxxl: "1920px",
		},
		extend: {
			fontWeight: {
				thin: "100",
				light: "300",
				normal: "400",
				medium: "500",
				semibold: "600",
				bold: "700",
				extrabold: "800",
				black: "900",
			},
			boxShadow: {
				"light-grey": "0 4px 6px rgba(211, 211, 211, 0.6)",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				primary: {
					// DEFAULT: "#F56C14",
					DEFAULT: "#F56C14",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "#9035E3",
					foreground: "hsl(var(--secondary-foreground))",
				},
				bgBackground: "#F9F9FC",
				mainBackgroundV1: "#F9F9FC",
				mainTextV1: "#5D7186",
				secondaryTextV1: "#687D92",
				mainTextHoverV1: "#F56C14",
				mainDarkBackgroundV1: "#1C252E",
				mainSuccessV1: "#5CC184",
				mainSuccessHoverV1: "#53AE77",
				mainWarningV1: "#F0934E",
				mainWarningHoverV1: "#D88446",
				mainDangerV1: "#E66666",
				mainDangerHoverV1: '#D25D5D',
				mainInfoV1: "#F56C14",
				mainInfoHoverV1: "#3EB1B9",
				mainCardV1: "#FFFFFF",
				lightBorderV1: "#E5E5E5",
				darkBorderV1: "#3D444D",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
				background: '#F9F9FC',
			},
			fontSize: {
				"16": "1rem",
				"34": "2.125em",
			},
			width: {
				"100": "6.25em",
				"200": "12.5em",
				"300": "18.75em",
				"400": "25em",
				"500": "31.25em",
			},
			maxWidth: {
				"100": "6.25em",
				"200": "12.5em",
				"300": "18.75em",
				"400": "25em",
				"500": "31.25em",
			},
			minWidth: {
				"100": "6.25em",
				"200": "12.5em",
				"300": "18.75em",
				"400": "25em",
				"500": "31.25em",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				"logo-cloud": {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(calc(-100% - 4rem))" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"logo-cloud": "logo-cloud 30s linear infinite",
			},
		},
	},
	plugins: [
		plugin(function ({ addUtilities }: any) {
			const newUtilities = {
				".scrollbar-thin": {
					scrollbarWidth: "1px",
					scrollbarColor: "#c1c1c1",
				},
				".scrollbar-webkit": {
					"&::-webkit-scrollbar": {
						width: "2px",
					},
					"&::-webkit-scrollbar-track": {
						background: "white",
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "rgb(31 41 55)",
						borderRadius: "20px",
						border: "1px solid white",
					},
				},
			};

			addUtilities(newUtilities, ["responsive", "hover"]);
		}),
		require("tailwindcss-animate"),
	],
};
export default config;

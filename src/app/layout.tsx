import type { Metadata } from "next";
import "./globals.css";
import "./font.css";
import { ReactQueryClientProvider } from "@/provider/ReactQueryClientProvider";
import { ToastProvider } from "@/provider/ToastProvider";
import NextTopLoader from "nextjs-toploader";
import "flag-icons/css/flag-icons.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CustomScrollArea } from "@/components/ui/custom-scroll-area";
import { Open_Sans } from "next/font/google";
import { UserProvider } from "@/context/useUserContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayoutWrapper from "@/components/layout/AppLayoutWrapper";

const openSans = Open_Sans({
	subsets: ["latin", "vietnamese"],
	display: "swap",
	variable: "--font-opensans",
});

export const metadata: Metadata = {
	title: "StudentInfo",
	icons: {
		icon: "/images/faviconV2.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi" suppressHydrationWarning className={openSans.className}>
			<body className="bg-mainBackgroundV1 min-h-screen">
				<ReactQueryClientProvider>
					<UserProvider>
						<NextTopLoader
							color="#1B61FF"
							initialPosition={0.08}
							crawlSpeed={200}
							height={3}
							crawl={true}
							easing="ease"
							speed={200}
							showSpinner={false}
						/>
						<ToastProvider />
						<AppLayoutWrapper>
							<ProtectedRoute>{children}</ProtectedRoute>
						</AppLayoutWrapper>
					</UserProvider>
				</ReactQueryClientProvider>
			</body>
		</html>
	);
}

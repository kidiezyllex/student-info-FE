"use client";

import { motion } from "framer-motion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "tabler-icons-react";
import StatCards from "./StatCards";
import RevenueChart from "./RevenueChart";
import HomeStats from "./HomeStats";
import ContractStats from "./ContractStats";
import PaymentStats from "./PaymentStats";
import DuePayments from "./DuePayments";
import EnhancedRevenueChart from "./EnhancedRevenueChart";
import ContractsComparisonChart from "./ContractsComparisonChart";
import PaymentMethodsPieChart from "./PaymentMethodsPieChart";
import RevenueTrendChart from "./RevenueTrendChart";
import HomesRentalStatusPieChart from "./HomesRentalStatusPieChart";
import PaymentsMonthlyChart from "./PaymentsMonthlyChart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

export default function StatisticsPage() {
	return (
		<div className="min-h-screen bg-mainBackgroundV1 text-mainTextV1 p-6">
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">
							<Home size={16} className="mr-1" />
							Trang chủ
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Dashboard</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<motion.div
				className="space-y-8"
				variants={container}
				initial="hidden"
				animate="show"
			>
				<motion.div variants={item}>
					<h1 className="text-3xl font-semibold mb-8 text-mainTextV1">Bảng điều khiển</h1>
				</motion.div>

				<motion.div variants={item}>
					<StatCards />
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<motion.div variants={item}>
						<ContractStats />
					</motion.div>
					<motion.div variants={item}>
						<PaymentStats />
					</motion.div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<motion.div variants={item}>
						<EnhancedRevenueChart />
					</motion.div>
					<motion.div variants={item}>
						<ContractsComparisonChart />
					</motion.div>
				</div>
				<div className="grid grid-cols-1 gap-8">
					<motion.div variants={item}>
						<RevenueTrendChart />
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}

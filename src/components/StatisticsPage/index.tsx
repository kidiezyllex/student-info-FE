"use client";

import { motion } from "framer-motion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "tabler-icons-react";
import StatCards from "./StatCards";
import ScholarshipStats from "./ScholarshipStats";
import EventStats from "./EventStats";
import StudentRegistrationChart from "./StudentRegistrationChart";
import DepartmentComparisonChart from "./DepartmentComparisonChart";
import ScholarshipTrendChart from "./ScholarshipTrendChart";
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
		<div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Statistics</BreadcrumbPage>
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
					<StatCards />
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<motion.div variants={item}>
						<ScholarshipStats />
					</motion.div>
					<motion.div variants={item}>
						<EventStats />
					</motion.div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<motion.div variants={item}>
						<StudentRegistrationChart />
					</motion.div>
					<motion.div variants={item}>
						<DepartmentComparisonChart />
					</motion.div>
				</div>
				<div className="grid grid-cols-1 gap-8">
					<motion.div variants={item}>
						<ScholarshipTrendChart />
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}

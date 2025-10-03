"use client";

import { motion } from "framer-motion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "tabler-icons-react";
import { useUser } from "@/context/useUserContext";
import Image from "next/image";
import StatCards from "./StatCards";
import ScholarshipStats from "./ScholarshipStats";
import EventStats from "./EventStats";
import StudentRegistrationChart from "./StudentRegistrationChart";
import DepartmentComparisonChart from "./DepartmentComparisonChart";
import ScholarshipTrendChart from "./ScholarshipTrendChart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetUserProfile } from "@/hooks/useUser";

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
	const { data: userProfile } = useGetUserProfile();
	const username = userProfile?.data?.name || "User";
	return (
		<div className="space-y-8 bg-white p-4 rounded-lg border border-lightBorderV1">
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

			{/* Admin Header */}
			<motion.div 
				variants={item}
				initial="hidden"
				animate="show"
				className="relative bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 py-8 min-h-[100px] overflow-visible"
			>
				{/* Background Image */}
				<Image
					src="/images/circle-scatter-haikei.svg"
					alt="Background pattern"
					fill
					className="absolute inset-0 object-cover opacity-20 z-0"
				/>

				{/* Robot Image */}
				<Image
					src="/images/robot1.webp"
					alt="Robot"
					width={1000}
					height={1000}
					draggable={false}
					priority
					quality={100}
					className="absolute bottom-0 right-0 h-[200px] w-auto object-contain z-10"
				/>
				
				{/* Content */}
				<div className="relative z-10 flex items-start justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Admin Dashboard
						</h1>
						<p className="text-gray-600">
							Welcome, Admin <span className="font-semibold text-orange-600">{username}</span> - System Overview & Analytics
						</p>
					</div>
				</div>
			</motion.div>

			<motion.div
				className="space-y-8"
				variants={container}
				initial="hidden"
				animate="show"
			>
				<motion.div variants={item}>
					<StatCards />
				</motion.div>

				<motion.div variants={item}>
					<ScholarshipStats />
				</motion.div>

				<motion.div variants={item}>
					<EventStats />
				</motion.div>

				<div className="flex flex-col lg:flex-row gap-8 items-stretch">
					<motion.div variants={item} className="flex-1 flex flex-col w-[48%]">
						<StudentRegistrationChart />
					</motion.div>
					<motion.div variants={item} className="flex-1 flex flex-col w-[48%]">
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

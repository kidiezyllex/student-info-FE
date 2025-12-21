"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useGetUserProfile } from "@/hooks/useUser";

interface DashboardHeaderProps {
	title: string;
	description: string;
	username?: string;
}

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

export default function DashboardHeader({ title, description, username: propUsername }: DashboardHeaderProps) {
	const { data: userProfile } = useGetUserProfile();
	const username = propUsername || userProfile?.data?.name || "User";

	return (
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
						{title}
					</h1>
					<p className="text-gray-800">
						Welcome, Admin <span className="font-semibold text-orange-600">{username}</span> - System Overview & Analytics
					</p>
				</div>
			</div>
		</motion.div>
	);
}

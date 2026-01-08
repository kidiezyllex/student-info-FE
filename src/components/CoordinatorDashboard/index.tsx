"use client";

import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "../Common/DashboardHeader";
import { useUser } from "@/context/useUserContext";
import {
  IconUsers,
  IconFileText,
  IconTicket,
  IconCheck,
} from "@tabler/icons-react";
import { useGetTicketStats } from "@/hooks/useSupportTicket";
import { useGetTopicsAdmin } from "@/hooks/useTopic";
import { useGetDepartmentStats } from "@/hooks/useDepartment";
import Link from "next/link";
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const StatCard = ({
  link,
  title,
  value,
  icon: IconComponent,
  color,
  bgColor,
  delay = 0,
}: {
  link: string;
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Link href={link}>
        <Card
          style={{
            border: `1px solid ${color}40`,
          }}
          className="group cursor-pointer relative overflow-hidden p-6 h-full flex flex-col bg-gradient-to-br from-white to-gray-50/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-2xl"
        >
          {/* Background decoration */}
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8"
            style={{ backgroundColor: color }}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-gray-800 text-sm font-semibold uppercase tracking-wider">
                {title}
              </h3>
            </div>
            <div
              className={`${bgColor} p-3 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110`}
            >
              <IconComponent
                className={`w-6 h-6 ${color.replace("#", "text-")}`}
              />
            </div>
          </div>

          {/* Value */}
          <div className="mt-auto">
            <p
              className="text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
              }}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <div className="flex items-center space-x-2">
              <div
                className="h-[6px] w-12 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-500 font-semibold">
                Current total
              </span>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
            }}
          />
        </Card>
      </Link>
    </motion.div>
  );
};

export default function CoordinatorDashboard() {
  const { profile } = useUser();
  const departmentId = profile?.data?.department?._id || "";

  // Fetch department-specific statistics
  const { data: deptStats } = useGetDepartmentStats(departmentId, {
    enabled: !!departmentId,
  });

  // Legacy hooks (can be removed once department stats is fully integrated)
  const { data: ticketStats } = useGetTicketStats();
  const { data: topicsData } = useGetTopicsAdmin({ page: 1, limit: 1 });

  const departmentName = profile?.data?.department?.name || "Your Department";

  const stats = [
    {
      title: "Active Topics",
      value: deptStats?.data?.activeTopics || 0,
      icon: IconFileText,
      color: "#3B82F6",
      bgColor: "bg-blue-50",
      link: "/coordinator/topics",
    },
    {
      title: "Resolved Tickets",
      value: deptStats?.data?.tickets?.resolved || 0,
      icon: IconCheck,
      color: "#10B981",
      bgColor: "bg-green-50",
      link: "/coordinator/tickets?status=resolved",
    },
    {
      title: "Open Tickets",
      value: deptStats?.data?.tickets?.pending || 0,
      icon: IconTicket,
      color: "#F59E0B",
      bgColor: "bg-orange-50",
      link: "/coordinator/tickets",
    },
    {
      title: "Department Students",
      value: deptStats?.data?.studentsCount || 0,
      icon: IconUsers,
      color: "#8B5CF6",
      bgColor: "bg-purple-50",
      link: "#",
    },
  ];

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/coordinator">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DashboardHeader
        title={`${departmentName} Dashboard`}
        description={`Welcome, ${
          profile?.data?.name || "Coordinator"
        } - Department Overview & Management`}
      />

      <motion.div
        className="space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Stats Cards */}
        <motion.div variants={item}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.title}
                link={stat.link}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                bgColor={stat.bgColor}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

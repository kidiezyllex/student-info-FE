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
  IconCalendarEvent,
} from "@tabler/icons-react";
import { useGetTicketStats } from "@/hooks/useSupportTicket";
import Link from "next/link";
import Image from "next/image";

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
  const { data: ticketStats } = useGetTicketStats();

  const departmentName = profile?.data?.department?.name || "Your Department";

  const stats = [
    {
      title: "Active Topics",
      value: 0,
      icon: IconFileText,
      color: "#3B82F6",
      bgColor: "bg-blue-50",
      link: "/coordinator/topics",
    },
    {
      title: "Active Events",
      value: 0,
      icon: IconCalendarEvent,
      color: "#10B981",
      bgColor: "bg-green-50",
      link: "/coordinator/topics?type=event",
    },
    {
      title: "Open Tickets",
      value:
        ticketStats?.data?.byStatus?.find((s) => s._id === "open")?.count || 0,
      icon: IconTicket,
      color: "#F59E0B",
      bgColor: "bg-orange-50",
      link: "/coordinator/tickets",
    },
    {
      title: "Department Students",
      value: 0,
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

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card className="border-lightBorderV1">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/coordinator/topics"
                  className="group p-6 border-2 border-lightBorderV1 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-start">
                    <div className="p-3 bg-blue-100 rounded-xl mb-4 group-hover:bg-blue-200 transition-colors">
                      <IconFileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">
                      Manage Topics
                    </h4>
                    <p className="text-sm text-gray-600">
                      Create and manage department topics
                    </p>
                  </div>
                </Link>
                <Link
                  href="/coordinator/tickets"
                  className="group p-6 border-2 border-lightBorderV1 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-start">
                    <div className="p-3 bg-orange-100 rounded-xl mb-4 group-hover:bg-orange-200 transition-colors">
                      <IconTicket className="w-8 h-8 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">
                      Support Tickets
                    </h4>
                    <p className="text-sm text-gray-600">
                      Manage student support requests
                    </p>
                  </div>
                </Link>
                <Link
                  href="/coordinator/topics?type=event"
                  className="group p-6 border-2 border-lightBorderV1 rounded-xl hover:border-green-300 hover:bg-green-50/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-start">
                    <div className="p-3 bg-green-100 rounded-xl mb-4 group-hover:bg-green-200 transition-colors">
                      <IconCalendarEvent className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Events</h4>
                    <p className="text-sm text-gray-600">
                      View and manage department events
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item}>
          <Card className="border-lightBorderV1">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <IconFileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-center font-medium">
                  No recent activity to display
                </p>
                <p className="text-gray-400 text-sm text-center mt-2">
                  Activity will appear here as you manage topics and tickets
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

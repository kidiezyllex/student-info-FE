"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/context/useUserContext";
import { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconCalendar, IconGift, IconBell, IconUsers } from "@tabler/icons-react";
import Image from "next/image";
import DashboardHeader from "@/components/Common/DashboardHeader";

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

const QuickActionCard = ({ href, icon, title, description, color, delay = 0 }: {
    href: string;
    icon: string;
    title: string;
    description: string;
    color: string;
    delay?: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="w-full"
        >
            <Link href={href}>
                <Card className="group relative overflow-hidden h-full bg-white hover:bg-gray-50/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-lightBorderV1 hover:border-gray-300">
                    {/* Subtle background accent */}
                    <div
                        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-30 -mr-6 -mt-6 transition-all duration-500 group-hover:opacity-8"
                        style={{ backgroundColor: color }}
                    />
                    
                    {/* Minimal corner accent */}
                    <div
                        className="absolute top-0 left-0 w-0 h-0 border-t-[16px] border-l-[16px] border-transparent opacity-0 transition-all duration-500"
                        style={{ 
                            borderTopColor: color,
                            borderLeftColor: color
                        }}
                    />

                    <CardHeader className="flex flex-col items-center justify-center gap-4 pb-4">
                        {/* Clean icon container */}
                        <div
                            className="mx-auto w-20 h-20 p-2 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 relative"
                            style={{
                                background: `linear-gradient(135deg, ${color}08 0%, ${color}15 100%)`,
                                border: `1px solid ${color}20`
                            }}
                        >
                            <Image src={icon} alt={title} width={200} height={200} className="object-contain" />
                        </div>

                        <CardTitle className="text-base font-semibold text-mainTextV1 group-hover:text-opacity-80 transition-all duration-300 text-center">
                            {title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent 
                    style={{ backgroundColor: color, opacity: 0.9 }}
                    className="pt-4">
                        <p className="text-white text-sm text-center leading-relaxed group-hover:text-opacity-70 transition-all duration-300">
                            {description}
                        </p>
                    </CardContent>

                    <div
                        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                        style={{ backgroundColor: color }}
                    />
                </Card>
            </Link>
        </motion.div>
    );
};

const StatCard = ({ icon: Icon, title, count, color }: {
    icon: React.ElementType;
    title: string;
    count: number;
    color: string;
}) => {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50/50 border border-lightBorderV1 rounded-lg p-4 relative overflow-hidden">
            <div
                className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-30 -mr-4 -mt-4"
                style={{ backgroundColor: color }}
            />

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-secondaryTextV1 text-sm font-semibold uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <p
                        className="text-2xl font-semibold bg-gradient-to-r bg-clip-text text-transparent"
                        style={{
                            backgroundImage: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`
                        }}
                    >
                        {count}
                    </p>
                </div>
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-lightBorderV1"
                    style={{
                        background: `linear-gradient(135deg, ${color}20 0%, ${color}30 100%)`,
                        border: `1px solid ${color}30`
                    }}
                >
                    <Icon size={24} style={{ color }} className="drop-shadow-md" />
                </div>
            </div>
        </div>
    );
};

export default function CoordinatorDashboard() {
  const params = useParams();
  const { profile, isAuthenticated, isLoadingProfile } = useUser();
  const [departmentName, setDepartmentName] = useState<string>("");

  useEffect(() => {
    if (params.department) {
      const decodedDepartment = decodeURIComponent(params.department as string);
      setDepartmentName(decodedDepartment);
    }
  }, [params.department]);

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coordinator profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access the coordinator dashboard.</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
        href: `/coordinator/${encodeURIComponent(departmentName)}/events`,
        icon: "/images/student/events.png",
        title: "Event Management",
        description: "Create and manage department events",
        color: "#3B82F6"
    },
    {
        href: `/coordinator/${encodeURIComponent(departmentName)}/scholarships`,
        icon: "/images/student/scholarships.png",
        title: "Scholarship Management",
        description: "Manage scholarships and applications",
        color: "#10B981"
    },
    {
        href: `/coordinator/${encodeURIComponent(departmentName)}/notifications`,
        icon: "/images/student/notifications.png",
        title: "Notification Management",
        description: "Send notifications to students",
        color: "#F59E0B"
    }
  ];

  return (
    <div className="space-y-8 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/coordinator/${encodeURIComponent(departmentName)}`}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{departmentName} Department</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Department Header */}
      <DashboardHeader 
        title="Coordinator Dashboard"
        description={`Welcome to ${departmentName} Department Management`}
        username={profile?.data?.name}
      />

      <motion.div
        className="space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Quick Actions */}
        <motion.div variants={item}>
          <h2 className="text-xl font-semibold text-mainTextV1 mb-4">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={action.title}
                href={action.href}
                icon={action.icon}
                title={action.title}
                description={action.description}
                color={action.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Statistics Overview */}
        <motion.div variants={item}>
          <h2 className="text-xl font-semibold text-mainTextV1 mb-4">Department Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              icon={IconCalendar}
              title="Total Events"
              count={12}
              color="#3B82F6"
            />
            <StatCard
              icon={IconGift}
              title="Active Scholarships"
              count={8}
              color="#10B981"
            />
            <StatCard
              icon={IconBell}
              title="Notifications Sent"
              count={24}
              color="#F59E0B"
            />
            <StatCard
              icon={IconUsers}
              title="Students"
              count={156}
              color="#8B5CF6"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item}>
          <h2 className="text-xl font-semibold text-mainTextV1 mb-4">Recent Activity</h2>
          <div className="bg-white border border-lightBorderV1 rounded-lg p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New event created: AI Workshop 2024</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Scholarship application approved</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-yellow-50/50 rounded-lg border border-yellow-100">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Notification sent to 156 students</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

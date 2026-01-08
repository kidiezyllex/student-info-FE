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

export default function CoordinatorDashboard() {
  const { profile } = useUser();
  const { data: ticketStats } = useGetTicketStats();

  const departmentName = profile?.data?.department?.name || "Your Department";

  const stats = [
    {
      title: "Active Topics",
      value: "0",
      icon: IconFileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Events",
      value: "0",
      icon: IconCalendarEvent,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Open Tickets",
      value:
        ticketStats?.data?.byStatus?.find((s) => s._id === "open")?.count || 0,
      icon: IconTicket,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Department Students",
      value: "0",
      icon: IconUsers,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
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
              <Card key={index} className="border-lightBorderV1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card className="border-lightBorderV1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/coordinator/topics"
                  className="p-4 border border-lightBorderV1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <IconFileText className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold">Manage Topics</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Create and manage department topics
                  </p>
                </a>
                <a
                  href="/coordinator/tickets"
                  className="p-4 border border-lightBorderV1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <IconTicket className="w-8 h-8 text-orange-600 mb-2" />
                  <h4 className="font-semibold">Support Tickets</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage student support requests
                  </p>
                </a>
                <a
                  href="/coordinator/topics?type=event"
                  className="p-4 border border-lightBorderV1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <IconCalendarEvent className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-semibold">Events</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    View and manage department events
                  </p>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item}>
          <Card className="border-lightBorderV1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">
                No recent activity to display
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

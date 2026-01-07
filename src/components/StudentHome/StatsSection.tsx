"use client";

import { Card } from "@/components/ui/card";
import {
  IconCalendarMonthFilled,
  IconMessageChatbot,
  IconMail,
  IconTicket,
  IconBookmark,
  IconBuilding,
  IconId,
  IconClock,
} from "@tabler/icons-react";
import { ITopic } from "@/interface/response/topic";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useGetUserProfile } from "@/hooks/useUser";
import { useGetSupportTickets } from "@/hooks/useSupportTicket";

type StatsSectionProps = {
  topics: ITopic[];
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
  link,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay?: number;
  link?: string;
}) => {
  const cardContent = (
    <Card
      className={`group border border-orange-400 relative overflow-hidden py-2 px-3 rounded-2xl h-full  transition-all duration-300 hover:-translate-y-1 flex items-center ${
        link ? "cursor-pointer" : ""
      }`}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div
          className="mx-auto w-12 h-12 p-2 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 relative"
          style={{
            background: `linear-gradient(135deg, ${color}20 0%, ${color}30 100%)`,
            border: `1px solid ${color}30`,
          }}
        >
          <div style={{ color: color }}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-gray-800 text-sm font-semibold uppercase tracking-wider">
            {title}
          </h3>
          <p
            className="text-lg font-semibold bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
            }}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
        }}
      />
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      {link ? <Link href={link}>{cardContent}</Link> : cardContent}
    </motion.div>
  );
};

export function StatsSection({ topics }: StatsSectionProps) {
  const { data: userProfile } = useGetUserProfile();
  const { data: ticketsData } = useGetSupportTickets();

  // API can return either array or paginated response
  const myTicketsCount = Array.isArray(ticketsData?.data)
    ? ticketsData.data.length
    : ticketsData?.data?.totalDocs || 0;

  const savedTopicsCount = userProfile?.data?.savedTopics?.length || 0;

  const stats = [
    {
      title: "Calendar",
      value: "View Calendar",
      icon: IconCalendarMonthFilled,
      color: "#F97316",
      link: "/student/calendar",
    },
    {
      title: "My Tickets",
      value: myTicketsCount,
      icon: IconTicket,
      color: "#F97316",
      link: "/student/tickets",
    },
    {
      title: "Saved Topics",
      value: savedTopicsCount,
      icon: IconBookmark,
      color: "#F97316",
    },
    {
      title: "Assistant",
      value: "Chat with VGU Assistant",
      icon: IconMessageChatbot,
      color: "#F97316",
      link: "/student/chat",
    },
  ];

  const userData = userProfile?.data;
  const avatarSrc =
    userData?.avatar ||
    (userData?.gender && userData?.role
      ? `/images/${userData.gender}-${userData.role}.webp`
      : "/images/male-student.webp");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Student Info section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 py-3 rounded-2xl h-full border border-orange-400 relative">
          <div className="flex flex-col gap-2">
            {/* Top Section: Avatar and Basic Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-300 shadow-lg">
                  <Image
                    src={avatarSrc}
                    alt={userData?.name || "Student"}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    draggable={false}
                    quality={100}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {userData?.name || "Loading..."}
                </h3>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IconMail className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span className="font-semibold">
                      Email: {userData?.email || "N/A"}
                    </span>
                  </div>
                  {userData?.studentId && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IconId className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="font-semibold">
                        ID: {userData.studentId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Bottom Section: Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Department */}
              {userData?.department && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-400 p-2 rounded-lg">
                  <div className="bg-orange-100 border border-orange-200 p-2 rounded-md h-9 w-9 flex items-center justify-center flex-shrink-0">
                    <IconBuilding className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 font-medium">
                      Department
                    </p>
                    <p
                      className="text-sm font-bold text-gray-800 truncate"
                      title={userData.department.name}
                    >
                      {userData.department.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Saved Topics */}
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-400 p-2 rounded-lg">
                <div className="bg-orange-100 p-2 rounded-md h-9 w-9 flex items-center justify-center flex-shrink-0 border border-orange-200">
                  <IconBookmark className="w-4 h-4 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium">Saved</p>
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {userData?.savedTopics?.length || 0} Topics
                  </p>
                </div>
              </div>

              {/* Last Login */}
              {userData?.lastLogin && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-400 p-2 rounded-lg">
                  <div className="bg-orange-100 p-2 rounded-md h-9 w-9 flex items-center justify-center flex-shrink-0 border border-orange-200">
                    <IconClock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 font-medium">
                      Last Login
                    </p>
                    <p
                      className="text-sm font-bold text-gray-800 truncate"
                      title={new Date(userData.lastLogin).toLocaleString()}
                    >
                      {new Date(userData.lastLogin).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Background overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-300 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(135deg, #F97316 0%, transparent 100%)`,
              }}
            />
          </div>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            delay={index * 0.1}
            link={stat.link}
          />
        ))}
      </div>
    </div>
  );
}

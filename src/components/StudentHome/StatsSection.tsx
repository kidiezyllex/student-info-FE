"use client";

import { Card } from "@/components/ui/card";
import {
  IconCalendarEvent,
  IconCalendarMonthFilled,
  IconMessageChatbotFilled,
  IconTimelineEventFilled,
  IconMail,
  IconShield,
} from "@tabler/icons-react";
import { ITopic } from "@/interface/response/topic";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useGetUserProfile } from "@/hooks/useUser";

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
      className={`group border border-orange-400 relative overflow-hidden p-4 rounded-2xl h-full flex flex-col transition-all duration-300 hover:-translate-y-1 ${
        link ? "cursor-pointer" : ""
      }`}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-gray-800 text-sm font-semibold uppercase tracking-wider">
            {title}
          </h3>
        </div>
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
      </div>

      {/* Value */}
      <div className="mt-auto">
        <p
          className="text-2xl font-semibold bg-gradient-to-r bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
          }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>

      {/* Hover effect overlay */}
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
  const totalTopics = topics.length;
  const upcomingEvents = topics.filter(
    (t) =>
      t.type === "event" && t.startDate && new Date(t.startDate) > new Date()
  ).length;

  const stats = [
    {
      title: "View Calendar",
      value: "Calendar",
      icon: IconCalendarMonthFilled,
      color: "#F97316",
      link: "/student/calendar",
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents,
      icon: IconTimelineEventFilled,
      color: "#F97316",
    },
    {
      title: "AI Chat",
      value: "Chat",
      icon: IconMessageChatbotFilled,
      color: "#F97316",
      link: "/student/chat",
    },
  ];

  const userData = userProfile?.data;
  const avatarSrc =
    userData?.gender && userData?.role
      ? `/images/${userData.gender}-${userData.role}.webp`
      : "/images/male-student.webp";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Student Info section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 rounded-2xl h-full border border-orange-400 relative">
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
              <div>
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {userData?.name || "Loading..."}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <IconMail className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <span className="truncate">{userData?.email || "N/A"}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-2 rounded-md h-10 w-10 flex items-center justify-center">
                    <IconShield className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Role</p>
                    <p className="text-sm font-bold text-gray-800 capitalize">
                      {userData?.role || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="h-8 w-px bg-orange-200" />
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-2 rounded-md h-10 w-10 flex items-center justify-center">
                    <IconCalendarEvent className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Saved</p>
                    <p className="text-sm font-bold text-gray-800">
                      {userData?.savedTopics?.length || 0} Topics
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

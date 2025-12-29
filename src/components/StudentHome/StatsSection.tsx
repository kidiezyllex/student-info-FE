"use client";

import { Card } from "@/components/ui/card";
import {
  IconCalendarEvent,
  IconCalendarMonthFilled,
  IconMessageChatbotFilled,
} from "@tabler/icons-react";
import { ITopic } from "@/interface/response/topic";
import { motion } from "framer-motion";
import Link from "next/link";

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
      style={{
        border: `1px solid ${color}80`,
      }}
      className={`group relative overflow-hidden p-4 h-full flex flex-col bg-gradient-to-br from-white to-gray-50/50 transition-all duration-300 hover:-translate-y-1 ${
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
          <h3 className="text-gray-800 text-base font-semibold uppercase tracking-wider">
            {title}
          </h3>
        </div>
        <div
          className="mx-auto w-16 h-16 p-2 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 relative"
          style={{
            background: `linear-gradient(135deg, ${color}20 0%, ${color}30 100%)`,
            border: `1px solid ${color}30`,
          }}
        >
          <div style={{ color: color }}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="mt-auto">
        <p
          className="text-4xl font-semibold bg-gradient-to-r bg-clip-text text-transparent"
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
        className="absolute inset-0 bg-gradient-to-br opacity-25 transition-opacity duration-300 pointer-events-none"
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
  const totalTopics = topics.length;
  const upcomingEvents = topics.filter(
    (t) =>
      t.type === "event" && t.startDate && new Date(t.startDate) > new Date()
  ).length;

  const stats = [
    {
      title: "View Calendar",
      value: "Calendar",
      icon: IconCalendarEvent,
      color: "#3B82F6",
      link: "/student/calendar",
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents,
      icon: IconCalendarMonthFilled,
      color: "#10B981",
    },
    {
      title: "AI Chat",
      value: "Chat",
      icon: IconMessageChatbotFilled,
      color: "#8B5CF6",
      link: "/student/chat",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { useGetStatistics } from "@/hooks/useStatistics";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const StatCard = ({
  link,
  title,
  value,
  icon,
  color,
  delay = 0,
}: {
  link: string;
  title: string;
  value: number;
  icon: string;
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
      <Link href={link}>
        <Card
          style={{
            border: `1px solid ${color}80`,
          }}
          className="group cursor-pointer relative overflow-hidden p-4 h-full flex flex-col bg-gradient-to-br from-white to-gray-50/50 transition-all duration-300 hover:-translate-y-1 rounded-2xl"
        >
          {/* Background decoration */}
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8"
            style={{ backgroundColor: color }}
          />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-gray-800 text-sm font-semibold uppercase tracking-wider mb-1">
                {title}
              </h3>
            </div>
            <div
              className="mx-auto w-20 h-20 p-2 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 relative"
              style={{
                background: `linear-gradient(135deg, ${color}20 0%, ${color}30 100%)`,
                border: `1px solid ${color}30`,
              }}
            >
              <Image
                src={icon}
                alt={title}
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </div>

          {/* Value */}
          <div className="mt-auto">
            <p
              className="text-4xl font-semibold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
              }}
            >
              {value.toLocaleString()}
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
      </Link>
    </motion.div>
  );
};

export default function StatCards() {
  const { data: statsData, isLoading } = useGetStatistics();

  const mockData = {
    studentsCount: statsData?.data?.studentsCount ?? 0,
    departmentsCount: statsData?.data?.departmentsCount ?? 0,
    coordinatorsCount: statsData?.data?.coordinatorsCount ?? 0,
    topicsCount: statsData?.data?.topicsCount ?? 0,
  };

  const stats = [
    {
      title: "Students",
      value: mockData.studentsCount,
      icon: "/images/student/students.png",
      color: "#F56C14",
      link: "#",
    },
    {
      title: "Coordinator",
      value: mockData.coordinatorsCount,
      icon: "/images/student/notifications.png", // Using notifications icon for staffs as a placeholder if no staff icon
      color: "#3B82F6",
      link: "#",
    },
    {
      title: "Departments",
      value: mockData.departmentsCount,
      icon: "/images/student/departments.png",
      color: "#5CC184",
      link: "/admin/departments",
    },
    {
      title: "Topics",
      value: mockData.topicsCount,
      icon: "/images/student/events.png",
      color: "#F0934E",
      link: "/admin/topics",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          link={stat.link}
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}

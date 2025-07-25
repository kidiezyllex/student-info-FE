"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, School, Gift, CalendarEvent } from "tabler-icons-react";

// Mock data for student information system
const mockData = {
  studentsCount: 2847,
  departmentsCount: 12,
  eventsCount: 24,
  scholarshipsCount: 15,
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
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
      <Card className="group relative overflow-hidden p-6 h-full flex flex-col bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-md hover:shadow-sm transition-all duration-300 hover:-translate-y-1">
        {/* Background decoration */}
        <div 
          className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8"
          style={{ backgroundColor: color }}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-1">
              {title}
            </h3>
          </div>
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${color}20 0%, ${color}30 100%)`,
              border: `1px solid ${color}30`
            }}
          >
            <Icon size={28} style={{ color }} className="drop-shadow-md" />
          </div>
        </div>
        
        {/* Value */}
        <div className="mt-auto">
          <p 
            className="text-4xl font-semibold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)` 
            }}
          >
            {value.toLocaleString()}
          </p>
          <div className="flex items-center space-x-2">
            <div 
              className="h-1 w-12 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-500 font-semibold">
            Current total
            </span>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
          style={{ backgroundImage: `linear-gradient(135deg, ${color} 0%, transparent 100%)` }}
        />
      </Card>
    </motion.div>
  );
};

export default function StatCards() {
  const stats = [
    {
      title: "Students",
      value: mockData.studentsCount,
      icon: Users,
      color: "#F56C14",
    },
    {
      title: "Departments",
      value: mockData.departmentsCount,
      icon: School,
      color: "#5CC184",
    },
    {
      title: "Events",
      value: mockData.eventsCount,
      icon: CalendarEvent,
      color: "#F0934E",
    },
    {
      title: "Scholarships",
      value: mockData.scholarshipsCount,
      icon: Gift,
      color: "#E91E63",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
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
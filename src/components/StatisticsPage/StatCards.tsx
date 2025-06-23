"use client";

import { useGetGeneralStatistics } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building, Home, Servicemark, Users } from "tabler-icons-react";
import { Skeleton } from "@/components/ui/skeleton";

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
      <Card className="group relative overflow-hidden p-6 h-full flex flex-col bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Background decoration */}
        <div 
          className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8"
          style={{ backgroundColor: color }}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-1">
              {title}
            </h3>
          </div>
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${color}20 0%, ${color}30 100%)`,
              border: `1px solid ${color}30`
            }}
          >
            <Icon size={28} style={{ color }} className="drop-shadow-sm" />
          </div>
        </div>
        
        {/* Value */}
        <div className="mt-auto">
          <p 
            className="text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
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
            <span className="text-xs text-gray-500 font-medium">
              Tổng số hiện tại
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
  const { data, isLoading, error } = useGetGeneralStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 h-full bg-gradient-to-br from-white to-gray-50/50 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
              </div>
              <Skeleton className="w-14 h-14 rounded-2xl" />
            </div>
            <div className="mt-auto">
              <Skeleton className="h-10 w-20 mb-2" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-1 w-12 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-red-800 font-semibold">Lỗi tải dữ liệu</h3>
            <p className="text-red-600 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Tổng số nhà",
      value: data?.data?.homesCount || 0,
      icon: Home,
      color: "#1B61FF",
    },
    {
      title: "Tổng số khách",
      value: data?.data?.guestsCount || 0,
      icon: Users,
      color: "#1B61FF",
    },
    {
      title: "Chủ nhà",
      value: data?.data?.homeOwnersCount || 0,
      icon: Building,
      color: "#5CC184",
    },
    {
      title: "Dịch vụ",
      value: data?.data?.servicesCount || 0,
      icon: Servicemark,
      color: "#F0934E",
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
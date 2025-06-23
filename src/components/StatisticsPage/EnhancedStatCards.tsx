"use client";

import { useGetGeneralStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  IconHome, 
  IconUsers, 
  IconBuilding, 
  IconSettings,
  IconCreditCard,
  IconFileText,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  delay?: number;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  subtitle?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
  trend,
  subtitle
}: StatCardProps) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value === 0) return <IconMinus className="h-3 w-3" />;
    return trend.isPositive ? 
      <IconTrendingUp className="h-3 w-3" /> : 
      <IconTrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value === 0) return 'text-gray-500';
    return trend.isPositive ? 'text-green-600' : 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-secondaryTextV1">
            {title}
          </CardTitle>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="text-2xl font-bold" style={{ color }}>
              {value.toLocaleString()}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>
                  {trend.value > 0 ? '+' : ''}{trend.value}% {trend.period}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function EnhancedStatCards() {
  const { data, isLoading, error } = useGetGeneralStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-md border border-red-200">
        <p className="font-medium">Lỗi khi tải dữ liệu thống kê</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  // Mock trend data - in real app, this would come from API
  const generateMockTrend = (isPositive: boolean = Math.random() > 0.5) => ({
    value: Math.floor(Math.random() * 20) * (isPositive ? 1 : -1),
    isPositive,
    period: 'so với tháng trước'
  });

  const stats = [
    {
      title: "Tổng căn hộ",
      value: data?.data?.homesCount || 0,
      icon: IconHome,
      color: "#1B61FF",
      trend: generateMockTrend(true),
      subtitle: "Căn hộ đang quản lý"
    },
    {
      title: "Khách thuê",
      value: data?.data?.guestsCount || 0,
      icon: IconUsers,
      color: "#1B61FF",
      trend: generateMockTrend(true),
      subtitle: "Khách hàng hiện tại"
    },
    {
      title: "Chủ nhà",
      value: data?.data?.homeOwnersCount || 0,
      icon: IconBuilding,
      color: "#5CC184",
      trend: generateMockTrend(),
      subtitle: "Đối tác chủ nhà"
    },
    {
      title: "Dịch vụ",
      value: data?.data?.servicesCount || 0,
      icon: IconSettings,
      color: "#F0934E",
      trend: generateMockTrend(true),
      subtitle: "Dịch vụ có sẵn"
    },
    {
      title: "Hợp đồng thuê",
      value: 0, // This property doesn't exist in IGeneralStatistics
      icon: IconFileText,
      color: "#E74C3C",
      trend: generateMockTrend(true),
      subtitle: "Hợp đồng đang hoạt động"
    },
    {
      title: "Thanh toán",
      value: 0, // This property doesn't exist in IGeneralStatistics
      icon: IconCreditCard,
      color: "#9B59B6",
      trend: generateMockTrend(),
      subtitle: "Giao dịch tháng này"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-mainTextV1">Tổng quan hệ thống</h2>
        <Badge variant="outline" className="text-xs">
          Cập nhật: {new Date().toLocaleString('vi-VN')}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            delay={index * 0.1}
            trend={stat.trend}
            subtitle={stat.subtitle}
          />
        ))}
      </div>
    </div>
  );
} 
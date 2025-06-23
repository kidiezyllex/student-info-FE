"use client";

import { useGetHomesRentalStatusPieChart } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Home, HomeCheck } from "tabler-icons-react";

export default function HomesRentalStatusPieChart() {
  const { data, isLoading, error } = useGetHomesRentalStatusPieChart();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Lỗi khi tải dữ liệu phân bố căn hộ: {error.message}
        </div>
      </Card>
    );
  }

  const pieData = data?.data;
  
  if (!pieData?.chartData) {
    return (
      <Card className="p-6">
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Chưa có dữ liệu phân bố căn hộ.
        </div>
      </Card>
    );
  }

  const { chartData, totalHomes } = pieData;

  // Map icons to rental status
  const getIcon = (label: string) => {
    if (!label || typeof label !== 'string') {
      return Home;
    }
    switch (label.toLowerCase()) {
      case 'đã cho thuê':
        return HomeCheck;
      case 'chưa cho thuê':
        return Home;
      default:
        return Home;
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-mainTextV1">Phân bố căn hộ theo trạng thái thuê</h3>
        <p className="text-secondaryTextV1">
          Tổng số: <span className="font-semibold text-primary">{totalHomes}</span> căn hộ
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[300px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {chartData.map((item) => {
          const IconComponent = getIcon(item.label);
          return (
            <div key={item.label} className="flex items-center justify-between bg-white p-3 rounded-md border border-lightBorderV1">
              <div className="flex items-center gap-2">
                <IconComponent size={16} style={{ color: item.color }} />
                <span className="text-sm font-medium text-secondaryTextV1">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold block" style={{ color: item.color }}>{item.value}</span>
                <span className="text-xs text-secondaryTextV1">{item.percentage ? item.percentage.toFixed(1) : '0.0'}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
} 
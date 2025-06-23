"use client";

import { useGetRevenueMonthlyChart } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/currencyFormat";

export default function EnhancedRevenueChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const { data, isLoading, error } = useGetRevenueMonthlyChart({ year });

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value));
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[300px] w-full mt-8" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Lỗi khi tải dữ liệu doanh thu: {error.message}
        </div>
      </Card>
    );
  }
  const { chartData, config } = data.data;
  const totalRevenue = chartData.reduce((sum, item) => sum + (item.revenue as number || 0), 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-semibold text-mainTextV1">Doanh thu theo tháng (Enhanced)</h3>
          <p className="text-secondaryTextV1">
            Tổng doanh thu: <span className="font-semibold text-primary">{formatCurrency(totalRevenue)}</span>
          </p>
        </div>
        <select
          className="border border-lightBorderV1 rounded-md px-4 py-2 bg-white text-mainTextV1"
          value={year}
          onChange={handleYearChange}
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[300px] w-full mt-8"
      >
        <ChartContainer config={config} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
              <XAxis 
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: '#687D92' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: '#687D92' }}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value, name) => [
                      formatCurrency(value as number),
                      config[name as string]?.label || name
                    ]}
                  />
                }
              />
              <Bar 
                dataKey="revenue" 
                fill={config.revenue?.color || "#1B61FF"}
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </motion.div>
    </Card>
  );
} 
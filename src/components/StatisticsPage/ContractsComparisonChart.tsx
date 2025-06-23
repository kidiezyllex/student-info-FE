"use client";

import { useGetContractsComparisonChart } from "@/hooks/useStatistics";
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
  Legend,
} from "recharts";
import { useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function ContractsComparisonChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const { data, isLoading, error } = useGetContractsComparisonChart({ year });

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
          Lỗi khi tải dữ liệu so sánh hợp đồng: {error.message}
        </div>
      </Card>
    );
  }

  if (!data?.data?.chartData) {
    return (
      <Card className="p-6">
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Chưa có dữ liệu so sánh hợp đồng cho năm này.
        </div>
      </Card>
    );
  }

  const { chartData, config } = data.data;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-semibold text-mainTextV1">So sánh hợp đồng nhà vs dịch vụ</h3>
          <p className="text-secondaryTextV1">
            Thống kê theo tháng năm {year}
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
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent />
                }
              />
              <Legend />
              <Bar 
                dataKey="homeContracts" 
                fill={config.homeContracts?.color || "#1B61FF"}
                radius={[4, 4, 0, 0]} 
                barSize={20}
                name={config.homeContracts?.label || "Hợp đồng nhà"}
              />
              <Bar 
                dataKey="serviceContracts" 
                fill={config.serviceContracts?.color || "#1B61FF"}
                radius={[4, 4, 0, 0]} 
                barSize={20}
                name={config.serviceContracts?.label || "Hợp đồng dịch vụ"}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </motion.div>
    </Card>
  );
} 
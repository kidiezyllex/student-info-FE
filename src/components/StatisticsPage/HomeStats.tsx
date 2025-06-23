"use client";

import { useGetHomeStatistics } from "@/hooks/useStatistics";
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
import { Home, HomeMinus } from "tabler-icons-react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

export default function HomeStats() {
  const { data, isLoading, error } = useGetHomeStatistics();

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
          Lỗi khi tải dữ liệu về nhà: {error.message}
        </div>
      </Card>
    );
  }

  const homeData = data?.data?.statistics;
  
  if (!homeData) {
    return null;
  }

  const chartData = [
    {
      name: "Đang trống",
      value: homeData.availableHomes,
      color: "#1B61FF",
      icon: Home,
    },
    {
      name: "Đã cho thuê",
      value: homeData.occupiedHomes,
      color: "#1B61FF",
      icon: HomeMinus,
    }
  ];

  const chartConfig: ChartConfig = {
    "Đang trống": {
      label: "Đang trống",
      color: "#1B61FF",
      icon: Home,
    },
    "Đã cho thuê": {
      label: "Đã cho thuê",
      color: "#1B61FF",
      icon: HomeMinus,
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }: any) => {
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
        <h3 className="text-xl font-semibold text-mainTextV1">Tình trạng nhà</h3>
        <p className="text-secondaryTextV1">
          Tổng số: <span className="font-semibold text-primary">{homeData.totalHomes}</span> nhà
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[300px] w-full"
      >
        <ChartContainer config={chartConfig} className="h-full w-full">
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
              <ChartLegend 
                content={
                  <ChartLegendContent 
                    itemType="circle" 
                  />
                } 
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </motion.div>
    </Card>
  );
} 
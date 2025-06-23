"use client";

import { useGetPaymentMethodsPieChart } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { CreditCard, Wallet, Cash } from "tabler-icons-react";

export default function PaymentMethodsPieChart() {
  const { data, isLoading, error } = useGetPaymentMethodsPieChart();

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
          Lỗi khi tải dữ liệu phương thức thanh toán: {error.message}
        </div>
      </Card>
    );
  }

  const pieData = data?.data;
  
  if (!pieData?.chartData) {
    return null;
  }

  const { chartData, config } = pieData;
  const totalCount = chartData.reduce((sum, item) => sum + (item.count as number || 0), 0);

  // Map icons to payment methods
  const getIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'tiền mặt':
        return Cash;
      case 'chuyển khoản':
        return CreditCard;
      case 'ví điện tử':
        return Wallet;
      default:
        return CreditCard;
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
        <h3 className="text-xl font-semibold text-mainTextV1">Phương thức thanh toán</h3>
        <p className="text-secondaryTextV1">
          Tổng số: <span className="font-semibold text-primary">{totalCount}</span> thanh toán
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[300px] w-full"
      >
        <ChartContainer config={config} className="h-full w-full">
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
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {chartData.map((item) => {
          const IconComponent = getIcon(item.method as string);
          return (
            <div key={item.method} className="flex items-center justify-between bg-white p-3 rounded-md border border-lightBorderV1">
              <div className="flex items-center gap-2">
                <IconComponent size={16} style={{ color: item.fill }} />
                <span className="text-sm font-medium text-secondaryTextV1">{item.method}</span>
              </div>
              <span className="font-semibold" style={{ color: item.fill }}>{item.count}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
} 
"use client";

import { useGetPaymentStatistics } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function PaymentStats() {
  const { data, isLoading, error } = useGetPaymentStatistics();
  
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
          Lỗi khi tải dữ liệu về thanh toán: {error.message}
        </div>
      </Card>
    );
  }

  // Handle the actual data structure from API - extract from nested data property
  const apiResponse = data as any;
  const paymentData = apiResponse?.data || apiResponse;
  
  if (!paymentData) {
    return (
      <Card className="p-6">
        <div className="text-gray-500 p-4">
          Không có dữ liệu thanh toán
        </div>
      </Card>
    );
  }

  const chartData = [
    {
      name: "Đúng hạn",
      value: paymentData.onTimePayments || 0,
      color: "#5CC184",
      fill: "#5CC184"
    },
    {
      name: "Trễ hạn",
      value: paymentData.latePayments || 0,
      color: "#F0934E",
      fill: "#F0934E"
    }
  ];

  const chartConfig: ChartConfig = {
    "Đúng hạn": {
      label: "Đúng hạn",
      color: "#5CC184",
    },
    "Trễ hạn": {
      label: "Trễ hạn",
      color: "#F0934E",
    }
  };

  const totalPayments = paymentData.totalPayments || 0;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-mainTextV1">Thống kê thanh toán</h3>
        <p className="text-secondaryTextV1">
          Tổng số: <span className="font-semibold text-primary">{totalPayments}</span> thanh toán
        </p>
      </div>

      {totalPayments > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-[300px] w-full"
          >
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E5E5" />
                  <XAxis 
                    type="number" 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    tick={{ fill: '#687D92' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    tick={{ fill: '#687D92' }}
                    width={120}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(label) => `${label}`}
                      />
                    }
                  />
                  <Bar 
                    dataKey="value" 
                    barSize={40} 
                    radius={[0, 4, 4, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between bg-white p-3 rounded-md border border-lightBorderV1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-secondaryTextV1">{item.name}</span>
                </div>
                <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondaryTextV1">Tỷ lệ đúng hạn: </span>
                <span className="font-semibold text-green-600">{paymentData.onTimePercentage || 0}%</span>
              </div>
              <div>
                <span className="text-secondaryTextV1">Tỷ lệ trễ hạn: </span>
                <span className="font-semibold text-orange-600">{paymentData.latePercentage || 0}%</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">Chưa có dữ liệu thanh toán</p>
            <p className="text-sm">Biểu đồ sẽ hiển thị khi có dữ liệu</p>
          </div>
        </div>
      )}
    </Card>
  );
} 
"use client";

import { useGetPaymentsMonthlyChart } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import { useState } from "react";
import { formatCurrency } from "@/utils/currencyFormat";

export default function PaymentsMonthlyChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const { data, isLoading, error } = useGetPaymentsMonthlyChart({ year });

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
          Lỗi khi tải dữ liệu thanh toán theo tháng: {error.message}
        </div>
      </Card>
    );
  }

  if (!data?.data?.chartData) {
    return (
      <Card className="p-6">
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Chưa có dữ liệu thanh toán cho năm này.
        </div>
      </Card>
    );
  }

  const { chartData, summary } = data.data;

  // Handle case where summary might be undefined
  if (!summary) {
    return (
      <Card className="p-6">
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Dữ liệu tổng kết không khả dụng.
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-lightBorderV1 rounded-lg shadow-lg">
          <p className="font-semibold text-mainTextV1 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600">Tổng thanh toán:</span> {data.totalPayments}
            </p>
            <p className="text-sm">
              <span className="text-green-600">Đã thanh toán:</span> {data.paidPayments}
            </p>
            <p className="text-sm">
              <span className="text-red-600">Chưa thanh toán:</span> {data.unpaidPayments}
            </p>
            <p className="text-sm">
              <span className="text-purple-600">Tổng tiền:</span> {formatCurrency(data.totalAmount)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-semibold text-mainTextV1">Thống kê thanh toán theo tháng</h3>
          <p className="text-secondaryTextV1">
            Biểu đồ đường thể hiện các đợt thanh toán năm {year}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Tổng thanh toán</p>
          <p className="text-lg font-bold text-blue-700">{summary.totalPaymentsYear}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Đã thanh toán</p>
          <p className="text-lg font-bold text-green-700">{summary.totalPaidYear}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Chưa thanh toán</p>
          <p className="text-lg font-bold text-red-700">{summary.totalUnpaidYear}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Tổng tiền</p>
          <p className="text-lg font-bold text-purple-700">{formatCurrency(summary.totalAmountYear)}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[400px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis 
              dataKey="monthName"
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone"
              dataKey="totalPayments" 
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              name="Tổng thanh toán"
            />
            <Line 
              type="monotone"
              dataKey="paidPayments" 
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              name="Đã thanh toán"
            />
            <Line 
              type="monotone"
              dataKey="unpaidPayments" 
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
              name="Chưa thanh toán"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
} 
"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
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
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockDepartmentData = {
  2024: [
    { month: "T1", engineering: 45, business: 32, arts: 28, science: 38 },
    { month: "T2", engineering: 52, business: 38, arts: 31, science: 42 },
    { month: "T3", engineering: 38, business: 28, arts: 22, science: 35 },
    { month: "T4", engineering: 68, business: 48, arts: 42, science: 52 },
    { month: "T5", engineering: 58, business: 42, arts: 38, science: 48 },
    { month: "T6", engineering: 55, business: 40, arts: 35, science: 45 },
    { month: "T7", engineering: 35, business: 25, arts: 20, science: 30 },
    { month: "T8", engineering: 78, business: 55, arts: 48, science: 62 },
    { month: "T9", engineering: 72, business: 52, arts: 45, science: 58 },
    { month: "T10", engineering: 62, business: 45, arts: 38, science: 50 },
    { month: "T11", engineering: 58, business: 42, arts: 35, science: 48 },
    { month: "T12", engineering: 48, business: 35, arts: 30, science: 42 }
  ],
  2023: [
    { month: "T1", engineering: 42, business: 30, arts: 25, science: 35 },
    { month: "T2", engineering: 48, business: 35, arts: 28, science: 38 },
    { month: "T3", engineering: 35, business: 25, arts: 20, science: 32 },
    { month: "T4", engineering: 65, business: 45, arts: 38, science: 48 },
    { month: "T5", engineering: 55, business: 38, arts: 35, science: 45 },
    { month: "T6", engineering: 52, business: 38, arts: 32, science: 42 },
    { month: "T7", engineering: 32, business: 22, arts: 18, science: 28 },
    { month: "T8", engineering: 75, business: 52, arts: 45, science: 58 },
    { month: "T9", engineering: 68, business: 48, arts: 42, science: 55 },
    { month: "T10", engineering: 58, business: 42, arts: 35, science: 48 },
    { month: "T11", engineering: 55, business: 38, arts: 32, science: 45 },
    { month: "T12", engineering: 45, business: 32, arts: 28, science: 38 }
  ]
};
const chartConfig = {
  engineering: {
    label: "Khoa Kỹ thuật",
    color: "#F56C14",
  },
  business: {
    label: "Khoa Kinh tế",
    color: "#5CC184",
  },
  arts: {
    label: "Khoa Nghệ thuật",
    color: "#F0934E",
  },
  science: {
    label: "Khoa Khoa học",
    color: "#E91E63",
  }
} satisfies ChartConfig;

export default function DepartmentComparisonChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

  const handleYearChange = (value: string) => {
    setYear(Number(value));
  };

  const chartData = mockDepartmentData[year as keyof typeof mockDepartmentData] || mockDepartmentData[2024];

  return (
    <Card className="p-4 !shadow-md !bg-orange-50/50 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-mainTextV1">Compare students by department</h3>
          <p className="text-secondaryTextV1 text-sm">
            Statistics by month {year}
          </p>
        </div>
        <Select value={year.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[120px] border-lightBorderV1 text-mainTextV1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 w-full mt-8"
      >
        <ChartContainer config={chartConfig} className="h-full w-full">
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
                dataKey="engineering" 
                fill={chartConfig.engineering?.color || "#F56C14"}
                radius={[4, 4, 0, 0]} 
                barSize={15}
                name={chartConfig.engineering?.label || "Khoa Kỹ thuật"}
              />
              <Bar 
                dataKey="business" 
                fill={chartConfig.business?.color || "#5CC184"}
                radius={[4, 4, 0, 0]} 
                barSize={15}
                name={chartConfig.business?.label || "Khoa Kinh tế"}
              />
              <Bar 
                dataKey="arts" 
                fill={chartConfig.arts?.color || "#F0934E"}
                radius={[4, 4, 0, 0]} 
                barSize={15}
                name={chartConfig.arts?.label || "Khoa Nghệ thuật"}
              />
              <Bar 
                dataKey="science" 
                fill={chartConfig.science?.color || "#E91E63"}
                radius={[4, 4, 0, 0]} 
                barSize={15}
                name={chartConfig.science?.label || "Khoa Khoa học"}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </motion.div>
    </Card>
  );
} 
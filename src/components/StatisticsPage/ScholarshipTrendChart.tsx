"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock data for scholarship applications trend
const mockScholarshipTrendData = {
  2024: [
    { month: "T1", applications: 45 },
    { month: "T2", applications: 52 },
    { month: "T3", applications: 38 },
    { month: "T4", applications: 68 },
    { month: "T5", applications: 58 },
    { month: "T6", applications: 55 },
    { month: "T7", applications: 35 },
    { month: "T8", applications: 78 },
    { month: "T9", applications: 72 },
    { month: "T10", applications: 62 },
    { month: "T11", applications: 58 },
    { month: "T12", applications: 48 }
  ],
  2023: [
    { month: "T1", applications: 42 },
    { month: "T2", applications: 48 },
    { month: "T3", applications: 35 },
    { month: "T4", applications: 65 },
    { month: "T5", applications: 55 },
    { month: "T6", applications: 52 },
    { month: "T7", applications: 32 },
    { month: "T8", applications: 75 },
    { month: "T9", applications: 68 },
    { month: "T10", applications: 58 },
    { month: "T11", applications: 55 },
    { month: "T12", applications: 45 }
  ]
};

const chartConfig = {
  applications: {
    label: "Scholarship Application",
    color: "#F56C14",
  }
} satisfies ChartConfig;

export default function ScholarshipTrendChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value));
  };

  const chartData = mockScholarshipTrendData[year as keyof typeof mockScholarshipTrendData] || mockScholarshipTrendData[2024];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-semibold text-mainTextV1">Scholarship Application Trend</h3>
          <p className="text-secondaryTextV1">
            Line chart showing the trend of scholarship applications in {year}
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
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
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
                      `${value} applications`,
                      name === "applications" ? chartConfig.applications?.label : name
                    ]}
                  />
                }
              />
              <Line 
                type="monotone"
                dataKey="applications" 
                stroke={chartConfig.applications?.color || "#F56C14"}
                strokeWidth={3}
                dot={{ fill: chartConfig.applications?.color || "#F56C14", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: chartConfig.applications?.color || "#F56C14", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </motion.div>
    </Card>
  );
} 
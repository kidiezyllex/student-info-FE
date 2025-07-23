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
} from "recharts";
import { useState } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const mockRegistrationData = {
  2024: [
    { month: "T1", students: 120 },
    { month: "T2", students: 135 },
    { month: "T3", students: 98 },
    { month: "T4", students: 210 },
    { month: "T5", students: 180 },
    { month: "T6", students: 165 },
    { month: "T7", students: 95 },
    { month: "T8", students: 240 },
    { month: "T9", students: 220 },
    { month: "T10", students: 185 },
    { month: "T11", students: 160 },
    { month: "T12", students: 140 }
  ],
  2023: [
    { month: "T1", students: 110 },
    { month: "T2", students: 125 },
    { month: "T3", students: 88 },
    { month: "T4", students: 195 },
    { month: "T5", students: 170 },
    { month: "T6", students: 155 },
    { month: "T7", students: 85 },
    { month: "T8", students: 225 },
    { month: "T9", students: 205 },
    { month: "T10", students: 175 },
    { month: "T11", students: 150 },
    { month: "T12", students: 130 }
  ]
};

const chartConfig = {
  students: {
    label: "Sinh viên",
    color: "#F56C14",
  }
} satisfies ChartConfig;

export default function StudentRegistrationChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(e.target.value));
  };

  const chartData = mockRegistrationData[year as keyof typeof mockRegistrationData] || mockRegistrationData[2024];
  const totalStudents = chartData.reduce((sum, item) => sum + item.students, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-semibold text-mainTextV1">Student Registration by Month</h3>
          <p className="text-secondaryTextV1">
            Total students registered: <span className="font-semibold text-primary">{totalStudents}</span> students
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
                      `${value} sinh viên`,
                      name === "students" ? chartConfig.students?.label : name
                    ]}
                  />
                }
              />
              <Bar 
                dataKey="students" 
                fill={chartConfig.students?.color || "#F56C14"}
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
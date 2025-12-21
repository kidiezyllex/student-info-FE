"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
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

// Mock data for student information system
const mockEventData = {
  completedEvents: 18,
  upcomingEvents: 6,
  totalEvents: 24,
  completedPercentage: 75,
  upcomingPercentage: 25
};

export default function EventStats() {
  const chartData = [
    {
      name: "Completed",
      value: mockEventData.completedEvents,
      color: "#5CC184",
      fill: "#5CC184"
    },
    {
      name: "Upcoming",
      value: mockEventData.upcomingEvents,
      color: "#F56C14",
      fill: "#F56C14"
    }
  ];

  const chartConfig: ChartConfig = {
    "Completed": {
      label: "Completed",
      color: "#5CC184",
    },
    "Upcoming": {
      label: "Upcoming",
      color: "#F56C14",
    }
  };

  const totalEvents = mockEventData.totalEvents;

  return (
    <Card className="p-4 !shadow-md  ">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-mainTextV1">Event Statistics</h3>
        <p className="text-secondaryTextV1 text-sm">
          Total: <span className="font-semibold text-primary">{totalEvents}</span> events
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
              <span className="text-sm font-semibold text-secondaryTextV1">{item.name}</span>
            </div>
            <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-secondaryTextV1">Completed percentage: </span>
            <span className="font-semibold text-green-600">{mockEventData.completedPercentage}%</span>
          </div>
          <div>
            <span className="text-secondaryTextV1">Upcoming percentage: </span>
            <span className="font-semibold text-orange-600">{mockEventData.upcomingPercentage}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
} 
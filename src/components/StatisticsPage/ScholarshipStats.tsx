"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock data for student information system
const mockScholarshipData = {
  activeScholarships: 8,
  expiredScholarships: 7,
  totalScholarships: 15,
  scholarshipsByType: {
    academic: 6,
    need: 5,
    sports: 2,
    talent: 2
  }
};

export default function ScholarshipStats() {
  const scholarshipTypeData = [
    {
      name: "Academic Scholarship",
      value: mockScholarshipData.scholarshipsByType.academic,
      fill: "var(--color-academic)"
    },
    {
      name: "Need-based Scholarship",
      value: mockScholarshipData.scholarshipsByType.need,
      fill: "var(--color-need)"
    },
    {
      name: "Sports Scholarship",
      value: mockScholarshipData.scholarshipsByType.sports,
      fill: "var(--color-sports)"
    },
    {
      name: "Talent Scholarship",
      value: mockScholarshipData.scholarshipsByType.talent,
      fill: "var(--color-talent)"
    }
  ];

  const scholarshipStatusData = [
    {
      name: "Active",
      value: mockScholarshipData.activeScholarships,
      fill: "var(--color-active)"
    },
    {
      name: "Expired",
      value: mockScholarshipData.expiredScholarships,
      fill: "var(--color-expired)"
    }
  ];

  const typeChartConfig = {
    value: {
      label: "Quantity",
    },
    academic: {
      label: "Academic Scholarship",
      color: "#F56C14",
    },
    need: {
      label: "Need-based Scholarship",
      color: "#5CC184",
    },
    sports: {
      label: "Sports Scholarship",
      color: "#F0934E",
    },
    talent: {
      label: "Talent Scholarship",
      color: "#E91E63",
    }
  } satisfies ChartConfig;

  const statusChartConfig = {
    value: {
      label: "Quantity",
    },
    active: {
      label: "Active",
      color: "#5CC184",
    },
    expired: {
      label: "Expired",
      color: "#F0934E",
    }
  } satisfies ChartConfig;

  const totalScholarships = mockScholarshipData.totalScholarships;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-mainTextV1">Scholarship Statistics</h3>
        <p className="text-secondaryTextV1">
          Total: <span className="font-semibold text-primary">{totalScholarships}</span> scholarships
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        {/* Scholarship Types Chart */}
        <Card className="flex flex-col">
          <CardHeader className="flex items-center justify-between">
            Scholarship Type
            <p className="text-secondaryTextV1 text-xs">Distribution by type</p>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={typeChartConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={scholarshipTypeData}
                  dataKey="value"
                  label
                  nameKey="name"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Scholarship Status Chart */}
        <Card className="flex flex-col">
          <CardHeader className="flex items-center justify-between">
            Scholarship Status
            <p className="text-secondaryTextV1 text-xs">Distribution by status</p>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={statusChartConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={scholarshipStatusData}
                  dataKey="value"
                  label
                  nameKey="name"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </Card>
  );
} 
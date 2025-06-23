"use client";

import { useGetContractStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function ContractStats() {
  const { data, isLoading, error } = useGetContractStatistics();

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
          Lỗi khi tải dữ liệu về hợp đồng: {error.message}
        </div>
      </Card>
    );
  }

  // Handle the actual data structure from API - could be direct or nested
  const apiResponse = data as any;
  const contractData = apiResponse?.data || apiResponse;

  if (!contractData) {
    return (
      <Card className="p-6">
        <div className="text-gray-500 p-4">
          Không có dữ liệu hợp đồng
        </div>
      </Card>
    );
  }

  // Biểu đồ loại hợp đồng
  const contractTypeData = [
    {
      name: "Hợp đồng nhà",
      value: contractData.homeContracts || 0,
      fill: "var(--color-home)"
    },
    {
      name: "Hợp đồng dịch vụ",
      value: contractData.serviceContracts || 0,
      fill: "var(--color-service)"
    }
  ];

  // Biểu đồ tình trạng hợp đồng
  const contractStatusData = [
    {
      name: "Đang hoạt động",
      value: (contractData.activeHomeContracts || 0) + (contractData.activeServiceContracts || 0),
      fill: "var(--color-active)"
    },
    {
      name: "Đã hết hạn",
      value: (contractData.totalContracts || 0) - ((contractData.activeHomeContracts || 0) + (contractData.activeServiceContracts || 0)),
      fill: "var(--color-expired)"
    }
  ];

  const typeChartConfig = {
    value: {
      label: "Số lượng",
    },
    home: {
      label: "Hợp đồng nhà",
      color: "#1B61FF",
    },
    service: {
      label: "Hợp đồng dịch vụ",
      color: "#1B61FF",
    }
  } satisfies ChartConfig;

  const statusChartConfig = {
    value: {
      label: "Số lượng",
    },
    active: {
      label: "Đang hoạt động",
      color: "#5CC184",
    },
    expired: {
      label: "Đã hết hạn",
      color: "#F0934E",
    }
  } satisfies ChartConfig;

  const totalContracts = contractData.totalContracts || 0;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-mainTextV1">Thống kê hợp đồng</h3>
        <p className="text-secondaryTextV1">
          Tổng số: <span className="font-semibold text-primary">{totalContracts}</span> hợp đồng
        </p>
      </div>

      {totalContracts > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          {/* Contract Types Chart */}
          <Card className="flex flex-col">
            <CardHeader className="flex items-center justify-between">
              Loại hợp đồng
              <p className="text-secondaryTextV1 text-xs">Phân bố theo loại hợp đồng</p>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={typeChartConfig}
                className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={contractTypeData}
                    dataKey="value"
                    label
                    nameKey="name"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Contract Status Chart */}
          <Card className="flex flex-col">
            <CardHeader className="flex items-center justify-between">
              Tình trạng hợp đồng
              <p className="text-secondaryTextV1 text-xs">Phân bố theo tình trạng</p>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={statusChartConfig}
                className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={contractStatusData}
                    dataKey="value"
                    label
                    nameKey="name"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">Chưa có dữ liệu hợp đồng</p>
            <p className="text-sm">Biểu đồ sẽ hiển thị khi có dữ liệu</p>
          </div>
        </div>
      )}
    </Card>
  );
} 
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useGetServiceContractDetail } from "@/hooks/useServiceContract";
import { ServiceContractDetailInfo } from "@/components/ServiceContractsPage/ServiceContractDetailInfo";

interface ServiceContractDetailsProps {
  contractId: string;
}

export const ServiceContractDetails = ({ contractId }: ServiceContractDetailsProps) => {
  const { data: contractData, isLoading } = useGetServiceContractDetail({ 
    id: contractId 
  });

  const handleEdit = () => {
    // This would open a details/edit dialog in a real implementation
    toast.info("Chức năng chỉnh sửa đang được phát triển");
  };

  const handleDelete = () => {
    // This would open a delete confirmation dialog in a real implementation
    toast.info("Chức năng xóa đang được phát triển");
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-full mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (!contractData?.data) {
    return (
      <Card className="p-6">
        <p className="text-center text-mainTextV1">Không tìm thấy thông tin hợp đồng dịch vụ</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={handleDelete}
          className="text-mainTextV1 hover:text-mainDangerV1"
        >
          <IconTrash className="h-4 w-4" />
          Xóa
        </Button>
        <Button
          variant="default"
          onClick={handleEdit}
          className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
        >
          <IconPencil className="h-4 w-4" />
          Chỉnh sửa
        </Button>
      </div>
      
      <Card className="p-4 bg-[#F9F9FC]">
        <ServiceContractDetailInfo contractData={contractData.data as any} isLoading={isLoading} onRefresh={() => {}} />
      </Card>
    </div>
  );
}; 
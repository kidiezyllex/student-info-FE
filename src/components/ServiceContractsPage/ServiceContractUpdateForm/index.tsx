"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useGetServiceContractDetail, useUpdateServiceContract } from "@/hooks/useServiceContract";
import { IUpdateServiceContractBody } from "@/interface/request/serviceContract";
import { toast } from "react-toastify";
import { IconLoader2, IconArrowLeft } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceContractUpdateFormProps {
  contractId: string;
}

const ServiceContractUpdateForm = ({ contractId }: ServiceContractUpdateFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<IUpdateServiceContractBody>({
    duration: 0,
    price: 0,
    payCycle: 0,
    status: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: contractData, isLoading: isLoadingContract } = useGetServiceContractDetail({
    id: contractId
  });
  
  const { mutate: updateContractMutation, isPending } = useUpdateServiceContract();

  useEffect(() => {
    if (contractData?.data?.contract) {
      const contract = contractData.data.contract;
      setFormData({
        duration: contract.duration,
        price: contract.unitCost || contract.price || 0,
        payCycle: contract.payCycle,
        status: contract.status
      });
    }
  }, [contractData]);

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.duration && formData.duration <= 0) newErrors.duration = "Thời hạn phải lớn hơn 0";
    if (formData.price && formData.price <= 0) newErrors.price = "Giá dịch vụ phải lớn hơn 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateContractMutation({
      params: { id: contractId },
      body: formData
    }, {
      onSuccess: (data) => {
        if (data.statusCode === 200) {
          toast.success("Cập nhật hợp đồng dịch vụ thành công!");
          router.push(`/admin/contracts/service-contracts/${contractId}`);
        } else {
          toast.error("Cập nhật hợp đồng dịch vụ thất bại");
        }
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message}`);
      }
    });
  };

  if (isLoadingContract) {
    return (
      <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-lightBorderV1 pt-6">
              <div className="flex justify-end w-full gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-36" />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const contract = contractData?.data?.contract;
  if (!contract) {
    return (
      <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
        <p className="text-mainDangerV1">Không tìm thấy thông tin hợp đồng dịch vụ</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/contracts">Quản lý hợp đồng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/contracts/service-contracts">Hợp đồng dịch vụ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cập nhật hợp đồng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border border-lightBorderV1 bg-mainBackgroundV1">
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-mainTextV1 hover:text-mainTextHoverV1 p-0 h-auto"
              >
                <IconArrowLeft className="h-5 w-5 mr-1" />
              </Button>
              <h1  >
                Cập nhật hợp đồng dịch vụ
              </h1>
            </div>

            <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700">
                Thông tin hợp đồng: <span className="font-semibold">{contract._id}</span>
                <br />
                {typeof contract.serviceId === 'object' && 'name' in contract.serviceId ? (
                  <>Dịch vụ: <span className="font-semibold">{contract.serviceId.name}</span></>
                ) : (
                  <>Mã dịch vụ: <span className="font-semibold">{contract.serviceId}</span></>
                )}
                <br />
                {typeof contract.homeId === 'object' && 'name' in contract.homeId ? (
                  <>Căn hộ: <span className="font-semibold">{contract.homeId.name}</span></>
                ) : (
                  <>Mã căn hộ: <span className="font-semibold">{contract.homeId}</span></>
                )}
              </p>
            </div>

            <form id="service-contract-update-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-secondaryTextV1">
                    Giá dịch vụ <span className="text-mainDangerV1">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleNumberChange("price", e.target.value)}
                    placeholder="Nhập giá dịch vụ"
                    className={`border-lightBorderV1 ${errors.price ? "border-mainDangerV1" : ""}`}
                  />
                  {errors.price && (
                    <p className="text-sm text-mainDangerV1">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-secondaryTextV1">
                    Thời hạn (tháng) <span className="text-mainDangerV1">*</span>
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleNumberChange("duration", e.target.value)}
                    placeholder="Nhập thời hạn"
                    className={`border-lightBorderV1 ${errors.duration ? "border-mainDangerV1" : ""}`}
                  />
                  {errors.duration && (
                    <p className="text-sm text-mainDangerV1">{errors.duration}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payCycle" className="text-secondaryTextV1">
                    Chu kỳ thanh toán
                  </Label>
                  <Select
                    value={formData.payCycle?.toString() || ""}
                    onValueChange={(value) => handleNumberChange("payCycle", value)}
                  >
                    <SelectTrigger className="border-lightBorderV1">
                      <SelectValue placeholder="Chọn chu kỳ thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Hàng tháng</SelectItem>
                      <SelectItem value="3">Hàng quý</SelectItem>
                      <SelectItem value="6">6 tháng</SelectItem>
                      <SelectItem value="12">Hàng năm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-secondaryTextV1">
                    Trạng thái
                  </Label>
                  <Select
                    value={formData.status?.toString() || ""}
                    onValueChange={(value) => handleNumberChange("status", value)}
                  >
                    <SelectTrigger className="border-lightBorderV1">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Đã hủy</SelectItem>
                      <SelectItem value="1">Đang hoạt động</SelectItem>
                      <SelectItem value="2">Đã hết hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 border-t border-lightBorderV1 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="border-lightBorderV1 text-mainTextV1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              form="service-contract-update-form"
              disabled={isPending}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              {isPending ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : "Cập nhật"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ServiceContractUpdateForm; 
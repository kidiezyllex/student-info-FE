"use client";

import { useState } from "react";
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
import { useCreateServiceContract } from "@/hooks/useServiceContract";
import { useGetHomes } from "@/hooks/useHome";
import { useGetGuests } from "@/hooks/useGuest";
import { ICreateServiceContractBody } from "@/interface/request/serviceContract";
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

const ServiceContractCreateForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ICreateServiceContractBody>({
    homeId: "",
    serviceId: "",
    guestId: "",
    homeContractId: "",
    dateStar: "",
    duration: 12,
    price: 0,
    payCycle: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createContractMutation, isPending } = useCreateServiceContract();
  const { data: homesData, isLoading: isLoadingHomes } = useGetHomes();
  const { data: guestsData, isLoading: isLoadingGuests } = useGetGuests();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.homeId) newErrors.homeId = "Vui lòng chọn căn hộ";
    if (!formData.serviceId) newErrors.serviceId = "Vui lòng chọn dịch vụ";
    if (!formData.guestId) newErrors.guestId = "Vui lòng chọn khách hàng";
    if (!formData.homeContractId) newErrors.homeContractId = "Vui lòng nhập mã hợp đồng nhà";
    if (!formData.dateStar) newErrors.dateStar = "Vui lòng chọn ngày bắt đầu";
    if (formData.duration <= 0) newErrors.duration = "Thời hạn phải lớn hơn 0";
    if (formData.price <= 0) newErrors.price = "Giá dịch vụ phải lớn hơn 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    createContractMutation(formData, {
      onSuccess: (data) => {
        if (data.statusCode === 200 || data.statusCode === 201) {
          toast.success("Tạo hợp đồng dịch vụ thành công!");
          router.push("/admin/contracts/service-contracts");
        } else {
          toast.error("Tạo hợp đồng dịch vụ thất bại");
        }
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message}`);
      }
    });
  };

  const isLoading = isLoadingHomes || isLoadingGuests;

  if (isLoading) {
    return (
      <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, index) => (
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

  // Dữ liệu mẫu cho select dịch vụ (thường sẽ lấy từ API)
  const servicesData = [
    { _id: "service-1", name: "Dịch vụ vệ sinh", price: 500000 },
    { _id: "service-2", name: "Dịch vụ bảo vệ", price: 800000 },
    { _id: "service-3", name: "Dịch vụ giặt ủi", price: 300000 },
    { _id: "service-4", name: "Dịch vụ đậu xe", price: 1000000 },
  ];

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
            <BreadcrumbPage>Tạo hợp đồng mới</BreadcrumbPage>
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
                Tạo hợp đồng dịch vụ mới
              </h1>
            </div>

            <form id="service-contract-create-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeId" className="text-secondaryTextV1">
                    Căn hộ <span className="text-mainDangerV1">*</span>
                  </Label>
                  <Select
                    value={formData.homeId}
                    onValueChange={(value) => handleSelectChange("homeId", value)}
                  >
                    <SelectTrigger className={`border-lightBorderV1 ${errors.homeId ? "border-mainDangerV1" : ""}`}>
                      <SelectValue placeholder="Chọn căn hộ" />
                    </SelectTrigger>
                    <SelectContent>
                      {(homesData?.data as any).map((home: any) => (
                        <SelectItem key={home._id} value={home._id}>
                          {home.building} - {home.apartmentNv}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.homeId && (
                    <p className="text-sm text-mainDangerV1">{errors.homeId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestId" className="text-secondaryTextV1">
                    Khách hàng <span className="text-mainDangerV1">*</span>
                  </Label>
                  <Select
                    value={formData.guestId}
                    onValueChange={(value) => handleSelectChange("guestId", value)}
                  >
                    <SelectTrigger className={`border-lightBorderV1 ${errors.guestId ? "border-mainDangerV1" : ""}`}>
                      <SelectValue placeholder="Chọn khách hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      {guestsData?.data.map((guest) => (
                        <SelectItem key={guest._id} value={guest._id}>
                          {guest.fullname} - {guest.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.guestId && (
                    <p className="text-sm text-mainDangerV1">{errors.guestId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceId" className="text-secondaryTextV1">
                    Dịch vụ <span className="text-mainDangerV1">*</span>
                  </Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) => {
                      handleSelectChange("serviceId", value);
                      // Tự động thiết lập giá theo dịch vụ đã chọn
                      const selectedService = servicesData.find(service => service._id === value);
                      if (selectedService) {
                        handleNumberChange("price", selectedService.price.toString());
                      }
                    }}
                  >
                    <SelectTrigger className={`border-lightBorderV1 ${errors.serviceId ? "border-mainDangerV1" : ""}`}>
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicesData.map((service) => (
                        <SelectItem key={service._id} value={service._id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceId && (
                    <p className="text-sm text-mainDangerV1">{errors.serviceId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateStar" className="text-secondaryTextV1">
                    Ngày bắt đầu <span className="text-mainDangerV1">*</span>
                  </Label>
                  <Input
                    id="dateStar"
                    name="dateStar"
                    type="date"
                    value={formData.dateStar}
                    onChange={handleChange}
                    className={`border-lightBorderV1 ${errors.dateStar ? "border-mainDangerV1" : ""}`}
                  />
                  {errors.dateStar && (
                    <p className="text-sm text-mainDangerV1">{errors.dateStar}</p>
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
                    value={formData.duration === 0 ? "" : formData.duration}
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
                    value={formData.payCycle.toString()}
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
                  <Label htmlFor="price" className="text-secondaryTextV1">
                    Giá dịch vụ <span className="text-mainDangerV1">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price === 0 ? "" : formData.price}
                    onChange={(e) => handleNumberChange("price", e.target.value)}
                    placeholder="Nhập giá dịch vụ"
                    className={`border-lightBorderV1 ${errors.price ? "border-mainDangerV1" : ""}`}
                  />
                  {errors.price && (
                    <p className="text-sm text-mainDangerV1">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeContractId" className="text-secondaryTextV1">
                    Mã hợp đồng nhà <span className="text-mainDangerV1">*</span>
                  </Label>
                  <Input
                    id="homeContractId"
                    name="homeContractId"
                    value={formData.homeContractId}
                    onChange={handleChange}
                    placeholder="Nhập mã hợp đồng nhà"
                    className={`border-lightBorderV1 ${errors.homeContractId ? "border-mainDangerV1" : ""}`}
                  />
                  {errors.homeContractId && (
                    <p className="text-sm text-mainDangerV1">{errors.homeContractId}</p>
                  )}
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
              form="service-contract-create-form"
              disabled={isPending}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              {isPending ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : "Tạo hợp đồng"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ServiceContractCreateForm; 
"use client";

import { useEffect, useState } from "react";
import { useGetHomeContractDetail, useDeleteHomeContract, useUpdateHomeContract } from "@/hooks/useHomeContract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IconPencil, IconTrash, IconLoader2, IconAlertTriangle, IconCheck, IconX } from "@tabler/icons-react";
import { HomeContractDetailInfo } from "@/components/HomeContractsPage/HomeContractDetailInfo";
import { IUpdateHomeContractBody } from "@/interface/request/homeContract";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface HomeContractDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  onSuccess?: () => void;
}

export const HomeContractDetailsDialog = ({ 
  isOpen, 
  onClose, 
  contractId,
  onSuccess
}: HomeContractDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IUpdateHomeContractBody>({
    duration: 0,
    price: 0,
    deposit: 0,
    payCycle: 1,
    status: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: contractData, isLoading, error, refetch } = useGetHomeContractDetail({
    id: contractId
  });
  
  const { mutate: updateContractMutation, isPending: isUpdating } = useUpdateHomeContract();
  const { mutate: deleteContractMutation, isPending: isDeleting } = useDeleteHomeContract();
  useEffect(() => {
    if (contractData?.data) {
      const contract = contractData.data;
      setFormData({
        duration: (contract as any).duration,
        price: (contract as any).renta,
        deposit: (contract as any).deposit,
        payCycle: (contract as any).payCycle,
        status: (contract as any).status,
      });
    }
  }, [contractData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'duration' || name === 'price' || name === 'deposit' || name === 'payCycle' || name === 'status' 
        ? Number(value) 
        : value 
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Thời hạn hợp đồng phải lớn hơn 0";
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá thuê phải lớn hơn 0";
    }
    
    if (formData.deposit === undefined || formData.deposit < 0) {
      newErrors.deposit = "Tiền đặt cọc không được âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original values
    if (contractData?.data) {
      const contract = contractData.data;
      setFormData({
        duration: (contract as any).duration,
        price: (contract as any).renta,
        deposit: (contract as any).deposit,
        payCycle: (contract as any).payCycle,
        status: (contract as any).status,
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateContractMutation(
      {
        params: { id: contractId },
        body: formData
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Cập nhật hợp đồng thuê nhà thành công");
            setIsEditing(false);
            refetch();
            onSuccess?.();
          } else {
            toast.error("Cập nhật hợp đồng thuê nhà thất bại");
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteContractMutation(
      { id: contractId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa hợp đồng thuê nhà thành công");
            setIsDeleteDialogOpen(false);
            onSuccess?.();
            onClose();
          } else {
            toast.error("Xóa hợp đồng thuê nhà thất bại");
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              Chi tiết hợp đồng thuê nhà
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const contract = contractData?.data;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Chỉnh sửa hợp đồng thuê nhà" : "Chi tiết hợp đồng thuê nhà"}
            </DialogTitle>
          </DialogHeader>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex w-full items-center justify-end gap-4">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleDelete}
                      >
                        <IconTrash className="h-4 w-4" />
                        Xóa
                      </Button>
                      <Button
                        onClick={handleEdit}
                      >
                        <IconPencil className="h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        <IconX className="h-4 w-4" />
                        Hủy
                      </Button>
                      <Button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                      >
                        {isUpdating ? (
                          <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <IconCheck className="h-4 w-4" />
                        )}
                        Cập nhật
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Card className="  border border-lightBorderV1 bg-[#F9F9FC]">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-secondaryTextV1">
                          Thời hạn (tháng) <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="Nhập thời hạn hợp đồng"
                          className={`border-lightBorderV1 ${errors.duration ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.duration && (
                          <p className="text-sm text-mainDangerV1">{errors.duration}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-secondaryTextV1">
                          Giá thuê (VND) <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="Nhập giá thuê"
                          className={`border-lightBorderV1 ${errors.price ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.price && (
                          <p className="text-sm text-mainDangerV1">{errors.price}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deposit" className="text-secondaryTextV1">
                          Tiền đặt cọc (VND) <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="deposit"
                          name="deposit"
                          type="number"
                          value={formData.deposit}
                          onChange={handleChange}
                          placeholder="Nhập tiền đặt cọc"
                          className={`border-lightBorderV1 ${errors.deposit ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.deposit && (
                          <p className="text-sm text-mainDangerV1">{errors.deposit}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-secondaryTextV1">Chu kỳ thanh toán</Label>
                        <Select
                          value={formData.payCycle?.toString()}
                          onValueChange={(value) => handleSelectChange("payCycle", value)}
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
                        <Label className="text-secondaryTextV1">Trạng thái</Label>
                        <Select
                          value={formData.status?.toString()}
                          onValueChange={(value) => handleSelectChange("status", value)}
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
                ) : (
                  contract && (
                    <div className="p-4 bg-[#F9F9FC]">
                      <HomeContractDetailInfo contractData={contract} isLoading={isLoading} onRefresh={refetch} />
                    </div>
                  )
                )}
              </Card>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              Xác nhận xóa hợp đồng
            </DialogTitle>
            <DialogDescription className="text-secondaryTextV1 pt-2">
              Bạn có chắc chắn muốn xóa hợp đồng thuê nhà này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 p-4 my-4 rounded-sm border border-red-200">
            <p className="text-mainTextV1 text-sm">
              Khi xóa hợp đồng, tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
            </p>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeleting} className="text-secondaryTextV1">
                Hủy
              </Button>
            </DialogClose>

            <Button
              type="button"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <IconTrash className="mr-2 h-4 w-4" />
                  Xóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}; 
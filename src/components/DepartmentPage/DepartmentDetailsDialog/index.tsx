"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetDepartmentById, useUpdateDepartment } from "@/hooks/useDepartment";
import { IUpdateDepartmentBody } from "@/interface/request/department";
import { toast } from "react-toastify";
import { IconLoader2, IconBuilding, IconEdit } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DepartmentDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  onSuccess?: () => void;
}

export const DepartmentDetailsDialog = ({ isOpen, onClose, departmentId, onSuccess }: DepartmentDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateDepartmentBody>({
    name: "",
    code: "",
    description: "",
    coordinatorId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: departmentData, isLoading: isLoadingDepartment } = useGetDepartmentById(departmentId);
  const { mutate: updateDepartmentMutation, isPending: isUpdating } = useUpdateDepartment();

  useEffect(() => {
    if (departmentData?.data) {
      setFormData({
        name: departmentData.data.name,
        code: departmentData.data.code,
        description: departmentData.data.description,
        coordinatorId: departmentData.data.coordinatorId,
      });
    }
  }, [departmentData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Tên khoa là bắt buộc";
    }

    if (!formData.code?.trim()) {
      newErrors.code = "Mã khoa là bắt buộc";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (!formData.coordinatorId?.trim()) {
      newErrors.coordinatorId = "ID Quản trị ngành là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    updateDepartmentMutation(
      { id: departmentId, data: formData },
      {
        onSuccess: (response) => {
          toast.success("Cập nhật khoa thành công!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật khoa!");
        },
      }
    );
  };

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original values
    if (departmentData?.data) {
      setFormData({
        name: departmentData.data.name,
        code: departmentData.data.code,
        description: departmentData.data.description,
        coordinatorId: departmentData.data.coordinatorId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">
            {isEditing ? "Chỉnh sửa khoa" : "Chi tiết khoa"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingDepartment ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-mainTextV1">
                Tên khoa {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên khoa"
                disabled={!isEditing}
                className={`${errors.name ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-mainTextV1">
                Mã khoa {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Nhập mã khoa"
                disabled={!isEditing}
                className={`${errors.code ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-mainTextV1">
                Mô tả {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả về khoa"
                rows={3}
                disabled={!isEditing}
                className={`${errors.description ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinatorId" className="text-mainTextV1">
                ID Quản trị ngành {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="coordinatorId"
                name="coordinatorId"
                value={formData.coordinatorId}
                onChange={handleChange}
                placeholder="Nhập ID Quản trị ngành"
                disabled={!isEditing}
                className={`${errors.coordinatorId ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.coordinatorId && (
                <p className="text-red-500 text-sm">{errors.coordinatorId}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              {!isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Đóng
                  </Button>
                  <Button
                    type="button"
                    onClick={handleEdit}
                    className="flex-1 bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                  >
                    <IconEdit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                  >
                    {isUpdating ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      "Cập nhật"
                    )}
                  </Button>
                </>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}; 
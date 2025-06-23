"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDepartment } from "@/hooks/useDepartment";
import { ICreateDepartmentBody } from "@/interface/request/department";
import { toast } from "react-toastify";
import { IconLoader2, IconBuilding } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DepartmentCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DepartmentCreateDialog = ({ isOpen, onClose, onSuccess }: DepartmentCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateDepartmentBody>({
    name: "",
    code: "",
    description: "",
    coordinatorId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createDepartmentMutation, isPending } = useCreateDepartment();

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

    if (!formData.name.trim()) {
      newErrors.name = "Tên khoa là bắt buộc";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Mã khoa là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (!formData.coordinatorId.trim()) {
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

    createDepartmentMutation(formData, {
      onSuccess: (response) => {
        toast.success("Tạo khoa thành công!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo khoa!");
      },
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      coordinatorId: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">Thêm khoa mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-mainTextV1">
              Tên khoa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên khoa"
              className={`${errors.name ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="text-mainTextV1">
              Mã khoa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Nhập mã khoa (VD: IT, CS, EE)"
              className={`${errors.code ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-mainTextV1">
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả về khoa"
              rows={3}
              className={`${errors.description ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinatorId" className="text-mainTextV1">
              ID Quản trị ngành <span className="text-red-500">*</span>
            </Label>
            <Input
              id="coordinatorId"
              name="coordinatorId"
              value={formData.coordinatorId}
              onChange={handleChange}
              placeholder="Nhập ID Quản trị ngành"
              className={`${errors.coordinatorId ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
            />
            {errors.coordinatorId && (
              <p className="text-red-500 text-sm">{errors.coordinatorId}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              {isPending ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo khoa"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 
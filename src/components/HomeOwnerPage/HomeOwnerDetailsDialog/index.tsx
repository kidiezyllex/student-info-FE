"use client";

import { useEffect, useState } from "react";
import { useGetHomeOwnerDetail, useUpdateHomeOwner, useDeleteHomeOwner } from "@/hooks/useHomeOwner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HomeOwnerDetailInfo } from "@/components/HomeOwnerPage/HomeOwnerDetailInfo";
import { IUpdateHomeOwnerBody } from "@/interface/request/homeOwner";
import { IHomeOwnerDetailResponse } from "@/interface/response/homeOwner";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IconPencil, IconTrash, IconLoader2, IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface HomeOwnerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  onSuccess?: () => void;
}

export const HomeOwnerDetailsDialog = ({ isOpen, onClose, ownerId, onSuccess }: HomeOwnerDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IUpdateHomeOwnerBody>({
    fullname: "",
    phone: "",
    email: "",
    citizenId: "",
    citizen_date: "",
    citizen_place: "",
    birthday: "",
    bankAccount: "",
    bankName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Date input states for display (dd/MM/yyyy format)
  const [citizenDateInput, setCitizenDateInput] = useState("");
  const [birthdayInput, setBirthdayInput] = useState("");

  // Date format validation function
  const isValidDateFormat = (dateString: string): boolean => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(dateString)) return false;
    
    const [, day, month, year] = dateString.match(dateRegex)!;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return (
      date.getDate() === parseInt(day) &&
      date.getMonth() === parseInt(month) - 1 &&
      date.getFullYear() === parseInt(year)
    );
  };

  // Convert dd/MM/yyyy to ISO string
  const convertToISOString = (dateString: string): string => {
    if (!dateString || !isValidDateFormat(dateString)) return "";
    
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toISOString();
  };

  // Convert ISO string to dd/MM/yyyy
  const convertFromISOString = (isoString: string): string => {
    if (!isoString) return "";
    
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    return `${day}/${month}/${year}`;
  };

  const { data: ownerData, isLoading, error, refetch } = useGetHomeOwnerDetail({ 
    id: ownerId 
  });
  const { mutate: updateOwnerMutation, isPending: isUpdating } = useUpdateHomeOwner();
  const { mutate: deleteOwnerMutation, isPending: isDeleting } = useDeleteHomeOwner();
  useEffect(() => {
    if (ownerData?.data?.owner) {
      const owner = ownerData.data.owner;
      setFormData({
        fullname: owner.fullname || "",
        phone: owner.phone || "",
        email: owner.email || "",
        citizenId: owner.citizenId || "",
        citizen_date: owner.citizen_date || "",
        citizen_place: owner.citizen_place || "",
        birthday: owner.birthday || "",
        bankAccount: owner.bankAccount || "",
        bankName: owner.bankName || "",
      });

      // Set date input values
      setCitizenDateInput(owner.citizen_date ? convertFromISOString(owner.citizen_date) : "");
      setBirthdayInput(owner.birthday ? convertFromISOString(owner.birthday) : "");
    }
  }, [ownerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateInputChange = (field: 'citizen_date' | 'birthday', value: string) => {
    // Update display value
    if (field === 'citizen_date') {
      setCitizenDateInput(value);
    } else {
      setBirthdayInput(value);
    }

    // Clear previous error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Validate and convert to ISO if valid
    if (value.trim() === "") {
      // Empty value is allowed
      setFormData((prev) => ({ ...prev, [field]: "" }));
    } else if (isValidDateFormat(value)) {
      // Valid format, convert to ISO
      const isoString = convertToISOString(value);
      setFormData((prev) => ({ ...prev, [field]: isoString }));
    } else if (value.length === 10) {
      // Full length but invalid format, show error
      setErrors((prev) => ({ 
        ...prev, 
        [field]: "Định dạng ngày không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy" 
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phone?.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
      toast.error("Vui lòng nhập số điện thoại");
    }
    if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      toast.error("Số điện thoại không đúng định dạng");
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      toast.error("Email không đúng định dạng");
    }

    // Validate date formats
    if (citizenDateInput && !isValidDateFormat(citizenDateInput)) {
      newErrors.citizen_date = "Định dạng ngày cấp không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy";
      toast.error("Định dạng ngày cấp không hợp lệ");
    }
    if (birthdayInput && !isValidDateFormat(birthdayInput)) {
      newErrors.birthday = "Định dạng ngày sinh không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy";
      toast.error("Định dạng ngày sinh không hợp lệ");
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
    if (ownerData?.data?.owner) {
      const owner = ownerData.data.owner;
      setFormData({
        fullname: owner.fullname || "",
        phone: owner.phone || "",
        email: owner.email || "",
        citizenId: owner.citizenId || "",
        citizen_date: owner.citizen_date || "",
        citizen_place: owner.citizen_place || "",
        birthday: owner.birthday || "",
        bankAccount: owner.bankAccount || "",
        bankName: owner.bankName || "",
      });

      // Reset date input values
      setCitizenDateInput(owner.citizen_date ? convertFromISOString(owner.citizen_date) : "");
      setBirthdayInput(owner.birthday ? convertFromISOString(owner.birthday) : "");
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateOwnerMutation(
      {
        params: { id: ownerId },
        body: formData
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Cập nhật thông tin chủ nhà thành công");
            setIsEditing(false);
            refetch();
            onSuccess?.();
          } else {
            toast.error("Cập nhật thông tin chủ nhà thất bại");
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
    deleteOwnerMutation(
      { id: ownerId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa chủ nhà thành công");
            setIsDeleteDialogOpen(false);
            onSuccess?.();
            onClose();
          } else {
            toast.error("Xóa chủ nhà thất bại");
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
    setCitizenDateInput("");
    setBirthdayInput("");
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Thông tin chủ nhà</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Thông tin chủ nhà</DialogTitle>
            <div className="flex flex-row items-center justify-between gap-4">
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
                        variant="default"
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
          </DialogHeader>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizenId">Số CMND/CCCD</Label>
                  <Input
                    id="citizenId"
                    name="citizenId"
                    value={formData.citizenId}
                    onChange={handleChange}
                    placeholder="Nhập số CMND/CCCD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizen_date">Ngày cấp</Label>
                  <Input
                    id="citizen_date"
                    value={citizenDateInput}
                    onChange={(e) => handleDateInputChange('citizen_date', e.target.value)}
                    placeholder="dd/MM/yyyy"
                    className={`${errors.citizen_date ? "border-red-500" : ""}`}
                    maxLength={10}
                  />
                  {errors.citizen_date && (
                    <p className="text-sm text-red-500">{errors.citizen_date}</p>
                  )}
                  <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/03/2020)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizen_place">Nơi cấp</Label>
                  <Input
                    id="citizen_place"
                    name="citizen_place"
                    value={formData.citizen_place}
                    onChange={handleChange}
                    placeholder="Nhập nơi cấp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday">Ngày sinh</Label>
                  <Input
                    id="birthday"
                    value={birthdayInput}
                    onChange={(e) => handleDateInputChange('birthday', e.target.value)}
                    placeholder="dd/MM/yyyy"
                    className={`${errors.birthday ? "border-red-500" : ""}`}
                    maxLength={10}
                  />
                  {errors.birthday && (
                    <p className="text-sm text-red-500">{errors.birthday}</p>
                  )}
                  <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/03/1990)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Số tài khoản</Label>
                  <Input
                    id="bankAccount"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    placeholder="Nhập số tài khoản"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Tên ngân hàng</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Nhập tên ngân hàng"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <IconCheck className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <>
              {ownerData?.data && (
                <HomeOwnerDetailInfo homeOwner={ownerData.data} />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chủ nhà này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
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
"use client";

import { useEffect, useState } from "react";
import { useGetServiceContractDetail, useDeleteServiceContract } from "@/hooks/useServiceContract";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceContractDetailInfo } from "@/components/ServiceContractsPage/ServiceContractDetailInfo";
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

interface ServiceContractDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  onSuccess?: () => void;
}

// Simple interface for the form data
interface ServiceContractFormData {
  serviceId?: string;
  guestId?: string;
  dateStar?: string;
  dateEnd?: string;
  price?: number;
  status?: number;
  note?: string;
}

export const ServiceContractDetailsDialog = ({ isOpen, onClose, contractId, onSuccess }: ServiceContractDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceContractFormData>({
    serviceId: "",
    guestId: "",
    dateStar: "",
    dateEnd: "",
    price: 0,
    status: 1,
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Date input states for display (dd/MM/yyyy format)
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");

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

  const { data: contractData, isLoading, error, refetch } = useGetServiceContractDetail({ 
    id: contractId 
  });
  
  const isUpdating = false;
  const { mutate: deleteContractMutation, isPending: isDeleting } = useDeleteServiceContract();

  useEffect(() => {
    if (contractData?.data?.contract) {
      const contract = contractData.data.contract;
      // Update this mapping according to your actual service contract structure
      setFormData({
        serviceId: typeof contract.serviceId === 'object' ? contract.serviceId._id : contract.serviceId,
        guestId: typeof contract.guestId === 'object' ? contract.guestId._id : contract.guestId,
        dateStar: contract.dateStar,
        dateEnd: contract.dateEnd,
        price: contract.price,
        status: contract.status,
      });

      // Set date input values
      setStartDateInput(contract.dateStar ? convertFromISOString(contract.dateStar) : "");
      setEndDateInput(contract.dateEnd ? convertFromISOString(contract.dateEnd) : "");
    }
  }, [contractData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: name === 'status' ? parseInt(value) : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateInputChange = (field: 'dateStar' | 'dateEnd', value: string) => {
    // Update display value
    if (field === 'dateStar') {
      setStartDateInput(value);
    } else {
      setEndDateInput(value);
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
    
    if (!formData.serviceId) {
      newErrors.serviceId = "Dịch vụ không được để trống";
      toast.error("Vui lòng chọn dịch vụ");
    }
    if (!formData.guestId) {
      newErrors.guestId = "Khách hàng không được để trống";
      toast.error("Vui lòng chọn khách hàng");
    }
    if (!formData.dateStar) {
      newErrors.dateStar = "Ngày bắt đầu không được để trống";
      toast.error("Vui lòng nhập ngày bắt đầu");
    }
    if (!formData.dateEnd) {
      newErrors.dateEnd = "Ngày kết thúc không được để trống";
      toast.error("Vui lòng nhập ngày kết thúc");
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá dịch vụ phải lớn hơn 0";
      toast.error("Giá dịch vụ phải lớn hơn 0");
    }

    // Validate date formats
    if (startDateInput && !isValidDateFormat(startDateInput)) {
      newErrors.dateStar = "Định dạng ngày bắt đầu không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy";
      toast.error("Định dạng ngày bắt đầu không hợp lệ");
    }
    if (endDateInput && !isValidDateFormat(endDateInput)) {
      newErrors.dateEnd = "Định dạng ngày kết thúc không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy";
      toast.error("Định dạng ngày kết thúc không hợp lệ");
    }

    // Validate date range
    if (formData.dateStar && formData.dateEnd) {
      const startDate = new Date(formData.dateStar);
      const endDate = new Date(formData.dateEnd);
      if (endDate <= startDate) {
        newErrors.dateEnd = "Ngày kết thúc phải sau ngày bắt đầu";
        toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      }
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
    if (contractData?.data?.contract) {
      const contract = contractData.data.contract;
      setFormData({
        serviceId: typeof contract.serviceId === 'object' ? contract.serviceId._id : contract.serviceId,
        guestId: typeof contract.guestId === 'object' ? contract.guestId._id : contract.guestId,
        dateStar: contract.dateStar,
        dateEnd: contract.dateEnd,
        price: contract.price,
        status: contract.status,
      });

      // Reset date input values
      setStartDateInput(contract.dateStar ? convertFromISOString(contract.dateStar) : "");
      setEndDateInput(contract.dateEnd ? convertFromISOString(contract.dateEnd) : "");
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    // For now, just show a message
    toast.info("Chức năng cập nhật đang được phát triển");
    setIsEditing(false);
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
            toast.success("Xóa hợp đồng dịch vụ thành công");
            setIsDeleteDialogOpen(false);
            onSuccess?.();
            onClose();
          } else {
            toast.error("Xóa hợp đồng dịch vụ thất bại");
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
    setStartDateInput("");
    setEndDateInput("");
    onClose();
  };

  // Get service and guest names for display
  const getServiceName = () => {
    if (!contractData?.data?.contract) return "";
    const contract = contractData.data.contract;
    return typeof contract.serviceId === 'object' ? contract.serviceId.name : "Unknown Service";
  };

  const getGuestName = () => {
    if (!contractData?.data?.contract) return "";
    const contract = contractData.data.contract;
    return typeof contract.guestId === 'object' ? contract.guestId.fullname : "Unknown Guest";
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Thông tin hợp đồng dịch vụ</DialogTitle>
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
            <DialogTitle>Thông tin hợp đồng dịch vụ</DialogTitle>
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
                  <Label htmlFor="serviceId">Dịch vụ</Label>
                  <Input
                    id="serviceId"
                    value={getServiceName()}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestId">Khách hàng</Label>
                  <Input
                    id="guestId"
                    value={getGuestName()}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                                 <div className="space-y-2">
                   <Label htmlFor="dateStar">Ngày bắt đầu</Label>
                   <Input
                     id="dateStar"
                     value={startDateInput}
                     onChange={(e) => handleDateInputChange('dateStar', e.target.value)}
                     placeholder="dd/MM/yyyy"
                     className={`${errors.dateStar ? "border-red-500" : ""}`}
                     maxLength={10}
                   />
                   {errors.dateStar && (
                     <p className="text-sm text-red-500">{errors.dateStar}</p>
                   )}
                   <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/03/2024)</p>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="dateEnd">Ngày kết thúc</Label>
                   <Input
                     id="dateEnd"
                     value={endDateInput}
                     onChange={(e) => handleDateInputChange('dateEnd', e.target.value)}
                     placeholder="dd/MM/yyyy"
                     className={`${errors.dateEnd ? "border-red-500" : ""}`}
                     maxLength={10}
                   />
                   {errors.dateEnd && (
                     <p className="text-sm text-red-500">{errors.dateEnd}</p>
                   )}
                   <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 30/03/2024)</p>
                 </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá dịch vụ</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Nhập giá dịch vụ"
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={formData.status?.toString()}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Đang thực hiện</SelectItem>
                      <SelectItem value="2">Hoàn thành</SelectItem>
                      <SelectItem value="3">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Nhập ghi chú"
                  rows={3}
                />
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
               {contractData?.data && (
                 <ServiceContractDetailInfo contractData={contractData.data} isLoading={false} />
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
              Bạn có chắc chắn muốn xóa hợp đồng dịch vụ này? Hành động này không thể hoàn tác.
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
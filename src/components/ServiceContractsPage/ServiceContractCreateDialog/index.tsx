"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { IconLoader2 } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServiceContractCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Interface for the create service contract form
interface ServiceContractFormData {
  serviceId?: string;
  guestId?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  status?: number;
  note?: string;
}

export const ServiceContractCreateDialog = ({ isOpen, onClose, onSuccess }: ServiceContractCreateDialogProps) => {
  const [formData, setFormData] = useState<ServiceContractFormData>({
    serviceId: "",
    guestId: "",
    startDate: "",
    endDate: "",
    price: 0,
    status: 1,
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Date input states for display (dd/MM/yyyy format)
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  
  // Placeholder for the actual mutation hook
  const isPending = false;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "price" ? parseFloat(value) || 0 : value 
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateInputChange = (field: 'startDate' | 'endDate', value: string) => {
    // Update display value
    if (field === 'startDate') {
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: name === "status" ? parseInt(value) : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống";
      toast.error("Vui lòng nhập ngày bắt đầu");
    }
    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống";
      toast.error("Vui lòng nhập ngày kết thúc");
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá dịch vụ phải lớn hơn 0";
      toast.error("Giá dịch vụ phải lớn hơn 0");
    }

    // Validate date formats
    if (startDateInput && !isValidDateFormat(startDateInput)) {
      newErrors.startDate = "Định dạng ngày bắt đầu không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy";
      toast.error("Định dạng ngày bắt đầu không hợp lệ");
    }
    if (endDateInput && !isValidDateFormat(endDateInput)) {
      newErrors.endDate = "Định dạng ngày kết thúc không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy";
      toast.error("Định dạng ngày kết thúc không hợp lệ");
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
        toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // This would be replaced with the actual mutation call
    toast.info("Chức năng tạo hợp đồng dịch vụ đang được phát triển");
    
    // Simulation of success
    setFormData({
      serviceId: "",
      guestId: "",
      startDate: "",
      endDate: "",
      price: 0,
      status: 1,
      note: "",
    });
    setErrors({});
    setStartDateInput("");
    setEndDateInput("");
    onSuccess?.();
    onClose();
  };

  const handleClose = () => {
    setFormData({
      serviceId: "",
      guestId: "",
      startDate: "",
      endDate: "",
      price: 0,
      status: 1,
      note: "",
    });
    setErrors({});
    setStartDateInput("");
    setEndDateInput("");
    onClose();
  };

  // These would be replaced with actual data fetched from the API
  const services = [
    { id: "1", name: "Dịch vụ vệ sinh" },
    { id: "2", name: "Dịch vụ bảo vệ" },
    { id: "3", name: "Dịch vụ giặt là" },
  ];

  const guests = [
    { id: "1", name: "Nguyễn Văn A" },
    { id: "2", name: "Trần Thị B" },
    { id: "3", name: "Lê Văn C" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle  >
            Tạo hợp đồng dịch vụ mới
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-lightBorderV1 bg-mainBackgroundV1">
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceId" className="text-secondaryTextV1">
                      Dịch vụ <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Select
                      value={formData.serviceId}
                      onValueChange={(value) => handleSelectChange("serviceId", value)}
                    >
                      <SelectTrigger className={`border-lightBorderV1 ${errors.serviceId ? "border-mainDangerV1" : ""}`}>
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id}>
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
                        {guests.map(guest => (
                          <SelectItem key={guest.id} value={guest.id}>
                            {guest.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.guestId && (
                      <p className="text-sm text-mainDangerV1">{errors.guestId}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-secondaryTextV1">
                      Ngày bắt đầu <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      value={startDateInput}
                      onChange={(e) => handleDateInputChange('startDate', e.target.value)}
                      placeholder="dd/MM/yyyy"
                      className={`border-lightBorderV1 ${errors.startDate ? "border-mainDangerV1" : ""}`}
                      maxLength={10}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-mainDangerV1">{errors.startDate}</p>
                    )}
                    <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/03/2024)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-secondaryTextV1">
                      Ngày kết thúc <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      value={endDateInput}
                      onChange={(e) => handleDateInputChange('endDate', e.target.value)}
                      placeholder="dd/MM/yyyy"
                      className={`border-lightBorderV1 ${errors.endDate ? "border-mainDangerV1" : ""}`}
                      maxLength={10}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-mainDangerV1">{errors.endDate}</p>
                    )}
                    <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/12/2024)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-secondaryTextV1">
                      Giá dịch vụ <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Nhập giá dịch vụ"
                      className={`border-lightBorderV1 ${errors.price ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.price && (
                      <p className="text-sm text-mainDangerV1">{errors.price}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-secondaryTextV1">
                      Trạng thái
                    </Label>
                    <Select
                      value={String(formData.status)}
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

                <div className="space-y-2">
                  <Label htmlFor="note" className="text-secondaryTextV1">
                    Ghi chú
                  </Label>
                  <Textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Nhập ghi chú"
                    className="border-lightBorderV1 min-h-[80px]"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t border-lightBorderV1 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                {isPending ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : 'Tạo hợp đồng'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}; 
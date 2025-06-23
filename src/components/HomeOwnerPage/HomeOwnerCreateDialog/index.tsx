"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateHomeOwner } from "@/hooks/useHomeOwner";
import { useUploadFile } from "@/hooks/useUpload";
import { ICreateHomeOwnerBody } from "@/interface/request/homeOwner";
import { IUploadResponse } from "@/interface/response/upload";
import { toast } from "react-toastify";
import { IconLoader2, IconUpload, IconX } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface HomeOwnerCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const HomeOwnerCreateDialog = ({ isOpen, onClose, onSuccess }: HomeOwnerCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateHomeOwnerBody>({
    fullname: "",
    phone: "",
    email: "",
    citizenId: "",
    citizen_date: "",
    citizen_place: "",
    birthday: "",
    hometown: "",
    note: "",
    gender: undefined,
    avatarUrl: "",
    address: "",
    bankAccount: "",
    bankName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Date input states for display (dd/MM/yyyy format)
  const [citizenDateInput, setCitizenDateInput] = useState("");
  const [birthdayInput, setBirthdayInput] = useState("");

  // Avatar upload state
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const { mutate: createHomeOwnerMutation, isPending } = useCreateHomeOwner();
  const { mutate: uploadFileMutation } = useUploadFile();

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

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value === "male" }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const isValidType = file.type.startsWith('image/');
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
    
    if (!isValidType) {
      toast.error(`File ${file.name} không phải là hình ảnh hợp lệ`);
      return;
    }
    if (!isValidSize) {
      toast.error(`File ${file.name} quá lớn (tối đa 10MB)`);
      return;
    }

    setIsUploadingAvatar(true);

    uploadFileMutation({ file }, {
      onSuccess: (response: IUploadResponse) => {
        if (response?.statusCode === 200 || response?.statusCode === 201) {
          const imageUrl = response?.data?.url;
          
          if (imageUrl) {
            setFormData(prev => ({ ...prev, avatarUrl: imageUrl }));
            toast.success(`Upload ảnh "${file.name}" thành công!`);
          } else {
            console.error('No URL in response:', response);
            toast.error(`Lỗi: Không nhận được URL ảnh từ server cho file "${file.name}"`);
          }
        } else {
          console.error('Upload failed with status:', response?.statusCode, response?.message);
          toast.error(`Lỗi upload ảnh "${file.name}": ${response?.message || 'Lỗi không xác định'}`);
        }
        setIsUploadingAvatar(false);
      },
      onError: (error: any) => {
        console.error('Upload error for file:', file.name, error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Không thể upload ảnh';
        toast.error(`Lỗi upload ảnh "${file.name}": ${errorMessage}`);
        setIsUploadingAvatar(false);
      }
    });

    // Clear the input value to allow re-uploading the same file
    e.target.value = '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Họ tên không được để trống";
      toast.error("Vui lòng nhập họ tên");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
      toast.error("Vui lòng nhập số điện thoại");
    }
    if (!formData.citizenId.trim()) {
      newErrors.citizenId = "Số CMND/CCCD không được để trống";
      toast.error("Vui lòng nhập số CMND/CCCD");
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      toast.error("Email không đúng định dạng");
    }
    if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      toast.error("Số điện thoại không đúng định dạng");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    createHomeOwnerMutation(formData, {
      onSuccess: (data) => {
        if (data.statusCode === 200 || data.statusCode === 201) {
          toast.success("Tạo chủ nhà thành công!");
          setFormData({
            fullname: "",
            phone: "",
            email: "",
            citizenId: "",
            citizen_date: "",
            citizen_place: "",
            birthday: "",
            hometown: "",
            note: "",
            gender: undefined,
            avatarUrl: "",
            address: "",
            bankAccount: "",
            bankName: "",
          });
          setErrors({});
          setCitizenDateInput("");
          setBirthdayInput("");
          onSuccess?.();
          onClose();
        } else {
          toast.error("Tạo chủ nhà thất bại");
        }
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message}`);
      }
    });
  };

  const handleClose = () => {
    setFormData({
      fullname: "",
      phone: "",
      email: "",
      citizenId: "",
      citizen_date: "",
      citizen_place: "",
      birthday: "",
      hometown: "",
      note: "",
      gender: undefined,
      avatarUrl: "",
      address: "",
      bankAccount: "",
      bankName: "",
    });
    setErrors({});
    setCitizenDateInput("");
    setBirthdayInput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle  >
            Tạo chủ nhà mới
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
                {/* Avatar Upload */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-secondaryTextV1">Ảnh đại diện</Label>
                    {isUploadingAvatar && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <IconLoader2 className="h-4 w-4 animate-spin" />
                        <span>Đang tải ảnh...</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="avatar-upload"
                        disabled={isUploadingAvatar}
                      />
                      <Label htmlFor="avatar-upload" className={`cursor-pointer ${isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-lightBorderV1 rounded-lg hover:border-mainTextHoverV1 hover:bg-blue-50/50 transition-all duration-200 group">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200">
                            {isUploadingAvatar ? (
                              <IconLoader2 className="h-5 w-5 text-blue-600 animate-spin" />
                            ) : (
                              <IconUpload className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-mainTextV1 group-hover:text-mainTextHoverV1">
                              {isUploadingAvatar ? "Đang tải ảnh..." : "Tải ảnh đại diện lên"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Chọn ảnh (tối đa 10MB)
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    {/* Avatar Preview */}
                    {formData.avatarUrl && (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="relative group">
                          <div className="w-32 h-32 border border-lightBorderV1 rounded-lg overflow-hidden mx-auto">
                            <img
                              src={formData.avatarUrl}
                              alt="Ảnh đại diện"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={isUploadingAvatar}
                          >
                            <IconX className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname" className="text-secondaryTextV1">
                      Họ tên <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Nhập họ tên"
                      className={`border-lightBorderV1 ${errors.fullname ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.fullname && (
                      <p className="text-sm text-mainDangerV1">{errors.fullname}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-secondaryTextV1">
                      Số điện thoại <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className={`border-lightBorderV1 ${errors.phone ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-mainDangerV1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-secondaryTextV1">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email"
                      className={`border-lightBorderV1 ${errors.email ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-mainDangerV1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="citizenId" className="text-secondaryTextV1">
                      Số CMND/CCCD <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="citizenId"
                      name="citizenId"
                      value={formData.citizenId}
                      onChange={handleChange}
                      placeholder="Nhập số CMND/CCCD"
                      className={`border-lightBorderV1 ${errors.citizenId ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.citizenId && (
                      <p className="text-sm text-mainDangerV1">{errors.citizenId}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="citizen_date" className="text-secondaryTextV1">
                      Ngày cấp
                    </Label>
                    <Input
                      id="citizen_date"
                      value={citizenDateInput}
                      onChange={(e) => handleDateInputChange('citizen_date', e.target.value)}
                      placeholder="dd/MM/yyyy"
                      className={`border-lightBorderV1 ${errors.citizen_date ? "border-mainDangerV1" : ""}`}
                      maxLength={10}
                    />
                    {errors.citizen_date && (
                      <p className="text-sm text-mainDangerV1">{errors.citizen_date}</p>
                    )}
                    <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/03/2020)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="citizen_place" className="text-secondaryTextV1">
                      Nơi cấp
                    </Label>
                    <Input
                      id="citizen_place"
                      name="citizen_place"
                      value={formData.citizen_place}
                      onChange={handleChange}
                      placeholder="Nhập nơi cấp"
                      className="border-lightBorderV1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthday" className="text-secondaryTextV1">
                      Ngày sinh
                    </Label>
                    <Input
                      id="birthday"
                      value={birthdayInput}
                      onChange={(e) => handleDateInputChange('birthday', e.target.value)}
                      placeholder="dd/MM/yyyy"
                      className={`border-lightBorderV1 ${errors.birthday ? "border-mainDangerV1" : ""}`}
                      maxLength={10}
                    />
                    {errors.birthday && (
                      <p className="text-sm text-mainDangerV1">{errors.birthday}</p>
                    )}
                    <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/03/1990)</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-secondaryTextV1">Giới tính</Label>
                    <RadioGroup
                      value={formData.gender === true ? "male" : formData.gender === false ? "female" : undefined}
                      onValueChange={handleGenderChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="r1" />
                        <Label htmlFor="r1">Nam</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="r2" />
                        <Label htmlFor="r2">Nữ</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hometown" className="text-secondaryTextV1">
                    Địa chỉ
                  </Label>
                  <Input
                    id="hometown"
                    name="hometown"
                    value={formData.hometown}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    className="border-lightBorderV1"
                  />
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
                ) : 'Tạo chủ nhà'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}; 
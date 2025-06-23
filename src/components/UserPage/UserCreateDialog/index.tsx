"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateUser } from "@/hooks/useUser";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { useUploadFile } from "@/hooks/useUpload";
import { ICreateUserBody } from "@/interface/request/user";
import { IUploadResponse } from "@/interface/response/upload";
import { toast } from "react-toastify";
import { IconLoader2, IconUser, IconX, IconUpload } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserCreateDialog = ({ isOpen, onClose, onSuccess }: UserCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateUserBody>({
    name: "",
    email: "",
    password: "",
    studentId: "",
    fullName: "",
    phoneNumber: "",
    avatar: "",
    role: "student",
    department: "",
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const { mutate: createUserMutation, isPending } = useCreateUser();
  const { mutate: uploadFileMutation } = useUploadFile();
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetAllDepartments();

  const departments = departmentsData?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
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
            setFormData(prev => ({ ...prev, avatar: imageUrl }));
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

    if (!formData.name.trim()) {
      newErrors.name = "Tên đăng nhập là bắt buộc";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên đầy đủ là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.phoneNumber && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    createUserMutation(formData, {
      onSuccess: (response) => {
        toast.success("Tạo người dùng thành công!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo người dùng!");
      },
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      studentId: "",
      fullName: "",
      phoneNumber: "",
      avatar: "",
      role: "student",
      department: "",
      active: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">Thêm người dùng mới</DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
                {formData.avatar && (
                  <div className="flex justify-center">
                    <div className="relative group">
                      <div className="w-20 h-20 border border-lightBorderV1 rounded-full overflow-hidden">
                        <img
                          src={formData.avatar}
                          alt="Ảnh đại diện"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatar: "" }))}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                <Label htmlFor="name" className="text-mainTextV1">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  className={`${errors.name ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-mainTextV1">
                  Họ tên đầy đủ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ tên đầy đủ"
                  className={`${errors.fullName ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-mainTextV1">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className={`${errors.email ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-mainTextV1">
                  Mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className={`${errors.password ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-mainTextV1">
                  Mã sinh viên
                </Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Nhập mã sinh viên"
                  className="border-lightBorderV1 focus:border-mainTextHoverV1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-mainTextV1">
                  Số điện thoại
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  className={`${errors.phoneNumber ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-mainTextV1">
                  Vai trò
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                  <SelectTrigger className="border-lightBorderV1 focus:border-mainTextHoverV1">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-mainTextV1">
                  Khoa
                </Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleSelectChange('department', value)}
                  disabled={isLoadingDepartments}
                >
                  <SelectTrigger className="border-lightBorderV1 focus:border-mainTextHoverV1">
                    <SelectValue placeholder={isLoadingDepartments ? "Đang tải..." : "Chọn khoa"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không chọn khoa</SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department._id} value={department._id}>
                        {department.name} ({department.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="active" className="text-mainTextV1">
                Trạng thái hoạt động
              </Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleSwitchChange('active', checked)}
              />
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
                  "Tạo người dùng"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}; 
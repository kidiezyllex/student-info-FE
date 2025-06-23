"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetUserById, useUpdateUser } from "@/hooks/useUser";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { useUploadFile } from "@/hooks/useUpload";
import { IUpdateUserBody } from "@/interface/request/user";
import { IUploadResponse } from "@/interface/response/upload";
import { toast } from "react-toastify";
import { IconLoader2, IconEdit, IconX, IconUpload, IconUserCircle, IconMail, IconPhone, IconId, IconBuildingBank, IconCalendar } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/dateFormat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
}

export const UserDetailsDialog = ({ isOpen, onClose, userId, onSuccess }: UserDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateUserBody>({
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

  const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId);
  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();
  const { mutate: uploadFileMutation } = useUploadFile();
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetAllDepartments();

  const departments = departmentsData?.data || [];

  console.log(userData);

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        studentId: user.studentId || "",
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        avatar: user.avatar || "",
        role: user.role,
        department: user.department?._id || "",
        active: user.active,
      });
    }
  }, [userData]);

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

    if (!formData.name?.trim()) {
      newErrors.name = "Tên đăng nhập là bắt buộc";
    }

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Họ tên đầy đủ là bắt buộc";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.password && formData.password.length < 6) {
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

    const updateData: IUpdateUserBody = {
      name: formData.name,
      email: formData.email,
      studentId: formData.studentId,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      avatar: formData.avatar,
      role: formData.role,
      department: formData.department,
      active: formData.active,
    };

    // Only include password if it's provided
    if (formData.password?.trim()) {
      updateData.password = formData.password;
    }

    updateUserMutation(
      { id: userId, data: updateData },
      {
        onSuccess: (response) => {
          toast.success("Cập nhật người dùng thành công!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật người dùng!");
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
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        studentId: user.studentId || "",
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        avatar: user.avatar || "",
        role: user.role,
        department: user.department?._id || "",
        active: user.active,
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-100 text-nowrap">
            Admin
          </Badge>
        );
      case 'student':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-100 text-nowrap">
            Student
          </Badge>
        );
      case 'coordinator':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-100 text-nowrap">
            Coordinator
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-100 text-nowrap">
            {role}
          </Badge>
        );
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-500 hover:bg-green-600 text-white text-nowrap">
        Hoạt động
      </Badge>
    ) : (
      <Badge variant="destructive" className="text-nowrap">
        Không hoạt động
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">
            {isEditing ? "Chỉnh sửa người dùng" : "Chi tiết người dùng"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="space-y-6">
            {/* Avatar skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            
            {/* Form skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!isEditing && userData?.data && (
              <Card className="border border-lightBorderV1">
                <CardHeader>
                  <CardTitle className="text-lg text-mainTextV1">Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {userData.data.avatar ? (
                        <img 
                          src={userData.data.avatar} 
                          alt={userData.data.fullName || userData.data.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IconUserCircle className="w-12 h-12 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-mainTextV1">
                        {userData.data.fullName || userData.data.name}
                      </h3>
                      <p className="text-secondaryTextV1">{userData.data.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getRoleBadge(userData.data.role)}
                        {getStatusBadge(userData.data.active)}
                      </div>
                    </div>
                  </div>

                  {/* User Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <IconMail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-secondaryTextV1">Email</p>
                          <p className="font-medium text-mainTextV1">{userData.data.email}</p>
                        </div>
                      </div>

                      {userData.data.phoneNumber && (
                        <div className="flex items-center gap-3">
                          <IconPhone className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-secondaryTextV1">Số điện thoại</p>
                            <p className="font-medium text-mainTextV1">{userData.data.phoneNumber}</p>
                          </div>
                        </div>
                      )}

                      {userData.data.studentId && (
                        <div className="flex items-center gap-3">
                          <IconId className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-secondaryTextV1">Mã sinh viên</p>
                            <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                              {userData.data.studentId}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {userData.data.department && (
                        <div className="flex items-center gap-3">
                          <IconBuildingBank className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-secondaryTextV1">Khoa</p>
                            <p className="font-medium text-mainTextV1">{userData.data.department.name}</p>
                            <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                              {userData.data.department.code}
                            </Badge>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <IconCalendar className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-secondaryTextV1">Ngày tạo</p>
                          <p className="font-medium text-mainTextV1">{formatDate(userData.data.createdAt)}</p>
                        </div>
                      </div>

                      {userData.data.lastLogin && (
                        <div className="flex items-center gap-3">
                          <IconCalendar className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-secondaryTextV1">Đăng nhập cuối</p>
                            <p className="font-medium text-mainTextV1">{formatDate(userData.data.lastLogin)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isEditing && (
              <Card className="border border-lightBorderV1">
                <CardHeader>
                  <CardTitle className="text-lg text-mainTextV1">Chỉnh sửa thông tin</CardTitle>
                </CardHeader>
                <CardContent>
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

                    {/* Form Fields */}
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
                          Mật khẩu mới (để trống nếu không thay đổi)
                        </Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Nhập mật khẩu mới"
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
                  </form>
                </CardContent>
              </Card>
            )}

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
                    onClick={handleSubmit}
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 
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
import { IconLoader2, IconEdit, IconX, IconUpload, IconUserCircle, IconMail, IconPhone, IconId, IconBuildingBank, IconCalendar, IconCheck } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/dateFormat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Activity } from "lucide-react";

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

    const isValidType = file.type.startsWith('image/');
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

    if (!isValidType) {
      toast.error(`File ${file.name} is not a valid image`);
      return;
    }
    if (!isValidSize) {
      toast.error(`File ${file.name} is too large (maximum 10MB)`);
      return;
    }

    setIsUploadingAvatar(true);

    uploadFileMutation({ file }, {
      onSuccess: (response: IUploadResponse) => {
        if (response?.status) {
          const imageUrl = response?.data?.url;
          setFormData(prev => ({ ...prev, avatar: imageUrl }));
          toast.success(response?.message);
        } else {
          toast.error(response?.message);
        }
        setIsUploadingAvatar(false);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message);
        setIsUploadingAvatar(false);
      }
    });

    e.target.value = '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Login name is required";
    }

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.phoneNumber && !/^(0|\+84)[2|3|4|5|7|8|9][0-9]{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number is not valid";
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

    if (formData.password?.trim()) {
      updateData.password = formData.password;
    }

    updateUserMutation(
      { id: userId, data: updateData },
      {
        onSuccess: (response) => {
          toast.success("Update user successfully!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "An error occurred while updating user!");
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
        return <Badge variant="cyan">Admin</Badge>;
      case 'student':
        return <Badge variant="indigo">Student</Badge>;
      case 'coordinator':
        return <Badge variant="blue">Coordinator</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active ? <Badge variant="green"><Activity className="h-3 w-3" />Active</Badge> : <Badge variant="red">Inactive</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit User" : "User Details"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="space-y-4">
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
          <div className="space-y-4">
            {!isEditing && userData?.data && (
              <Card className="border border-lightBorderV1">
                <CardHeader>
                  Basic Information
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border border-slate-300 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {userData.data.avatar ? (
                        <img
                          src={userData.data.avatar}
                          alt={userData.data.fullName || userData.data.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={`/images/${userData.data.gender ? userData.data.gender : "male"}-${userData.data.role}.webp`}
                          alt={"default-avatar"}
                          className="w-full h-full object-cover flex-shrink-0"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-mainTextV1">
                        Fullname: {userData.data.fullName || userData.data.name}
                      </h3>
                      <p className="text-secondaryTextV1">Username: {userData.data.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getRoleBadge(userData.data.role)}
                        {getStatusBadge(userData.data.active)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <IconMail className="w-5 h-5 text-mainTextV1" />
                        <div>
                          <p className="text-sm text-secondaryTextV1">Email</p>
                          <p className="font-semibold text-mainTextV1 text-sm">{userData.data.email}</p>
                        </div>
                      </div>

                      {userData.data.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <IconPhone className="w-5 h-5 text-mainTextV1" />
                          <div>
                            <p className="text-sm text-secondaryTextV1">Phone Number</p>
                            <p className="font-semibold text-mainTextV1 text-sm">{userData.data.phoneNumber}</p>
                          </div>
                        </div>
                      )}

                      {userData.data.studentId && (
                        <div className="flex items-center gap-2">
                          <IconId className="w-5 h-5 text-mainTextV1" />
                          <div>
                            <p className="text-sm text-secondaryTextV1">Student ID</p>
                            <Badge variant="slate">
                              {userData.data.studentId}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {userData.data.department && (
                        <div className="flex items-center gap-2">
                          <IconBuildingBank className="w-5 h-5 text-mainTextV1" />
                          <div>
                            <p className="text-sm text-secondaryTextV1 text-nowrap">Department</p>
                            <div className="flex items-center gap-1">
                              <Badge variant="slate">
                                {userData.data.department.code}
                              </Badge>
                              <p className="font-semibold text-mainTextV1 text-sm">{userData.data.department.name}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <IconCalendar className="w-5 h-5 text-mainTextV1" />
                        <div>
                          <p className="text-sm text-mainTextV1">Created At</p>
                          <p className="font-semibold text-mainTextV1 text-sm">{formatDate(userData.data.createdAt)}</p>
                        </div>
                      </div>

                      {userData.data.lastLogin && (
                        <div className="flex items-center gap-2">
                          <IconCalendar className="w-5 h-5 text-mainTextV1" />
                          <div>
                            <p className="text-sm text-mainTextV1">Last Login</p>
                            <p className="font-semibold text-mainTextV1 text-sm">{formatDate(userData.data.lastLogin)}</p>
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
                  Edit information
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Avatar Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-secondaryTextV1">Avatar</Label>
                        {isUploadingAvatar && (
                          <div className="flex items-center gap-2 text-sm text-orange-600">
                            <IconLoader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading avatar...</span>
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
                            <div className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-lightBorderV1 rounded-lg hover:border-mainTextHoverV1 hover:bg-orange-50/50 transition-all duration-200 group">
                              <div className="flex items-center justify-center w-12 h-12 flex-shrink-0 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors duration-200">
                                {isUploadingAvatar ? (
                                  <IconLoader2 className="h-5 w-5 text-orange-600 animate-spin" />
                                ) : (
                                  <IconUpload className="h-5 w-5 text-orange-600" />
                                )}
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-semibold text-mainTextV1 group-hover:text-mainTextHoverV1">
                                  {isUploadingAvatar ? "Đang tải ảnh..." : "Tải ảnh đại diện lên"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Select image (max 10MB)
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* Avatar Preview */}
                        {formData.avatar && (
                          <div className="flex justify-center">
                            <div className="relative group">
                              <div className="w-40 h-40 rounded-md border border-lightBorderV1 overflow-hidden">
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

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-mainTextV1">
                        Role
                      </Label>
                      <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="coordinator">Coordinator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-mainTextV1">
                          Username <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter username"
                          className={`${errors.name ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-mainTextV1">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter full name"
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
                          New Password (leave blank if not changing)
                        </Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          className={`${errors.password ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                      </div>

                      {formData.role === "student" && (
                        <div className="space-y-2">
                          <Label htmlFor="studentId" className="text-mainTextV1">
                            Student ID
                          </Label>
                          <Input
                            id="studentId"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            placeholder="Enter student ID"
                            className="border-lightBorderV1 focus:border-mainTextHoverV1"
                          />
                        </div>
                      )}

                      {(formData.role === "student" || formData.role === "coordinator") && (
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber" className="text-mainTextV1">
                            Phone Number
                          </Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className={`${errors.phoneNumber ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                          )}
                        </div>
                      )}

                      {(formData.role === "student" || formData.role === "coordinator") && (
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-mainTextV1">
                            Department
                          </Label>
                          <Select
                            value={formData.department || undefined}
                            onValueChange={(value) => handleSelectChange('department', value || "")}
                            disabled={isLoadingDepartments}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingDepartments ? "Đang tải..." : "Chọn khoa"} />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((department) => (
                                <SelectItem key={department._id} value={department._id}>
                                  {department.name} ({department.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="active" className="text-mainTextV1">
                        Active
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

            <div className="flex gap-2 pt-4 justify-end">
              {!isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    onClick={handleEdit}
                  >
                    <IconEdit className="h-4 w-4" />
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <IconLoader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) :
                      <>
                        <IconCheck className="h-4 w-4" />
                        Save changes
                      </>
                    }
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
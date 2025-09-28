"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { useUploadFile } from "@/hooks/useUpload";
import { IUpdateUserBody } from "@/interface/request/user";
import { IUploadResponse } from "@/interface/response/upload";
import { toast } from "react-toastify";
import { IconLoader2, IconEdit, IconX, IconUpload, IconCheck } from "@tabler/icons-react";

interface UserFormProps {
  formData: IUpdateUserBody;
  errors: Record<string, string>;
  isUpdating: boolean;
  onFormDataChange: (data: IUpdateUserBody) => void;
  onErrorsChange: (errors: Record<string, string>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const UserForm = ({
  formData,
  errors,
  isUpdating,
  onFormDataChange,
  onErrorsChange,
  onSubmit,
  onCancel,
}: UserFormProps) => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetAllDepartments();
  const { mutate: uploadFileMutation } = useUploadFile();
  const departments = departmentsData?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    onFormDataChange(newFormData);

    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const newFormData = { ...formData, [name]: value };
    onFormDataChange(newFormData);
    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    const newFormData = { ...formData, [name]: checked };
    onFormDataChange(newFormData);
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
          const newFormData = { ...formData, avatar: imageUrl };
          onFormDataChange(newFormData);
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

  return (
    <div className="space-y-4">
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
                  onClick={() => {
                    const newFormData = { ...formData, avatar: "" };
                    onFormDataChange(newFormData);
                  }}
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

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isUpdating}>
          {isUpdating ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <IconCheck className="h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateUser } from "@/hooks/useUser";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { useUploadFile } from "@/hooks/useUpload";
import { ICreateUserBody } from "@/interface/request/user";
import { IUploadResponse } from "@/interface/response/upload";
import { toast } from "react-toastify";
import {
  IconLoader2,
  IconUser,
  IconX,
  IconUpload,
  IconPlus,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
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

export const UserCreateDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: UserCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateUserBody>({
    name: "",
    email: "",
    password: "",
    studentId: "",
    fullName: "",
    phoneNumber: "",
    avatar: "",
    role: "student",
    department: "none",
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const { mutate: createUserMutation, isPending } = useCreateUser();
  const { mutate: uploadFileMutation } = useUploadFile();
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useGetAllDepartments();

  const departments = departmentsData?.data || [];

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

    const isValidType = file.type.startsWith("image/");
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

    uploadFileMutation(
      { file },
      {
        onSuccess: (response: IUploadResponse) => {
          if (response?.status) {
            const imageUrl = response?.data?.url;
            setFormData((prev) => ({ ...prev, avatar: imageUrl }));
            toast.success(response?.message);
          } else {
            toast.error(response?.message);
          }
          setIsUploadingAvatar(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message);
          setIsUploadingAvatar(false);
        },
      }
    );

    e.target.value = "";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Username is required";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (
      formData.phoneNumber &&
      !/^(0|\+84)[2|3|4|5|7|8|9][0-9]{8}$/.test(formData.phoneNumber)
    ) {
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

    const submitData = {
      ...formData,
      department: formData.department === "none" ? "" : formData.department,
    };

    createUserMutation(submitData, {
      onSuccess: (response) => {
        toast.success("Create user successfully!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "There was an error creating the user!"
        );
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
      department: "none",
      active: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] overflow-y-auto bg-white"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-800">Add New User</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-800">Avatar</Label>
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
                  <Label
                    htmlFor="avatar-upload"
                    className={`cursor-pointer ${
                      isUploadingAvatar ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-lightBorderV1 rounded-lg hover:border-mainTextHoverV1 hover:bg-orange-50/50 transition-all duration-200 group">
                      <div className="flex items-center justify-center w-12 h-12 flex-shrink-0 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors duration-200">
                        {isUploadingAvatar ? (
                          <IconLoader2 className="h-5 w-5 text-orange-600 animate-spin" />
                        ) : (
                          <IconUpload className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-800 group-hover:text-mainTextHoverV1">
                          {isUploadingAvatar
                            ? "Uploading avatar..."
                            : "Upload avatar"}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
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
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, avatar: "" }))
                        }
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
              <Label htmlFor="role" className="text-gray-800">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-800">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className={`${
                    errors.name ? "border-red-500" : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-800">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`${
                    errors.fullName ? "border-red-500" : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className={`${
                    errors.email ? "border-red-500" : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-800">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`${
                    errors.password ? "border-red-500" : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {formData.role === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-gray-800">
                    Student ID
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      placeholder="Enter student ID"
                      className="border-lightBorderV1 focus:border-mainTextHoverV1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        // Generate 5 random digits
                        const randomDigits = Math.floor(Math.random() * 100000)
                          .toString()
                          .padStart(5, "0");
                        const generatedId = `200${randomDigits}`;
                        setFormData((prev) => ({
                          ...prev,
                          studentId: generatedId,
                        }));
                      }}
                      className="whitespace-nowrap"
                    >
                      Generate ID
                    </Button>
                  </div>
                </div>
              )}

              {(formData.role === "student" ||
                formData.role === "coordinator") && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-800">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={`${
                      errors.phoneNumber
                        ? "border-red-500"
                        : "border-lightBorderV1"
                    } focus:border-mainTextHoverV1`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                  )}
                </div>
              )}

              {(formData.role === "student" ||
                formData.role === "coordinator") && (
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-800">
                    Department
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleSelectChange("department", value)
                    }
                    disabled={isLoadingDepartments}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingDepartments ? "Đang tải..." : "Chọn khoa"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No department</SelectItem>
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
              <Label htmlFor="active" className="text-gray-800">
                Active
              </Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  handleSwitchChange("active", checked)
                }
              />
            </div>

            <div className="flex gap-2 pt-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <IconPlus className="h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

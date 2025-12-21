"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetUserById, useUpdateUser } from "@/hooks/useUser";
import { IUpdateUserBody } from "@/interface/request/user";
import { toast } from "react-toastify";
import { IconEdit } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserTable } from "./UserTable";
import { UserForm } from "./UserForm";

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
  const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId);
  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();
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

  const handleFormDataChange = (newFormData: IUpdateUserBody) => {
    setFormData(newFormData);
  };

  const handleErrorsChange = (newErrors: Record<string, string>) => {
    setErrors(newErrors);
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

  const handleSubmit = () => {
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


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-gray-800">
            {isEditing ? "Edit user: " + userData?.data?.fullName : "User Details"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-4">
            {isEditing ? (
              <UserForm
                formData={formData}
                errors={errors}
                isUpdating={isUpdating}
                onFormDataChange={handleFormDataChange}
                onErrorsChange={handleErrorsChange}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
                        />
                      ) : (
              <>
                {userData?.data && <UserTable user={userData.data} />}
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button onClick={handleEdit}>
                    <IconEdit className="h-4 w-4" />
                    Edit user
                  </Button>
                </div>
                </>
              )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 
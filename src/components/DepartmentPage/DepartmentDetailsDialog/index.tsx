"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetDepartmentById, useUpdateDepartment } from "@/hooks/useDepartment";
import { IUpdateDepartmentBody } from "@/interface/request/department";
import { toast } from "react-toastify";
import { IconLoader2, IconBuilding, IconEdit, IconCheck } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersByRole } from "@/hooks/useUser";

interface DepartmentDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  onSuccess?: () => void;
}

export const DepartmentDetailsDialog = ({ isOpen, onClose, departmentId, onSuccess }: DepartmentDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateDepartmentBody>({
    name: "",
    code: "",
    description: "",
    coordinatorId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: departmentData, isLoading: isLoadingDepartment } = useGetDepartmentById(departmentId);
  const { mutate: updateDepartmentMutation, isPending: isUpdating } = useUpdateDepartment();
  const { data: coordinatorsData, isLoading: isLoadingCoordinators } = useGetUsersByRole('coordinator');
  useEffect(() => {
    if (departmentData?.data) {
      setFormData({
        name: departmentData.data.name,
        code: departmentData.data.code,
        description: departmentData.data.description,
        coordinatorId: departmentData.data.coordinator?._id || departmentData.data.coordinatorId || "",
      });
    }
  }, [departmentData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCoordinatorChange = (value: string) => {
    setFormData({ ...formData, coordinatorId: value });
    if (errors.coordinatorId) {
      setErrors({ ...errors, coordinatorId: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Department name is required";
    }

    if (!formData.code?.trim()) {
      newErrors.code = "Department code is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (isEditing && !formData.coordinatorId?.trim()) {
      newErrors.coordinatorId = "Coordinator is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    updateDepartmentMutation(
      { id: departmentId, data: formData },
      {
        onSuccess: (response) => {
          toast.success("Update department successfully!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.response?.data?.message || "There was an error updating the department!";
          toast.error(errorMessage);
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
    if (departmentData?.data) {
      setFormData({
        name: departmentData.data.name,
        code: departmentData.data.code,
        description: departmentData.data.description,
        coordinatorId: departmentData.data.coordinator?._id || departmentData.data.coordinatorId || "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">
            {isEditing ? "Edit department: " + " " + departmentData?.data?.name : "Department details: " + " " + departmentData?.data?.name}
          </DialogTitle>
        </DialogHeader>

        {isLoadingDepartment ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-mainTextV1">
                Department name {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter department name"
                disabled={!isEditing}
                className={`${errors.name ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-mainTextV1">
                Department code {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter department code"
                disabled={!isEditing}
                className={`${errors.code ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-mainTextV1">
                Description {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                rows={3}
                disabled={!isEditing}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Coordinator Information */}
            <div className="space-y-2">
              <Label className="text-mainTextV1">
                Coordinator {isEditing && <span className="text-red-500">*</span>}
              </Label>
              {isEditing ? (
                isLoadingCoordinators ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={formData.coordinatorId || ""}
                    onValueChange={handleCoordinatorChange}
                    disabled={isUpdating || isLoadingCoordinators}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a coordinator" />
                    </SelectTrigger>
                    <SelectContent>
                      {coordinatorsData?.data?.length === 0 && (
                        <SelectItem value="" disabled>
                          No coordinators found
                        </SelectItem>
                      )}
                      {coordinatorsData?.data
                        ?.filter(
                          (user) =>
                            !user.department ||
                            user.department._id === departmentData?.data?._id
                        )
                        .map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                          {
                            user.department?.name && (
                              <span className="font-semibold ml-1">({user.department.name})</span>
                            )
                          }
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              ) : (
                <div className="h-10 bg-gray-50 rounded-md border flex items-center px-3">
                  {departmentData?.data?.coordinator ? (
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold text-mainTextV1">
                        {departmentData.data.coordinator.name}
                      </p>
                      <p className="text-sm text-mainTextV1 font-semibold">
                        ({departmentData.data.coordinator.email})
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No coordinator</p>
                  )}
                </div>
              )}
              {errors.coordinatorId && (
                <p className="text-red-500 text-sm">{errors.coordinatorId}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4 justify-end w-full">
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
                    type="button"
                    onClick={handleSubmit}
                    disabled={isUpdating}
                  >
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
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 
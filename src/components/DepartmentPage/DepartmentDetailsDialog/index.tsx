"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetDepartmentById, useUpdateDepartment } from "@/hooks/useDepartment";
import { IUpdateDepartmentBody } from "@/interface/request/department";
import { toast } from "react-toastify";
import { IconEdit } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DepartmentTable } from "./DepartmentTable";
import { DepartmentForm } from "./DepartmentForm";

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

  const handleFormDataChange = (newFormData: IUpdateDepartmentBody) => {
    setFormData(newFormData);
  };

  const handleErrorsChange = (newErrors: Record<string, string>) => {
    setErrors(newErrors);
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
            {isEditing ? "Edit Department" : "Department Details"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingDepartment ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {isEditing ? (
              <DepartmentForm
                formData={formData}
                errors={errors}
                isUpdating={isUpdating}
                departmentId={departmentId}
                onFormDataChange={handleFormDataChange}
                onErrorsChange={handleErrorsChange}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {departmentData?.data && <DepartmentTable department={departmentData.data} />}
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button onClick={handleEdit}>
                    <IconEdit className="h-4 w-4" />
                    Edit department
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
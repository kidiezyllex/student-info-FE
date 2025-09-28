"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetScholarshipById, useUpdateScholarship } from "@/hooks/useScholarship";
import { IUpdateScholarshipBody } from "@/interface/request/scholarship";
import { toast } from "react-toastify";
import { IconEdit } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScholarshipTable } from "./ScholarshipTable";
import { ScholarshipForm } from "./ScholarshipForm";

interface ScholarshipDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  scholarshipId: string;
  onSuccess?: () => void;
}

export const ScholarshipDetailsDialog = ({ isOpen, onClose, scholarshipId, onSuccess }: ScholarshipDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateScholarshipBody>({
    title: "",
    description: "",
    requirements: "",
    value: "",
    applicationDeadline: "",
    provider: "",
    department: "",
    eligibility: "",
    applicationProcess: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: scholarshipData, isLoading: isLoadingScholarship } = useGetScholarshipById(scholarshipId);
  const { mutate: updateScholarshipMutation, isPending: isUpdating } = useUpdateScholarship();

  useEffect(() => {
    if (scholarshipData?.data) {
      const scholarship = scholarshipData.data;
      setFormData({
        title: scholarship.title,
        description: scholarship.description,
        requirements: scholarship.requirements,
        value: scholarship.value,
        applicationDeadline: scholarship.applicationDeadline.split('T')[0],
        provider: scholarship.provider,
        department: scholarship.department?._id || "",
        eligibility: scholarship.eligibility,
        applicationProcess: scholarship.applicationProcess,
      });
    }
  }, [scholarshipData]);

  const handleFormDataChange = (newFormData: IUpdateScholarshipBody) => {
    setFormData(newFormData);
  };

  const handleErrorsChange = (newErrors: Record<string, string>) => {
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.requirements?.trim()) {
      newErrors.requirements = "Requirements is required";
    }

    if (!formData.value?.trim()) {
      newErrors.value = "Value is required";
    }

    if (!formData.applicationDeadline?.trim()) {
      newErrors.applicationDeadline = "Application deadline is required";
    }

    if (!formData.provider?.trim()) {
      newErrors.provider = "Provider is required";
    }

    if (!formData.department?.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.eligibility?.trim()) {
      newErrors.eligibility = "Eligibility is required";
    }

    if (!formData.applicationProcess?.trim()) {
      newErrors.applicationProcess = "Application process is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    updateScholarshipMutation(
      { id: scholarshipId, data: formData },
      {
        onSuccess: (response) => {
          toast.success("Scholarship updated successfully!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.response?.data?.message || "There was an error updating the scholarship!";
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
    if (scholarshipData?.data) {
      const scholarship = scholarshipData.data;
      setFormData({
        title: scholarship.title,
        description: scholarship.description,
        requirements: scholarship.requirements,
        value: scholarship.value,
        applicationDeadline: scholarship.applicationDeadline.split('T')[0],
        provider: scholarship.provider,
        department: scholarship.department?._id || "",
        eligibility: scholarship.eligibility,
        applicationProcess: scholarship.applicationProcess,
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
            {isEditing ? "Edit scholarship: " + scholarshipData?.data?.title : "Scholarship details: " + scholarshipData?.data?.title}
          </DialogTitle>
        </DialogHeader>

        {isLoadingScholarship ? (
          <div className="space-y-4">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {isEditing ? (
              <ScholarshipForm
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
                {scholarshipData?.data && <ScholarshipTable scholarship={scholarshipData.data} />}
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button onClick={handleEdit}>
                    <IconEdit className="h-4 w-4" />
                    Edit scholarship
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
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetScholarshipById, useUpdateScholarship } from "@/hooks/useScholarship";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { IUpdateScholarshipBody } from "@/interface/request/scholarship";
import { toast } from "react-toastify";
import { IconLoader2, IconAward, IconEdit, IconCheck } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const { data: departmentsData } = useGetAllDepartments();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-mainTextV1">
                  Title {isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter scholarship title"
                  disabled={!isEditing}
                  className={`${errors.title ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider" className="text-mainTextV1">
                  Provider {isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  placeholder="Enter scholarship provider"
                  disabled={!isEditing}
                  className={`${errors.provider ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {errors.provider && (
                  <p className="text-red-500 text-sm">{errors.provider}</p>
                )}
              </div>
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
                placeholder="Enter scholarship description"
                rows={3}
                disabled={!isEditing}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value" className="text-mainTextV1">
                  Value {isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="Enter scholarship value"
                  disabled={!isEditing}
                  className={`${errors.value ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {errors.value && (
                  <p className="text-red-500 text-sm">{errors.value}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationDeadline" className="text-mainTextV1">
                  Application Deadline {isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${errors.applicationDeadline ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {errors.applicationDeadline && (
                  <p className="text-red-500 text-sm">{errors.applicationDeadline}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-mainTextV1">
                Department {isEditing && <span className="text-red-500">*</span>}
              </Label>
              {isEditing ? (
                <Select value={formData.department || undefined} onValueChange={(value) => handleSelectChange("department", value || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentsData?.data?.map((department) => (
                      <SelectItem key={department._id} value={department._id}>
                        {department.name} ({department.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={scholarshipData?.data?.department?.name || "No department"}
                  disabled={true}
                  className="bg-gray-50 border-lightBorderV1"
                />
              )}
              {errors.department && (
                <p className="text-red-500 text-sm">{errors.department}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-mainTextV1">
                Requirements {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Enter scholarship requirements"
                rows={3}
                disabled={!isEditing}
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm">{errors.requirements}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibility" className="text-mainTextV1">
                Eligibility {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="Enter eligibility criteria"
                rows={3}
                disabled={!isEditing}
              />
              {errors.eligibility && (
                <p className="text-red-500 text-sm">{errors.eligibility}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationProcess" className="text-mainTextV1">
                Application Process {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="applicationProcess"
                name="applicationProcess"
                value={formData.applicationProcess}
                onChange={handleChange}
                placeholder="Enter application process"
                rows={3}
                disabled={!isEditing}
              />
              {errors.applicationProcess && (
                <p className="text-red-500 text-sm">{errors.applicationProcess}</p>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button onClick={handleEdit}>
                    <IconEdit className="h-4 w-4" />
                    Edit scholarship
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isUpdating}>
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
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateScholarship } from "@/hooks/useScholarship";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { ICreateScholarshipBody } from "@/interface/request/scholarship";
import { toast } from "react-toastify";
import { IconLoader2, IconAward, IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScholarshipCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ScholarshipCreateDialog = ({ isOpen, onClose, onSuccess }: ScholarshipCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateScholarshipBody>({
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

  const { mutate: createScholarshipMutation, isPending } = useCreateScholarship();
  const { data: departmentsData } = useGetAllDepartments();

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

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requirements is required";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Value is required";
    }

    if (!formData.applicationDeadline.trim()) {
      newErrors.applicationDeadline = "Application deadline is required";
    }

    if (!formData.provider.trim()) {
      newErrors.provider = "Provider is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.eligibility.trim()) {
      newErrors.eligibility = "Eligibility is required";
    }

    if (!formData.applicationProcess.trim()) {
      newErrors.applicationProcess = "Application process is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createScholarshipMutation(formData, {
      onSuccess: (response) => {
        toast.success("Scholarship created successfully!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "An error occurred while creating scholarship!");
      },
    });
  };

  const handleClose = () => {
    setFormData({
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
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">Add new scholarship</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-mainTextV1">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter scholarship title"
                className={`${errors.title ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider" className="text-mainTextV1">
                Provider <span className="text-red-500">*</span>
              </Label>
              <Input
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                placeholder="Enter scholarship provider"
                className={`${errors.provider ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
              />
              {errors.provider && (
                <p className="text-red-500 text-sm">{errors.provider}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-mainTextV1">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter scholarship description"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-mainTextV1">
                Value <span className="text-red-500">*</span>
              </Label>
              <Input
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="Enter scholarship value (e.g., $5000)"
                className={`${errors.value ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
              />
              {errors.value && (
                <p className="text-red-500 text-sm">{errors.value}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-mainTextV1">
                Application Deadline <span className="text-red-500">*</span>
              </Label>
              <Input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className={`${errors.applicationDeadline ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
              />
              {errors.applicationDeadline && (
                <p className="text-red-500 text-sm">{errors.applicationDeadline}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-mainTextV1">
              Department <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
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
            {errors.department && (
              <p className="text-red-500 text-sm">{errors.department}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-mainTextV1">
              Requirements <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Enter scholarship requirements"
              rows={3}
            />
            {errors.requirements && (
              <p className="text-red-500 text-sm">{errors.requirements}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eligibility" className="text-mainTextV1">
              Eligibility <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="eligibility"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="Enter eligibility criteria"
              rows={3}
            />
            {errors.eligibility && (
              <p className="text-red-500 text-sm">{errors.eligibility}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationProcess" className="text-mainTextV1">
              Application Process <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="applicationProcess"
              name="applicationProcess"
              value={formData.applicationProcess}
              onChange={handleChange}
              placeholder="Enter application process"
              rows={3}
            />
            {errors.applicationProcess && (
              <p className="text-red-500 text-sm">{errors.applicationProcess}</p>
            )}
          </div>

          <div className="flex flex-1 h-full gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <IconPlus className="h-4 w-4" />
                  Create scholarship
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 
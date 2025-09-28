"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateDatasetItem } from "@/hooks/useDataset";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { ICreateDatasetItemBody } from "@/interface/request/dataset";
import { toast } from "react-toastify";
import { IconLoader2, IconDatabase, IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DatasetCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const commonCategories = [
  "event",
  "scholarship",
  "notification",
];

export const DatasetCreateDialog = ({ isOpen, onClose, onSuccess }: DatasetCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateDatasetItemBody>({
    key: "",
    value: "",
    category: "",
    department: "none",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createDatasetItemMutation, isPending } = useCreateDatasetItem();
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

    // Clear error when user selects
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.key.trim()) {
      newErrors.key = "Key is required";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Value is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
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
      department: formData.department === "none" ? undefined : formData.department,
    };

    createDatasetItemMutation(submitData, {
      onSuccess: (response) => {
        toast.success("Dataset item created successfully!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "An error occurred while creating dataset item!");
      },
    });
  };

  const handleClose = () => {
    setFormData({
      key: "",
      value: "",
      category: "",
      department: "none",
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
          <DialogTitle className="text-mainTextV1">Add New Dataset Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 h-full">
          <div className="space-y-2">
            <Label htmlFor="key" className="text-mainTextV1">
              Key <span className="text-red-500">*</span>
            </Label>
            <Input
              id="key"
              name="key"
              value={formData.key}
              onChange={handleChange}
              placeholder="Enter dataset key"
              className={`${errors.key ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
            />
            {errors.key && (
              <p className="text-red-500 text-sm">{errors.key}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="value" className="text-mainTextV1">
              Value <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="Enter dataset value"
              rows={4}
            />
            {errors.value && (
              <p className="text-red-500 text-sm">{errors.value}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-mainTextV1">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {commonCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-mainTextV1">
              Department (Optional)
            </Label>
            <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No department</SelectItem>
                {departmentsData?.data?.map((department) => (
                  <SelectItem key={department._id} value={department._id}>
                    {department.name} ({department.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  Create Dataset Item
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 
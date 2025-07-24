"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetDatasetItemById, useUpdateDatasetItem } from "@/hooks/useDataset";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { IUpdateDatasetItemBody } from "@/interface/request/dataset";
import { toast } from "react-toastify";
import { IconLoader2, IconDatabase, IconEdit, IconCheck } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DatasetDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  datasetItemId: string;
  onSuccess?: () => void;
}

const commonCategories = [
  "event",
  "scholarship", 
  "notification",
];

export const DatasetDetailsDialog = ({ isOpen, onClose, datasetItemId, onSuccess }: DatasetDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateDatasetItemBody>({
    key: "",
    value: "",
    category: "",
    department: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: datasetItemData, isLoading: isLoadingDatasetItem } = useGetDatasetItemById(datasetItemId);
  const { data: departmentsData } = useGetAllDepartments();
  const { mutate: updateDatasetItemMutation, isPending: isUpdating } = useUpdateDatasetItem();

  useEffect(() => {
    if (datasetItemData?.data) {
      setFormData({
        key: datasetItemData.data.key,
        value: datasetItemData.data.value,
        category: datasetItemData.data.category,
        department: datasetItemData.data.department?._id || "",
      });
    }
  }, [datasetItemData]);

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

    if (!formData.key?.trim()) {
      newErrors.key = "Key is required";
    }

    if (!formData.value?.trim()) {
      newErrors.value = "Value is required";
    }

    if (!formData.category?.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      department: formData.department || undefined,
    };

    updateDatasetItemMutation(
      { id: datasetItemId, data: submitData },
      {
        onSuccess: (response) => {
          toast.success("Dataset item updated successfully!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.response?.data?.message || "There was an error updating the dataset item!";
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
    if (datasetItemData?.data) {
      setFormData({
        key: datasetItemData.data.key,
        value: datasetItemData.data.value,
        category: datasetItemData.data.category,
        department: datasetItemData.data.department?._id || "",
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
            {isEditing ? "Edit dataset item " + datasetItemData?.data?.key : "Dataset item details " + datasetItemData?.data?.key}
          </DialogTitle>
        </DialogHeader>

        {isLoadingDatasetItem ? (
          <div className="space-y-4">
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
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key" className="text-mainTextV1">
                Key {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="key"
                name="key"
                value={formData.key}
                onChange={handleChange}
                placeholder="Enter dataset key"
                disabled={!isEditing}
                className={`${errors.key ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.key && (
                <p className="text-red-500 text-sm">{errors.key}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="value" className="text-mainTextV1">
                Value {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="Enter dataset value"
                rows={4}
                disabled={!isEditing}
              />
              {errors.value && (
                <p className="text-red-500 text-sm">{errors.value}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-mainTextV1">
                Category {isEditing && <span className="text-red-500">*</span>}
              </Label>
              {isEditing ? (
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
              ) : (
                <Input
                  value={formData.category}
                  disabled={true}
                  className="bg-gray-50 border-lightBorderV1"
                />
              )}
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-mainTextV1">
                Department (Optional)
              </Label>
              {isEditing ? (
                <Select value={formData.department || undefined} onValueChange={(value) => handleSelectChange("department", value || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department (optional)" />
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
                  value={datasetItemData?.data?.department?.name || "No department"}
                  disabled={true}
                  className="bg-gray-50 border-lightBorderV1"
                />
              )}
            </div>

            {!isLoadingDatasetItem && (
              <div className="space-y-2">
                <Label className="text-mainTextV1">Created At</Label>
                <Input
                  value={new Date(datasetItemData?.data?.createdAt || "").toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  disabled={true}
                  className="bg-gray-50 border-lightBorderV1"
                />
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button onClick={handleEdit}>
                    <IconEdit className="h-4 w-4" />
                    Edit dataset item
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
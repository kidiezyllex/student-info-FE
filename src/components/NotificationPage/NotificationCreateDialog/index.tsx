"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateNotification } from "@/hooks/useNotification";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { ICreateNotificationBody } from "@/interface/request/notification";
import { toast } from "react-toastify";
import { IconLoader2, IconBell, IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotificationCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const notificationTypes = [
  "scholarship",
  "event",
  "notification"
];

export const NotificationCreateDialog = ({ isOpen, onClose, onSuccess }: NotificationCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateNotificationBody>({
    title: "",
    content: "",
    type: "",
    department: null, // Changed from empty string to null
    startDate: "",
    endDate: "",
    isImportant: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createNotificationMutation, isPending } = useCreateNotification();
  const { data: departmentsData } = useGetAllDepartments();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value === "all-departments" ? null : value }); // Handle "all-departments" for All departments

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, isImportant: checked });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Type is required";
    }

    if (!formData.startDate?.trim()) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate?.trim()) {
      newErrors.endDate = "End date is required";
    }

    // Validate date range
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = "End date must be after start date";
      }
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
      department: formData.department || undefined,
    };

    createNotificationMutation(submitData, {
      onSuccess: (response) => {
        toast.success("Notification created successfully!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "An error occurred while creating notification!");
      },
    });
  };

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      type: "",
      department: null, // Reset to null
      startDate: "",
      endDate: "",
      isImportant: false,
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
          <DialogTitle className="text-mainTextV1">Add new notification</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 h-full">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-mainTextV1">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notification title"
              className={`${errors.title ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-mainTextV1">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter notification content"
              rows={4}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-mainTextV1">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-mainTextV1">
                Department (Optional)
              </Label>
              <Select value={formData.department || "all-departments"} onValueChange={(value) => handleSelectChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-departments">All departments</SelectItem>
                  {departmentsData?.data?.map((department) => (
                    <SelectItem key={department._id} value={department._id}>
                      {department.name} ({department.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-mainTextV1">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className={`${errors.startDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-mainTextV1">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className={`${errors.endDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isImportant"
              checked={formData.isImportant}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="isImportant" className="text-mainTextV1">
              Mark as important
            </Label>
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
                  Create notification
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 
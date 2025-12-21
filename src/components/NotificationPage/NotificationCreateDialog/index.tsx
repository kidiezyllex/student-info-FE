"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateNotification } from "@/hooks/useNotification";
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


export const NotificationCreateDialog = ({ isOpen, onClose, onSuccess }: NotificationCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateNotificationBody>({
    title: "",
    content: "",
    type: "notification", // Default to "notification"
    startDate: "",
    endDate: "",
    isImportant: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createNotificationMutation, isPending } = useCreateNotification();
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

  const handleDateTimeChange = (name: string, value: string) => {
    // Convert datetime-local value to ISO string for backend
    const isoValue = value ? new Date(value).toISOString() : "";
    setFormData({ ...formData, [name]: isoValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const convertFromISOString = (isoString: string | undefined) => {
    if (!isoString) return "";
    // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:MM)
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
      type: "notification", // Reset to default "notification"
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
          <DialogTitle className="text-gray-800">Add new notification</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 h-full">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-800">
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
            <Label htmlFor="content" className="text-gray-800">
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
              <Label htmlFor="startDate" className="text-gray-800">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={convertFromISOString(formData.startDate)}
                onChange={(e) => handleDateTimeChange('startDate', e.target.value)}
                className={`mt-1 ${errors.startDate ? 'border-red-500' : ''}`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={convertFromISOString(formData.endDate)}
                onChange={(e) => handleDateTimeChange('endDate', e.target.value)}
                className={`mt-1 ${errors.endDate ? 'border-red-500' : ''}`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
             className="h-6 w-6"
              id="isImportant"
              checked={formData.isImportant}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="isImportant" className="text-gray-800">
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
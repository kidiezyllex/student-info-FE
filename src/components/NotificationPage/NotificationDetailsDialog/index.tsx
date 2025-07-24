"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetNotificationById, useUpdateNotification } from "@/hooks/useNotification";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { IUpdateNotificationBody } from "@/interface/request/notification";
import { toast } from "react-toastify";
import { IconLoader2, IconBell, IconEdit, IconCheck } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotificationDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notificationId: string;
  onSuccess?: () => void;
}

const notificationTypes = [
  "announcement",
  "academic",
  "scholarship",
  "event",
  "system",
  "urgent"
];

export const NotificationDetailsDialog = ({ isOpen, onClose, notificationId, onSuccess }: NotificationDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateNotificationBody>({
    title: "",
    content: "",
    type: "",
    department: "",
    startDate: "",
    endDate: "",
    isImportant: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: notificationData, isLoading: isLoadingNotification } = useGetNotificationById(notificationId);
  const { data: departmentsData } = useGetAllDepartments();
  const { mutate: updateNotificationMutation, isPending: isUpdating } = useUpdateNotification();

  useEffect(() => {
    if (notificationData?.data) {
      const notification = notificationData.data;
      setFormData({
        title: notification.title,
        content: notification.content,
        type: notification.type,
        department: notification.department?._id || "",
        startDate: notification.startDate.split('T')[0],
        endDate: notification.endDate.split('T')[0],
        isImportant: notification.isImportant,
      });
    }
  }, [notificationData]);

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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, isImportant: checked });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.content?.trim()) {
      newErrors.content = "Content is required";
    }
    if (!formData.type?.trim()) {
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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Clean up form data
    const submitData = {
      ...formData,
      department: formData.department || undefined,
    };

    updateNotificationMutation(
      { id: notificationId, data: submitData },
      {
        onSuccess: (response) => {
          toast.success("Notification updated successfully!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.response?.data?.message || "There was an error updating the notification!";
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
    if (notificationData?.data) {
      const notification = notificationData.data;
      setFormData({
        title: notification.title,
        content: notification.content,
        type: notification.type,
        department: notification.department?._id || "",
        startDate: notification.startDate.split('T')[0],
        endDate: notification.endDate.split('T')[0],
        isImportant: notification.isImportant,
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
            {isEditing ? "Edit notification " + notificationData?.data?.title : "Notification details " + notificationData?.data?.title}
          </DialogTitle>
        </DialogHeader>

        {isLoadingNotification ? (
          <div className="space-y-4">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-mainTextV1">
                Title {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notification title"
                disabled={!isEditing}
                className={`${errors.title ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-mainTextV1">
                Content {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter notification content"
                rows={4}
                disabled={!isEditing}
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-mainTextV1">
                  Type {isEditing && <span className="text-red-500">*</span>}
                </Label>
                {isEditing ? (
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger >
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
                ) : (
                  <Input
                    value={formData.type?.charAt(0).toUpperCase() + formData.type?.slice(1)}
                    disabled={true}
                    className="bg-gray-50 border-lightBorderV1"
                  />
                )}
                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type}</p>
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
                      <SelectItem value="">All departments</SelectItem>
                      {departmentsData?.data?.map((department) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.name} ({department.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={notificationData?.data?.department?.name || "All departments"}
                    disabled={true}
                    className="bg-gray-50 border-lightBorderV1"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-mainTextV1">
                  Start Date {isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${errors.startDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-mainTextV1">
                  End Date {isEditing && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${errors.endDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
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
                disabled={!isEditing}
              />
              <Label htmlFor="isImportant" className="text-mainTextV1">
                Mark as important
              </Label>
            </div>

            {!isLoadingNotification && (
              <div className="space-y-2">
                <Label className="text-mainTextV1">Created At</Label>
                <Input
                  value={new Date(notificationData?.data?.createdAt || "").toLocaleDateString('en-US', {
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
                    Edit notification
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
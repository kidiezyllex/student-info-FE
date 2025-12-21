"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEvent } from "@/hooks/useEvent";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { ICreateEventBody } from "@/interface/request/event";
import { toast } from "react-toastify";
import { IconLoader2, IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EventCreateDialog = ({ isOpen, onClose, onSuccess }: EventCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateEventBody>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    department: "",
    organizer: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createEventMutation, isPending } = useCreateEvent();
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetAllDepartments();

  const departments = departmentsData?.data || [];

  const convertToISOString = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return "";
    return new Date(dateTimeLocal).toISOString();
  };

  const convertFromISOString = (isoString: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDateTimeChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: convertToISOString(value)
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Event description is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start time is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End time is required";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        newErrors.endDate = "End time must be after start time";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = "Organizer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createEventMutation(formData, {
      onSuccess: (response) => {
        toast.success("Event created successfully!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || "There was an error creating the event";
        toast.error(errorMessage);
      },
    });
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      department: "",
      organizer: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Add new event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-800">
                Event name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event name"
                className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-800">
                Event description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="startDate" className="text-sm font-semibold text-gray-800">
                Start time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={convertFromISOString(formData.startDate)}
                onChange={(e) => handleDateTimeChange('startDate', e.target.value)}
                className={`mt-1 ${errors.startDate ? 'border-red-500' : ''}`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <Label htmlFor="endDate" className="text-sm font-semibold text-gray-800">
                End time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={convertFromISOString(formData.endDate)}
                onChange={(e) => handleDateTimeChange('endDate', e.target.value)}
                className={`mt-1 ${errors.endDate ? 'border-red-500' : ''}`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-semibold text-gray-800">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                className={`mt-1 ${errors.location ? 'border-red-500' : ''}`}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="department" className="text-sm font-semibold text-gray-800">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange('department', value)}
                disabled={isLoadingDepartments}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department._id} value={department._id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="organizer" className="text-sm font-semibold text-gray-800">
                Organizer <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Enter event organizer"
                className={`mt-1 ${errors.organizer ? 'border-red-500' : ''}`}
              />
              {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
            </div>
          </div>

          <div className="flex gap-2 pt-4 justify-end">
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
              ) : <>
                <IconPlus className="h-4 w-4" />
                Create event
              </>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 
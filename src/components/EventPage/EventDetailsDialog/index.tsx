"use client";

import { useEffect, useState } from "react";
import { useGetEventById, useUpdateEvent, useDeleteEvent } from "@/hooks/useEvent";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IUpdateEventBody } from "@/interface/request/event";
import { formatDate } from "@/utils/dateFormat";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  IconEdit, 
  IconLoader2, 
  IconCheck, 
  IconCalendar, 
  IconMapPin, 
  IconUser, 
  IconBuilding,
  IconFileDescription,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess?: () => void;
}

export const EventDetailsDialog = ({ isOpen, onClose, eventId, onSuccess }: EventDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IUpdateEventBody>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    department: "",
    organizer: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: eventData, isLoading, error, refetch } = useGetEventById(eventId);
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetAllDepartments();
  const { mutate: updateEventMutation, isPending: isUpdating } = useUpdateEvent();
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

  useEffect(() => {
    if (eventData?.data) {
      const event = eventData.data;
      setFormData({
        title: event.title || "",
        description: event.description || "",
        startDate: event.startDate || "",
        endDate: event.endDate || "",
        location: event.location || "",
        department: event.department?._id || "",
        organizer: event.organizer || "",
      });
    }
  }, [eventData]);

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { status: "upcoming", label: "Upcoming", color: "orange" };
    } else if (now >= start && now <= end) {
      return { status: "ongoing", label: "Ongoing", color: "green" };
    } else {
      return { status: "ended", label: "Ended", color: "gray" };
    }
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

    if (!formData.title?.trim()) {
      newErrors.title = "Event name is required";
    }

    if (!formData.description?.trim()) {
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

    if (!formData.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.organizer?.trim()) {
      newErrors.organizer = "Organizer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    if (eventData?.data) {
      const event = eventData.data;
      setFormData({
        title: event.title || "",
        description: event.description || "",
        startDate: event.startDate || "",
        endDate: event.endDate || "",
        location: event.location || "",
        department: event.department?._id || "",
        organizer: event.organizer || "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    updateEventMutation({ id: eventId, data: formData }, {
      onSuccess: (response) => {
        toast.success("Event updated successfully!");
        setIsEditing(false);
        refetch();
        onSuccess?.();
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || error.message || "There was an error updating the event";
        toast.error(errorMessage);
      },
    });
  };

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !eventData?.data) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p className="text-red-500">Cannot load event information</p>
          <div className="flex justify-end">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const event = eventData.data;
  const eventStatus = getEventStatus(event.startDate, event.endDate);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Event" : "Event Details"}
            </DialogTitle>
          </DialogHeader>

          {!isEditing ? (
            <div className="space-y-4">
              <Card className="border border-lightBorderV1">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg text-mainTextV1">{event.title}</CardTitle>
                    <Badge variant={eventStatus.color as any}>
                      {eventStatus.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <IconCalendar className="w-5 h-5 text-mainTextV1 mt-0.5" />
                      <div>
                        <p className="text-sm text-secondaryTextV1">Time</p>
                        <p className="font-semibold text-mainTextV1 text-sm">
                          {formatDate(event.startDate)} - {formatDate(event.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <IconMapPin className="w-5 h-5 text-mainTextV1" />
                      <div>
                        <p className="text-sm text-secondaryTextV1">Location</p>
                        <p className="font-semibold text-mainTextV1 text-sm">{event.location}</p>
                      </div>
                    </div>

                    {event.department && (
                      <div className="flex items-center gap-2">
                        <IconBuilding className="w-5 h-5 text-mainTextV1" />
                        <div>
                          <p className="text-sm text-secondaryTextV1">Department</p>
                          <p className="font-semibold text-mainTextV1 text-sm">{event.department.name}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <IconUser className="w-5 h-5 text-mainTextV1" />
                      <div>
                        <p className="text-sm text-secondaryTextV1">Organizer</p>
                        <p className="font-semibold text-mainTextV1 text-sm">{event.organizer}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <IconFileDescription className="w-5 h-5 text-mainTextV1" />
                      <div>
                      <p className="text-sm text-secondaryTextV1">Description</p>
                      <p className="text-mainTextV1 text-sm leading-relaxed font-semibold">{event.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Card className="border border-lightBorderV1">
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="title" className="text-sm font-semibold text-mainTextV1">
                        Event name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title || ""}
                        onChange={handleChange}
                        placeholder="Enter event name"
                        className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="description" className="text-sm font-semibold text-mainTextV1">
                        Event description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        placeholder="Enter event description"
                        rows={4}
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                      <Label htmlFor="startDate" className="text-sm font-semibold text-mainTextV1">
                        Start time <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="datetime-local"
                        value={convertFromISOString(formData.startDate || "")}
                        onChange={(e) => handleDateTimeChange('startDate', e.target.value)}
                        className={`mt-1 ${errors.startDate ? 'border-red-500' : ''}`}
                      />
                      {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                    </div>

                    <div>
                      <Label htmlFor="endDate" className="text-sm font-semibold text-mainTextV1">
                        End time <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="datetime-local"
                        value={convertFromISOString(formData.endDate || "")}
                        onChange={(e) => handleDateTimeChange('endDate', e.target.value)}
                        className={`mt-1 ${errors.endDate ? 'border-red-500' : ''}`}
                      />
                      {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-semibold text-mainTextV1">
                        Location <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        placeholder="Enter event location"
                        className={`mt-1 ${errors.location ? 'border-red-500' : ''}`}
                      />
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="department" className="text-sm font-semibold text-mainTextV1">
                        Department <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.department || ""} 
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
                      <Label htmlFor="organizer" className="text-sm font-semibold text-mainTextV1">
                        Organizer <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="organizer"
                        name="organizer"
                        value={formData.organizer || ""}
                        onChange={handleChange}
                        placeholder="Enter event organizer"
                        className={`mt-1 ${errors.organizer ? 'border-red-500' : ''}`}
                      />
                      {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}

          <div className="flex gap-2 pt-4 justify-end">
            {!isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={handleEdit}
                  className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                >
                  <IconEdit className="h-4 w-4" />
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isUpdating}
                  className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                >
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
        </DialogContent>
      </Dialog>
    </>
  );
}; 
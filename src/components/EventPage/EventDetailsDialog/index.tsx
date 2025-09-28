"use client";

import { useEffect, useState } from "react";
import { useGetEventById, useUpdateEvent } from "@/hooks/useEvent";
import { useCreateDatasetItem } from "@/hooks/useDataset";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IUpdateEventBody } from "@/interface/request/event";
import { ICreateDatasetItemBody } from "@/interface/request/dataset";
import { toast } from "react-toastify";
import { IconEdit, IconTablePlus, IconLoader2 } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventTable } from "./EventTable";
import { EventForm } from "./EventForm";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess?: () => void;
}

export const EventDetailsDialog = ({ isOpen, onClose, eventId, onSuccess }: EventDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
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
  const { mutate: updateEventMutation, isPending: isUpdating } = useUpdateEvent();
  const { mutate: createDatasetItemMutation, isPending: isCreatingDataset } = useCreateDatasetItem();

  const handleFormDataChange = (newFormData: IUpdateEventBody) => {
    setFormData(newFormData);
  };

  const handleErrorsChange = (newErrors: Record<string, string>) => {
    setErrors(newErrors);
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

  const handleSubmit = () => {
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

  const handleAddToDataset = () => {
    if (!eventData?.data) {
      toast.error("Event data not available");
      return;
    }

    const event = eventData.data;
    
    // Generate automatic key based on event title and current timestamp
    const timestamp = new Date().getTime();
    const key = `event_${event.title.toLowerCase().replace(/\s+/g, '_')}_${timestamp}`;
    
    // Create value from event title and description
    const value = `${event.title} - ${event.description}`;
    
    const datasetPayload: ICreateDatasetItemBody = {
      key,
      value,
      category: "event",
      department: event.department?._id || undefined,
    };

    createDatasetItemMutation(datasetPayload, {
      onSuccess: (response) => {
        toast.success("Event added to dataset successfully!");
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "An error occurred while adding event to dataset!");
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
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">
            {isEditing ? "Edit Event" : "Event Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isEditing ? (
            <EventForm
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
              {eventData?.data && <EventTable event={eventData.data} />}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button onClick={handleEdit} className="bg-mainTextHoverV1 hover:bg-primary/90 text-white">
                  <IconEdit className="h-4 w-4" />
                  Edit event
                </Button>
                <Button 
                  onClick={handleAddToDataset}
                  disabled={isCreatingDataset}
                  className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                >
                  {isCreatingDataset ? (
                    <>
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <IconTablePlus className="h-4 w-4" />
                      Add to Dataset
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
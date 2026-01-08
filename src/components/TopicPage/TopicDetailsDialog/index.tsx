"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetTopicById, useUpdateTopic } from "@/hooks/useTopic";
import { IUpdateTopicBody } from "@/interface/request/topic";
import { toast } from "react-toastify";
import { IconEdit } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TopicTable } from "./TopicTable";
import { TopicForm } from "./TopicForm";

interface TopicDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  onSuccess?: () => void;
  isCoordinator?: boolean;
}

export const TopicDetailsDialog = ({
  isOpen,
  onClose,
  topicId,
  onSuccess,
  isCoordinator = false,
}: TopicDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateTopicBody>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: topicData, isLoading: isLoadingTopic } =
    useGetTopicById(topicId);
  const { mutate: updateTopicMutation, isPending: isUpdating } =
    useUpdateTopic();

  useEffect(() => {
    if (topicData?.data) {
      const topic = topicData.data;
      setFormData({
        title: topic.title,
        description: topic.description,
        type: topic.type,
        department: topic.department?._id || null,
        startDate: topic.startDate,
        endDate: topic.endDate,
        applicationDeadline: topic.applicationDeadline,
        location: topic.location,
        organizer: topic.organizer,
        requirements: topic.requirements,
        value: topic.value,
        provider: topic.provider,
        eligibility: topic.eligibility,
        applicationProcess: topic.applicationProcess,
        isImportant: topic.isImportant,
        company: topic.company,
        salary: topic.salary,
        position: topic.position,
        contactInfo: topic.contactInfo,
      });
    }
  }, [topicData]);

  const handleFormDataChange = (newFormData: IUpdateTopicBody) => {
    setFormData(newFormData);
  };

  const handleErrorsChange = (newErrors: Record<string, string>) => {
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.type === "event") {
      if (
        formData.startDate &&
        formData.endDate &&
        new Date(formData.endDate) <= new Date(formData.startDate)
      ) {
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

    // Clean up form data - only send fields that have values
    const submitData: IUpdateTopicBody = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof IUpdateTopicBody];
      if (value !== undefined && value !== null && value !== "") {
        (submitData as any)[key] = value;
      } else if (key === "department") {
        (submitData as any)[key] = null;
      }
    });

    updateTopicMutation(
      { id: topicId, data: submitData },
      {
        onSuccess: () => {
          toast.success("Topic updated successfully!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.message ||
            error?.response?.data?.message ||
            "There was an error updating the topic!";
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
    if (topicData?.data) {
      const topic = topicData.data;
      setFormData({
        title: topic.title,
        description: topic.description,
        type: topic.type,
        department: topic.department?._id || null,
        startDate: topic.startDate,
        endDate: topic.endDate,
        applicationDeadline: topic.applicationDeadline,
        location: topic.location,
        organizer: topic.organizer,
        requirements: topic.requirements,
        value: topic.value,
        provider: topic.provider,
        eligibility: topic.eligibility,
        applicationProcess: topic.applicationProcess,
        isImportant: topic.isImportant,
        company: topic.company,
        salary: topic.salary,
        position: topic.position,
        contactInfo: topic.contactInfo,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-800">
            {isEditing ? "Edit Topic" : "Topic Details"}
          </DialogTitle>
        </DialogHeader>

        {isLoadingTopic ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {isEditing ? (
              <TopicForm
                formData={formData}
                errors={errors}
                isUpdating={isUpdating}
                isCoordinator={isCoordinator}
                onFormDataChange={handleFormDataChange}
                onErrorsChange={handleErrorsChange}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {topicData?.data && <TopicTable topic={topicData.data} />}
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    onClick={handleEdit}
                    className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                  >
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit Topic
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

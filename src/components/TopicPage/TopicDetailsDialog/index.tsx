"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetTopicById, useUpdateTopic } from "@/hooks/useTopic";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { IUpdateTopicBody } from "@/interface/request/topic";
import { TopicType } from "@/interface/response/topic";
import { toast } from "react-toastify";
import { IconLoader2, IconFileText, IconEdit, IconCheck } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TopicDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  onSuccess?: () => void;
}

const topicTypes: TopicType[] = [
  "event",
  "scholarship",
  "notification",
  "job",
  "advertisement",
  "internship",
  "recruitment",
  "volunteer",
  "extracurricular",
];

export const TopicDetailsDialog = ({ isOpen, onClose, topicId, onSuccess }: TopicDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateTopicBody>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: topicData, isLoading: isLoadingTopic } = useGetTopicById(topicId);
  const { data: departmentsData } = useGetAllDepartments(1, 1000);
  const { mutate: updateTopicMutation, isPending: isUpdating } = useUpdateTopic();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "department") {
      setFormData({ ...formData, [name]: value === "all-departments" ? null : value });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleDateTimeChange = (field: 'startDate' | 'endDate' | 'applicationDeadline', value: string) => {
    setFormData({ ...formData, [field]: convertToISOString(value) });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    // Type-specific validations
    if (formData.type === "event") {
      if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
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
      }
    });

    updateTopicMutation(
      { id: topicId, data: submitData },
      {
        onSuccess: (response) => {
          toast.success("Topic updated successfully!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.response?.data?.message || "There was an error updating the topic!";
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

  const renderTypeSpecificFields = () => {
    const topicType = formData.type || topicData?.data?.type;

    switch (topicType) {
      case "event":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-800">
                Start Date {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate ? convertFromISOString(formData.startDate) : ""}
                onChange={(e) => handleDateTimeChange("startDate", e.target.value)}
                disabled={!isEditing}
                className={`${errors.startDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">
                End Date {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                disabled={!isEditing}
                className={`${errors.endDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-800">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                placeholder="Enter event location"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer" className="text-gray-800">Organizer</Label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer || ""}
                onChange={handleChange}
                placeholder="Enter organizer name"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
          </>
        );

      case "scholarship":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-gray-800">
                Application Deadline {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="applicationDeadline"
                type="datetime-local"
                value={formData.applicationDeadline ? convertFromISOString(formData.applicationDeadline) : ""}
                onChange={(e) => handleDateTimeChange("applicationDeadline", e.target.value)}
                disabled={!isEditing}
                className={`${errors.applicationDeadline ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.applicationDeadline && <p className="text-red-500 text-sm">{errors.applicationDeadline}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-gray-800">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements || ""}
                onChange={handleChange}
                placeholder="Enter requirements"
                rows={3}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value" className="text-gray-800">Value</Label>
              <Input
                id="value"
                name="value"
                value={formData.value || ""}
                onChange={handleChange}
                placeholder="Enter scholarship value"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider" className="text-gray-800">Provider</Label>
              <Input
                id="provider"
                name="provider"
                value={formData.provider || ""}
                onChange={handleChange}
                placeholder="Enter provider organization"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibility" className="text-gray-800">Eligibility</Label>
              <Textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility || ""}
                onChange={handleChange}
                placeholder="Enter eligibility criteria"
                rows={3}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationProcess" className="text-gray-800">Application Process</Label>
              <Textarea
                id="applicationProcess"
                name="applicationProcess"
                value={formData.applicationProcess || ""}
                onChange={handleChange}
                placeholder="Enter application process"
                rows={3}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
          </>
        );

      case "notification":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-800">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate ? convertFromISOString(formData.startDate) : ""}
                onChange={(e) => handleDateTimeChange("startDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isImportant"
                checked={formData.isImportant || false}
                onCheckedChange={(checked) => handleCheckboxChange("isImportant", checked as boolean)}
                disabled={!isEditing}
              />
              <Label htmlFor="isImportant" className="text-gray-800 cursor-pointer">
                Mark as important
              </Label>
            </div>
          </>
        );

      case "job":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-800">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company || ""}
                onChange={handleChange}
                placeholder="Enter company name"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-800">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position || ""}
                onChange={handleChange}
                placeholder="Enter position title"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-gray-800">Salary</Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary || ""}
                onChange={handleChange}
                placeholder="Enter salary range"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-gray-800">Contact Info</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo || ""}
                onChange={handleChange}
                placeholder="Enter contact information"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-gray-800">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="datetime-local"
                value={formData.applicationDeadline ? convertFromISOString(formData.applicationDeadline) : ""}
                onChange={(e) => handleDateTimeChange("applicationDeadline", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
          </>
        );

      case "advertisement":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-800">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate ? convertFromISOString(formData.startDate) : ""}
                onChange={(e) => handleDateTimeChange("startDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-gray-800">Contact Info</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo || ""}
                onChange={handleChange}
                placeholder="Enter contact information"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
          </>
        );

      case "internship":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-800">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company || ""}
                onChange={handleChange}
                placeholder="Enter company name"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-gray-800">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position || ""}
                onChange={handleChange}
                placeholder="Enter internship position"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-800">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate ? convertFromISOString(formData.startDate) : ""}
                onChange={(e) => handleDateTimeChange("startDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-gray-800">Contact Info</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo || ""}
                onChange={handleChange}
                placeholder="Enter contact information"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-gray-800">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="datetime-local"
                value={formData.applicationDeadline ? convertFromISOString(formData.applicationDeadline) : ""}
                onChange={(e) => handleDateTimeChange("applicationDeadline", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
          </>
        );

      case "recruitment":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-800">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company || ""}
                onChange={handleChange}
                placeholder="Enter company name"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-gray-800">Contact Info</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo || ""}
                onChange={handleChange}
                placeholder="Enter contact information"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-gray-800">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="datetime-local"
                value={formData.applicationDeadline ? convertFromISOString(formData.applicationDeadline) : ""}
                onChange={(e) => handleDateTimeChange("applicationDeadline", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
          </>
        );

      case "volunteer":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-800">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate ? convertFromISOString(formData.startDate) : ""}
                onChange={(e) => handleDateTimeChange("startDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-800">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                placeholder="Enter activity location"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-gray-800">Contact Info</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo || ""}
                onChange={handleChange}
                placeholder="Enter contact information"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
          </>
        );

      case "extracurricular":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-800">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate ? convertFromISOString(formData.startDate) : ""}
                onChange={(e) => handleDateTimeChange("startDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-800">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                placeholder="Enter activity location"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer" className="text-gray-800">Organizer</Label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer || ""}
                onChange={handleChange}
                placeholder="Enter organizer name"
                disabled={!isEditing}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="large"
        className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-gray-800 flex items-center gap-2">
            <IconFileText className="h-5 w-5" />
            {isEditing ? `Edit Topic: ${topicData?.data?.title || ""}` : `Topic Details: ${topicData?.data?.title || ""}`}
          </DialogTitle>
        </DialogHeader>

        {isLoadingTopic ? (
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
              <Label htmlFor="type" className="text-gray-800">
                Topic Type {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Select
                value={formData.type || topicData?.data?.type}
                onValueChange={(value) => handleSelectChange("type", value)}
                disabled={!isEditing || isUpdating}
              >
                <SelectTrigger className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}>
                  <SelectValue placeholder="Select topic type" />
                </SelectTrigger>
                <SelectContent>
                  {topicTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-800">
                Title {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                placeholder="Enter topic title"
                disabled={!isEditing}
                className={`${errors.title ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-800">
                Description {isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Enter topic description"
                rows={4}
                disabled={!isEditing}
                className={`${errors.description ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-800">Department</Label>
              <Select
                value={formData.department || "all-departments"}
                onValueChange={(value) => handleSelectChange("department", value)}
                disabled={!isEditing || isUpdating}
              >
                <SelectTrigger className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${!isEditing ? 'bg-gray-50' : ''}`}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-departments">All Departments (General)</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderTypeSpecificFields()}

            {!isLoadingTopic && (
              <>
                <div className="space-y-2">
                  <Label className="text-gray-800">Created At</Label>
                  <Input
                    value={new Date(topicData?.data?.createdAt || "").toLocaleDateString('en-US', {
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
                <div className="space-y-2">
                  <Label className="text-gray-800">Updated At</Label>
                  <Input
                    value={new Date(topicData?.data?.updatedAt || "").toLocaleDateString('en-US', {
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
              </>
            )}

            <div className="flex gap-2 justify-end pt-4">
              {!isEditing ? (
                <>
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button onClick={handleEdit} className="bg-mainTextHoverV1 hover:bg-primary/90 text-white">
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit Topic
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isUpdating} className="bg-mainTextHoverV1 hover:bg-primary/90 text-white">
                    {isUpdating ? (
                      <>
                        <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <IconCheck className="h-4 w-4 mr-2" />
                        Save Changes
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


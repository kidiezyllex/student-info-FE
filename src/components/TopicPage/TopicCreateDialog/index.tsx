"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateTopic } from "@/hooks/useTopic";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { ICreateTopicBody } from "@/interface/request/topic";
import { TopicType } from "@/interface/response/topic";
import { toast } from "react-toastify";
import { IconLoader2, IconPlus, IconFileText } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TopicCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
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

export const TopicCreateDialog = ({ isOpen, onClose, onSuccess }: TopicCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateTopicBody>({
    title: "",
    description: "",
    type: "event",
    department: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createTopicMutation, isPending } = useCreateTopic();
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetAllDepartments(1, 1000);

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
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "department") {
      setFormData({ ...formData, [name]: value === "all-departments" ? null : value });
    } else if (name === "type") {
      // Reset type-specific fields when type changes
      setFormData({
        title: formData.title,
        description: formData.description,
        type: value as TopicType,
        department: formData.department,
      });
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

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Type-specific validations
    if (formData.type === "event") {
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required for events";
      }
      if (!formData.endDate) {
        newErrors.endDate = "End date is required for events";
      }
      if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (formData.type === "scholarship") {
      if (!formData.applicationDeadline) {
        newErrors.applicationDeadline = "Application deadline is required for scholarships";
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

    createTopicMutation(formData, {
      onSuccess: (response) => {
        toast.success("Topic created successfully!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "An error occurred while creating topic");
      },
    });
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      type: "event",
      department: null,
    });
    setErrors({});
    onClose();
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case "event":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-800">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate ? convertFromISOString(formData.startDate) : ""}
                onChange={(e) => handleDateTimeChange("startDate", e.target.value)}
                className={`${errors.startDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
              />
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                className={`${errors.endDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
          </>
        );

      case "scholarship":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-gray-800">
                Application Deadline <span className="text-red-500">*</span>
              </Label>
              <Input
                id="applicationDeadline"
                type="datetime-local"
                value={formData.applicationDeadline ? convertFromISOString(formData.applicationDeadline) : ""}
                onChange={(e) => handleDateTimeChange("applicationDeadline", e.target.value)}
                className={`${errors.applicationDeadline ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isImportant"
                checked={formData.isImportant || false}
                onCheckedChange={(checked) => handleCheckboxChange("isImportant", checked as boolean)}
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-gray-800">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="datetime-local"
                value={formData.applicationDeadline ? convertFromISOString(formData.applicationDeadline) : ""}
                onChange={(e) => handleDateTimeChange("applicationDeadline", e.target.value)}
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-800">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate ? convertFromISOString(formData.startDate) : ""}
                onChange={(e) => handleDateTimeChange("startDate", e.target.value)}
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-gray-800">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="datetime-local"
                value={formData.applicationDeadline ? convertFromISOString(formData.applicationDeadline) : ""}
                onChange={(e) => handleDateTimeChange("applicationDeadline", e.target.value)}
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-gray-800">Application Deadline</Label>
              <Input
                id="applicationDeadline"
                type="datetime-local"
                value={formData.applicationDeadline ? convertFromISOString(formData.applicationDeadline) : ""}
                onChange={(e) => handleDateTimeChange("applicationDeadline", e.target.value)}
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate ? convertFromISOString(formData.endDate) : ""}
                onChange={(e) => handleDateTimeChange("endDate", e.target.value)}
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
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
            Create New Topic
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 h-full">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-800">
              Topic Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              disabled={isPending}
            >
              <SelectTrigger className="border-lightBorderV1 focus:border-mainTextHoverV1">
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
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter topic title"
              className={`${errors.title ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-800">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter topic description"
              rows={4}
              className={`${errors.description ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-gray-800">Department</Label>
            {isLoadingDepartments ? (
              <div className="h-10 w-full bg-gray-100 animate-pulse rounded" />
            ) : (
              <Select
                value={formData.department || "all-departments"}
                onValueChange={(value) => handleSelectChange("department", value)}
                disabled={isPending || isLoadingDepartments}
              >
                <SelectTrigger className="border-lightBorderV1 focus:border-mainTextHoverV1">
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
            )}
          </div>

          {renderTypeSpecificFields()}

          <div className="flex flex-1 h-full gap-2 justify-end mt-4">
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
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              {isPending ? (
                <>
                  <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Create Topic
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


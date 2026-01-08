"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { IUpdateTopicBody } from "@/interface/request/topic";
import { TopicType } from "@/interface/response/topic";
import { IconLoader2, IconCheck } from "@tabler/icons-react";

interface TopicFormProps {
  formData: IUpdateTopicBody;
  errors: Record<string, string>;
  isUpdating: boolean;
  isCoordinator?: boolean;
  onFormDataChange: (data: IUpdateTopicBody) => void;
  onErrorsChange: (errors: Record<string, string>) => void;
  onSubmit: () => void;
  onCancel: () => void;
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

export const TopicForm = ({
  formData,
  errors,
  isUpdating,
  isCoordinator = false,
  onFormDataChange,
  onErrorsChange,
  onSubmit,
  onCancel,
}: TopicFormProps) => {
  const { data: departmentsData } = useGetAllDepartments(1, 1000);
  const departments = departmentsData?.data || [];

  const convertToISOString = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return "";
    return new Date(dateTimeLocal).toISOString();
  };

  const convertFromISOString = (isoString: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    onFormDataChange(newFormData);

    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    let newFormData = { ...formData };
    if (name === "department") {
      newFormData[name] = value === "all-departments" ? null : value;
    } else {
      (newFormData as any)[name] = value;
    }
    onFormDataChange(newFormData);

    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleDateTimeChange = (
    field: "startDate" | "endDate" | "applicationDeadline",
    value: string
  ) => {
    const newFormData = { ...formData, [field]: convertToISOString(value) };
    onFormDataChange(newFormData);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    const newFormData = { ...formData, [name]: checked };
    onFormDataChange(newFormData);
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case "event":
      case "extracurricular":
      case "volunteer":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-gray-800">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={
                    formData.startDate
                      ? convertFromISOString(formData.startDate)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateTimeChange("startDate", e.target.value)
                  }
                  className="border-lightBorderV1 focus:border-mainTextHoverV1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-800">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={
                    formData.endDate
                      ? convertFromISOString(formData.endDate)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateTimeChange("endDate", e.target.value)
                  }
                  className={`${
                    errors.endDate ? "border-red-500" : "border-lightBorderV1"
                  } focus:border-mainTextHoverV1`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">{errors.endDate}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-800">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                placeholder="Enter location"
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer" className="text-gray-800">
                Organizer
              </Label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer || ""}
                onChange={handleChange}
                placeholder="Enter organizer"
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            {formData.type === "volunteer" && (
              <div className="space-y-2">
                <Label htmlFor="contactInfo" className="text-gray-800">
                  Contact Info
                </Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo || ""}
                  onChange={handleChange}
                  placeholder="Enter contact info"
                  className="border-lightBorderV1 focus:border-mainTextHoverV1"
                />
              </div>
            )}
          </>
        );

      case "scholarship":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline" className="text-gray-800">
                Application Deadline
              </Label>
              <Input
                id="applicationDeadline"
                type="datetime-local"
                value={
                  formData.applicationDeadline
                    ? convertFromISOString(formData.applicationDeadline)
                    : ""
                }
                onChange={(e) =>
                  handleDateTimeChange("applicationDeadline", e.target.value)
                }
                className="border-lightBorderV1 focus:border-mainTextHoverV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-gray-800">
                Requirements
              </Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value" className="text-gray-800">
                  Value
                </Label>
                <Input
                  id="value"
                  name="value"
                  value={formData.value || ""}
                  onChange={handleChange}
                  placeholder="Value"
                  className="border-lightBorderV1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider" className="text-gray-800">
                  Provider
                </Label>
                <Input
                  id="provider"
                  name="provider"
                  value={formData.provider || ""}
                  onChange={handleChange}
                  placeholder="Provider"
                  className="border-lightBorderV1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibility" className="text-gray-800">
                Eligibility
              </Label>
              <Textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility || ""}
                onChange={handleChange}
                rows={2}
                className="border-lightBorderV1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationProcess" className="text-gray-800">
                Application Process
              </Label>
              <Textarea
                id="applicationProcess"
                name="applicationProcess"
                value={formData.applicationProcess || ""}
                onChange={handleChange}
                rows={2}
                className="border-lightBorderV1"
              />
            </div>
          </>
        );

      case "job":
      case "internship":
      case "recruitment":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-800">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  placeholder="Company"
                  className="border-lightBorderV1"
                />
              </div>
              {(formData.type === "job" || formData.type === "internship") && (
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-gray-800">
                    Position
                  </Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position || ""}
                    onChange={handleChange}
                    placeholder="Position"
                    className="border-lightBorderV1"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactInfo" className="text-gray-800">
                  Contact Info
                </Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo || ""}
                  onChange={handleChange}
                  placeholder="Contact Info"
                  className="border-lightBorderV1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicationDeadline" className="text-gray-800">
                  Application Deadline
                </Label>
                <Input
                  id="applicationDeadline"
                  type="datetime-local"
                  value={
                    formData.applicationDeadline
                      ? convertFromISOString(formData.applicationDeadline)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateTimeChange("applicationDeadline", e.target.value)
                  }
                  className="border-lightBorderV1"
                />
              </div>
            </div>
            {formData.type === "job" && (
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-gray-800">
                  Salary
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  value={formData.salary || ""}
                  onChange={handleChange}
                  placeholder="Salary"
                  className="border-lightBorderV1"
                />
              </div>
            )}
            {formData.type === "internship" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-800">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={
                      formData.startDate
                        ? convertFromISOString(formData.startDate)
                        : ""
                    }
                    onChange={(e) =>
                      handleDateTimeChange("startDate", e.target.value)
                    }
                    className="border-lightBorderV1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-gray-800">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={
                      formData.endDate
                        ? convertFromISOString(formData.endDate)
                        : ""
                    }
                    onChange={(e) =>
                      handleDateTimeChange("endDate", e.target.value)
                    }
                    className="border-lightBorderV1"
                  />
                </div>
              </div>
            )}
          </>
        );

      case "notification":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-gray-800">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={
                    formData.startDate
                      ? convertFromISOString(formData.startDate)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateTimeChange("startDate", e.target.value)
                  }
                  className="border-lightBorderV1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-800">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={
                    formData.endDate
                      ? convertFromISOString(formData.endDate)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateTimeChange("endDate", e.target.value)
                  }
                  className="border-lightBorderV1"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isImportant"
                checked={formData.isImportant || false}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("isImportant", checked as boolean)
                }
              />
              <Label
                htmlFor="isImportant"
                className="text-gray-800 cursor-pointer"
              >
                Mark as important
              </Label>
            </div>
          </>
        );

      case "advertisement":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-gray-800">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={
                    formData.startDate
                      ? convertFromISOString(formData.startDate)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateTimeChange("startDate", e.target.value)
                  }
                  className="border-lightBorderV1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-800">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={
                    formData.endDate
                      ? convertFromISOString(formData.endDate)
                      : ""
                  }
                  onChange={(e) =>
                    handleDateTimeChange("endDate", e.target.value)
                  }
                  className="border-lightBorderV1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-gray-800">
                Contact Info
              </Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo || ""}
                onChange={handleChange}
                placeholder="Contact Info"
                className="border-lightBorderV1"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type" className="text-gray-800">
          Topic Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleSelectChange("type", value)}
          disabled={isUpdating}
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
          className={`${
            errors.title ? "border-red-500" : "border-lightBorderV1"
          } focus:border-mainTextHoverV1`}
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
          placeholder="Enter description"
          rows={3}
          className={`${
            errors.description ? "border-red-500" : "border-lightBorderV1"
          } focus:border-mainTextHoverV1`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department" className="text-gray-800">
          Department
        </Label>
        <Select
          value={formData.department || "all-departments"}
          onValueChange={(value) => handleSelectChange("department", value)}
          disabled={isUpdating || isCoordinator}
        >
          <SelectTrigger className="border-lightBorderV1 focus:border-mainTextHoverV1">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-departments">
              All Departments (General)
            </SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept._id} value={dept._id}>
                {dept.name} ({dept.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {renderTypeSpecificFields()}

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isUpdating}>
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
      </div>
    </div>
  );
};

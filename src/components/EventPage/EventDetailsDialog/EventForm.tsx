"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { IUpdateEventBody } from "@/interface/request/event";
import { IconLoader2, IconCheck } from "@tabler/icons-react";

interface EventFormProps {
  formData: IUpdateEventBody;
  errors: Record<string, string>;
  isUpdating: boolean;
  onFormDataChange: (data: IUpdateEventBody) => void;
  onErrorsChange: (errors: Record<string, string>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const EventForm = ({
  formData,
  errors,
  isUpdating,
  onFormDataChange,
  onErrorsChange,
  onSubmit,
  onCancel,
}: EventFormProps) => {
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
    const newFormData = { ...formData, [name]: value };
    onFormDataChange(newFormData);

    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleDateTimeChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: convertToISOString(value) };
    onFormDataChange(newFormData);

    if (errors[field]) {
      const newErrors = { ...errors, [field]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const newFormData = { ...formData, [name]: value };
    onFormDataChange(newFormData);

    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  return (
    <div className="space-y-4">
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
            className={`mt-1 ${errors.title ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
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
            className={`${errors.description ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
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
            className={`mt-1 ${errors.startDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
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
            className={`mt-1 ${errors.endDate ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
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
            className={`mt-1 ${errors.location ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
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
            <SelectTrigger className={`${errors.department ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}>
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
            className={`mt-1 ${errors.organizer ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
          />
          {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isUpdating} className="bg-mainTextHoverV1 hover:bg-primary/90 text-white">
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
      </div>
    </div>
  );
};

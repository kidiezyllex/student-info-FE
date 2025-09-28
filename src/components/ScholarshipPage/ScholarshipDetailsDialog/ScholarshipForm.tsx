"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllDepartments } from "@/hooks/useDepartment";
import { IUpdateScholarshipBody } from "@/interface/request/scholarship";
import { IconLoader2, IconCheck } from "@tabler/icons-react";

interface ScholarshipFormProps {
  formData: IUpdateScholarshipBody;
  errors: Record<string, string>;
  isUpdating: boolean;
  onFormDataChange: (data: IUpdateScholarshipBody) => void;
  onErrorsChange: (errors: Record<string, string>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ScholarshipForm = ({
  formData,
  errors,
  isUpdating,
  onFormDataChange,
  onErrorsChange,
  onSubmit,
  onCancel,
}: ScholarshipFormProps) => {
  const { data: departmentsData } = useGetAllDepartments();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    onFormDataChange(newFormData);

    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
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
        <div className="space-y-2">
          <Label htmlFor="title" className="text-mainTextV1">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter scholarship title"
            className={`${errors.title ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider" className="text-mainTextV1">
            Provider <span className="text-red-500">*</span>
          </Label>
          <Input
            id="provider"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            placeholder="Enter scholarship provider"
            className={`${errors.provider ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
          />
          {errors.provider && (
            <p className="text-red-500 text-sm">{errors.provider}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-mainTextV1">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter scholarship description"
          rows={3}
          className={`${errors.description ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value" className="text-mainTextV1">
            Value <span className="text-red-500">*</span>
          </Label>
          <Input
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="Enter scholarship value"
            className={`${errors.value ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
          />
          {errors.value && (
            <p className="text-red-500 text-sm">{errors.value}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationDeadline" className="text-mainTextV1">
            Application Deadline <span className="text-red-500">*</span>
          </Label>
          <Input
            id="applicationDeadline"
            name="applicationDeadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={handleChange}
            className={`${errors.applicationDeadline ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
          />
          {errors.applicationDeadline && (
            <p className="text-red-500 text-sm">{errors.applicationDeadline}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department" className="text-mainTextV1">
          Department <span className="text-red-500">*</span>
        </Label>
        <Select value={formData.department || undefined} onValueChange={(value) => handleSelectChange("department", value || "")}>
          <SelectTrigger className={`${errors.department ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departmentsData?.data?.map((department) => (
              <SelectItem key={department._id} value={department._id}>
                {department.name} ({department.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department && (
          <p className="text-red-500 text-sm">{errors.department}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements" className="text-mainTextV1">
          Requirements <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="Enter scholarship requirements"
          rows={3}
          className={`${errors.requirements ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
        />
        {errors.requirements && (
          <p className="text-red-500 text-sm">{errors.requirements}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="eligibility" className="text-mainTextV1">
          Eligibility <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="eligibility"
          name="eligibility"
          value={formData.eligibility}
          onChange={handleChange}
          placeholder="Enter eligibility criteria"
          rows={3}
          className={`${errors.eligibility ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
        />
        {errors.eligibility && (
          <p className="text-red-500 text-sm">{errors.eligibility}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="applicationProcess" className="text-mainTextV1">
          Application Process <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="applicationProcess"
          name="applicationProcess"
          value={formData.applicationProcess}
          onChange={handleChange}
          placeholder="Enter application process"
          rows={3}
          className={`${errors.applicationProcess ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
        />
        {errors.applicationProcess && (
          <p className="text-red-500 text-sm">{errors.applicationProcess}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isUpdating}>
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

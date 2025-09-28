"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetUsersByRole } from "@/hooks/useUser";
import { IUpdateDepartmentBody } from "@/interface/request/department";
import { IconLoader2, IconCheck } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentFormProps {
  formData: IUpdateDepartmentBody;
  errors: Record<string, string>;
  isUpdating: boolean;
  departmentId: string;
  onFormDataChange: (data: IUpdateDepartmentBody) => void;
  onErrorsChange: (errors: Record<string, string>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const DepartmentForm = ({
  formData,
  errors,
  isUpdating,
  departmentId,
  onFormDataChange,
  onErrorsChange,
  onSubmit,
  onCancel,
}: DepartmentFormProps) => {
  const { data: coordinatorsData, isLoading: isLoadingCoordinators } = useGetUsersByRole('coordinator');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    onFormDataChange(newFormData);

    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleCoordinatorChange = (value: string) => {
    const newFormData = { ...formData, coordinatorId: value };
    onFormDataChange(newFormData);
    if (errors.coordinatorId) {
      const newErrors = { ...errors, coordinatorId: "" };
      onErrorsChange(newErrors);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-mainTextV1">
          Department name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter department name"
          className={`${errors.name ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="code" className="text-mainTextV1">
          Department code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Enter department code"
          className={`${errors.code ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
        />
        {errors.code && (
          <p className="text-red-500 text-sm">{errors.code}</p>
        )}
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
          placeholder="Enter description"
          rows={3}
          className={`${errors.description ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      {/* Coordinator Information */}
      <div className="space-y-2">
        <Label className="text-mainTextV1">
          Coordinator <span className="text-red-500">*</span>
        </Label>
        {isLoadingCoordinators ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={formData.coordinatorId || ""}
            onValueChange={handleCoordinatorChange}
            disabled={isUpdating || isLoadingCoordinators}
          >
            <SelectTrigger className={`${errors.coordinatorId ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}>
              <SelectValue placeholder="Select a coordinator" />
            </SelectTrigger>
            <SelectContent>
              {coordinatorsData?.data?.length === 0 && (
                <SelectItem value="" disabled>
                  No coordinators found
                </SelectItem>
              )}
              {coordinatorsData?.data
                ?.filter(
                  (user) =>
                    !user.department ||
                    user.department._id === departmentId
                )
                .map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.name}
                  {
                    user.department?.name && (
                      <span className="font-semibold ml-1">({user.department.name})</span>
                    )
                  }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.coordinatorId && (
          <p className="text-red-500 text-sm">{errors.coordinatorId}</p>
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

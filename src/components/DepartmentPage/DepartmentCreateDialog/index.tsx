"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDepartment } from "@/hooks/useDepartment";
import { ICreateDepartmentBody } from "@/interface/request/department";
import { toast } from "react-toastify";
import { IconLoader2, IconBuilding, IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersByRole } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DepartmentCreateDialog = ({ isOpen, onClose, onSuccess }: DepartmentCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateDepartmentBody>({
    name: "",
    code: "",
    description: "",
    coordinatorId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createDepartmentMutation, isPending } = useCreateDepartment();
  const { data: coordinatorsData, isLoading: isLoadingCoordinators } = useGetUsersByRole('coordinator');
  useEffect(() => {
    if (formData.name) {
      const words = formData.name.split(" ");
      const generatedCode = words.map((word) => word.charAt(0)).join("").toUpperCase();
      setFormData((prevData) => ({ ...prevData, code: generatedCode }));
    } else {
      setFormData((prevData) => ({ ...prevData, code: "" }));
    }
  }, [formData.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Department code is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.coordinatorId?.trim()) {
      newErrors.coordinatorId = "Coordinator is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createDepartmentMutation(formData, {
      onSuccess: (response) => {
        toast.success("Create department successfully!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "An error occurred while creating department");
      },
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      coordinatorId: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Add new department</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1 h-full">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-800">
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
            <Label htmlFor="code" className="text-gray-800">
              Department code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter department code (e.g. IT, CS, EE)"
              className={`${errors.code ? 'border-red-500' : 'border-lightBorderV1'} focus:border-mainTextHoverV1`}
              disabled // Disable manual editing
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code}</p>
            )}
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
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinatorId" className="text-gray-800">
              Coordinator <span className="text-red-500">*</span>
            </Label>
            {isLoadingCoordinators ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={formData.coordinatorId || ""}
                onValueChange={(value) => setFormData({ ...formData, coordinatorId: value })}
                disabled={isPending || isLoadingCoordinators}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a coordinator" />
                </SelectTrigger>
                <SelectContent>
                  {coordinatorsData?.data?.length === 0 && (
                    <SelectItem value="" disabled>
                      No coordinators found
                    </SelectItem>
                  )}
                  {coordinatorsData?.data.map((user) => (
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

          <div className="flex flex-1 h-full gap-2 justify-end">
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
              ) :
                <>
                  <IconPlus className="h-4 w-4" />
                  Create department
                </>
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 
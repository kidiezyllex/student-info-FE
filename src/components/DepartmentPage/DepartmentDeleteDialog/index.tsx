"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconLoader2, IconTrash, IconAlertTriangle } from "@tabler/icons-react";
import { toast } from "react-toastify";

interface DepartmentDeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<any>;
}

export const DepartmentDeleteDialog = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DepartmentDeleteDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast.success("Delete department successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "There was an error deleting the department!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">Confirm delete department</DialogTitle>
        </DialogHeader>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <IconAlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Warning:</p>
              <p>This action cannot be undone. All data related to this department will be deleted permanently.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <IconLoader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <IconTrash className="h-4 w-4" />
                Delete department
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 
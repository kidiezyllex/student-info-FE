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

interface DeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<any>;
  title: string;
  description: string;
  confirmText: string;
  successMessage: string;
  errorMessage: string;
  warningMessage?: string;
}

export const DeleteDialog = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  successMessage,
  errorMessage,
  warningMessage,
}: DeleteDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast.success(successMessage);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">{title}</DialogTitle>
        </DialogHeader>

        {warningMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <IconAlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Warning:</p>
                <p>{warningMessage}</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 !bg-transparent"
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
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 
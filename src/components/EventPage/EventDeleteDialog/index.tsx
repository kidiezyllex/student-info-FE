"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconLoader2, IconTrash } from "@tabler/icons-react";
import { toast } from "react-toastify";

interface EventDeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<any>;
}

export const EventDeleteDialog = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: EventDeleteDialogProps) => {
  const handleDelete = async () => {
    try {
      const response = await onConfirm();
      if (response?.statusCode === 200 || response?.statusCode === 201) {
        toast.success(response.message || "Xóa sự kiện thành công!");
        onClose();
      } else if (response?.statusCode === 500) {
        toast.error(response.message || "Lỗi hệ thống, vui lòng thử lại sau");
      } else {
        toast.error(response.message || "Xóa sự kiện thất bại");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi xóa sự kiện";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            Confirm delete event
          </DialogTitle>
          <DialogDescription className="text-secondaryTextV1 pt-2">
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 p-4 my-4 rounded-sm border border-red-200">
          <p className="text-mainTextV1 text-sm">
            When deleting an event, all related data will be permanently deleted from the system and cannot be recovered.
          </p>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting} className="text-secondaryTextV1">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <IconLoader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <IconTrash className="h-4 w-4" />
                Delete event
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 
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

interface UserDeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<any>;
}

export const UserDeleteDialog = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: UserDeleteDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast.success("Xóa người dùng thành công!");
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa người dùng!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">Xác nhận xóa người dùng</DialogTitle>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <IconAlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Cảnh báo:</p>
              <p>Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.</p>
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
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <IconTrash className="mr-2 h-4 w-4" />
                Xóa người dùng
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 
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

interface HomeContractDeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const HomeContractDeleteDialog = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: HomeContractDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            Xác nhận xóa hợp đồng
          </DialogTitle>
          <DialogDescription className="text-secondaryTextV1 pt-2">
            Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 p-4 my-4 rounded-sm border border-red-200">
          <p className="text-mainTextV1 text-sm">
            Khi xóa hợp đồng, tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
          </p>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting} className="text-secondaryTextV1">
              Hủy
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <IconTrash className="mr-2 h-4 w-4" />
                Xóa
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 
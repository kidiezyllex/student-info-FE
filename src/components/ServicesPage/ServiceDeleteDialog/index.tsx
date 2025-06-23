"use client";

import { motion } from 'framer-motion';
import { IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ServiceDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const ServiceDeleteDialog = ({ isOpen, onClose, onConfirm, isDeleting }: ServiceDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-mainTextV1">
            Xác nhận xóa dịch vụ
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <IconAlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-800">
                Cảnh báo: Hành động này không thể hoàn tác
              </p>
              <p className="text-sm text-red-700">
                Bạn có chắc chắn muốn xóa dịch vụ này? Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa dịch vụ'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDeleteDialog; 
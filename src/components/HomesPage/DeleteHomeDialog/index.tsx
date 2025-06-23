"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDeleteHome } from '@/hooks/useHome';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconTrash, IconAlertTriangle, IconLoader2 } from '@tabler/icons-react';

interface DeleteHomeDialogProps {
  homeId: string;
  homeName: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const DeleteHomeDialog = ({ homeId, homeName, onSuccess, trigger }: DeleteHomeDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteHome();

  const handleDelete = () => {
    mutate(
      { id: homeId },
      {
        onSuccess: (response) => {
          setOpen(false);
          toast.success('Xóa căn hộ thành công!');
          
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/admin/homes');
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message || 'Không thể xóa căn hộ'}`);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            className="bg-mainDangerV1 text-white hover:bg-mainDangerHoverV1 border-none"
          >
            <IconTrash className="h-4 w-4" />
            Xóa căn hộ
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-mainDangerV1">
            Xác nhận xóa căn hộ
          </DialogTitle>
          <DialogDescription className="text-secondaryTextV1 pt-2">
            Bạn có chắc chắn muốn xóa căn hộ <span className="font-medium text-mainTextV1">&quot;{homeName}&quot;</span>? 
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-mainBackgroundV1 p-4 my-4 rounded-sm border border-mainDangerV1/20">
          <p className="text-mainTextV1 text-sm">
            Khi xóa căn hộ, tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
          </p>
        </div>
        
        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Hủy
            </Button>
          </DialogClose>
          
          <Button 
            type="button" 
            onClick={handleDelete}
            className="bg-mainDangerV1 hover:bg-mainDangerHoverV1"
            disabled={isPending}
          >
            {isPending ? (
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

export default DeleteHomeDialog; 
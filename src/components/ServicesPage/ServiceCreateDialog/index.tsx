"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconX, IconSettings } from '@tabler/icons-react';
import { useCreateService } from '@/hooks/useService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';

interface ServiceCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ServiceFormData {
  name: string;
  unit: string;
  description: string;
}

const ServiceCreateDialog = ({ isOpen, onClose, onSuccess }: ServiceCreateDialogProps) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    unit: '',
    description: ''
  });

  const { mutate: createServiceMutation, isPending: isCreating } = useCreateService();

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên dịch vụ');
      return;
    }
    
    if (!formData.unit.trim()) {
      toast.error('Vui lòng nhập đơn vị');
      return;
    }

    createServiceMutation(
      {
        name: formData.name.trim(),
        unit: formData.unit.trim(),
        description: formData.description.trim()
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 201) {
            toast.success('Tạo dịch vụ thành công');
            onSuccess();
            handleClose();
          } else {
            toast.error('Tạo dịch vụ thất bại');
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleClose = () => {
    setFormData({
      name: '',
      unit: '',
      description: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-mainBackgroundV1 border-lightBorderV1">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-mainTextV1">
            <IconSettings className="h-5 w-5" />
            Thêm dịch vụ mới
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-mainTextV1">
              Tên dịch vụ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Nhập tên dịch vụ..."
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border-lightBorderV1 focus:border-mainTextHoverV1"
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit" className="text-mainTextV1">
              Đơn vị <span className="text-red-500">*</span>
            </Label>
            <Input
              id="unit"
              type="text"
              placeholder="Nhập đơn vị (VD: tháng, lần, kg...)..."
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="border-lightBorderV1 focus:border-mainTextHoverV1"
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-mainTextV1">
              Mô tả
            </Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả dịch vụ..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="border-lightBorderV1 focus:border-mainTextHoverV1 min-h-[80px]"
              disabled={isCreating}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-mainTextHoverV1 hover:bg-primary/90"
            >
              {isCreating ? 'Đang tạo...' : 'Tạo dịch vụ'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCreateDialog; 
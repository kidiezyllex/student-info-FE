"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconSettings, IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import { useGetServiceDetail, useUpdateService } from '@/hooks/useService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';

interface ServiceDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
  onSuccess: () => void;
}

interface ServiceFormData {
  name: string;
  unit: string;
  description: string;
}

const ServiceDetailsDialog = ({ isOpen, onClose, serviceId, onSuccess }: ServiceDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    unit: '',
    description: ''
  });

  const { data: serviceDetail, isLoading, error } = useGetServiceDetail({ id: serviceId || '' });
  const { mutate: updateServiceMutation, isPending: isUpdating } = useUpdateService();

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    } else if (isOpen && serviceId) {
      setIsEditing(false);
    }
  }, [isOpen, serviceId]);

  useEffect(() => {
    if (serviceDetail?.data) {
      setFormData({
        name: serviceDetail.data.name || '',
        unit: serviceDetail.data.unit || '',
        description: serviceDetail.data.description || ''
      });
    }
  }, [serviceDetail]);

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditing) {
      return;
    }
    
    if (!serviceId) {
      toast.error('Không tìm thấy ID dịch vụ');
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên dịch vụ');
      return;
    }
    
    if (!formData.unit.trim()) {
      toast.error('Vui lòng nhập đơn vị');
      return;
    }

    const updateData = {
      params: { id: serviceId },
      body: {
        name: formData.name.trim(),
        unit: formData.unit.trim(),
        description: formData.description.trim()
      }
    };

    updateServiceMutation(
      updateData,
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success('Cập nhật dịch vụ thành công');
            onSuccess();
            setIsEditing(false);
          } else {
            console.error('Update failed with status:', data.statusCode, data.message);
            toast.error(`Cập nhật dịch vụ thất bại: ${data.message || 'Lỗi không xác định'}`);
          }
        },
        onError: (error) => {
          console.error('Update service error:', error);
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleCancelEdit = () => {
    if (serviceDetail?.data) {
      setFormData({
        name: serviceDetail.data.name || '',
        unit: serviceDetail.data.unit || '',
        description: serviceDetail.data.description || ''
      });
    }
    setIsEditing(false);
  };

  if (!isOpen || !serviceId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-mainBackgroundV1 border-lightBorderV1">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? 'Chỉnh sửa dịch vụ' : 'Chi tiết dịch vụ'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Không thể tải thông tin dịch vụ</p>
          </div>
        ) : (
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
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${
                  isEditing 
                    ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                disabled={!isEditing || isUpdating}
                readOnly={!isEditing}
                placeholder={isEditing ? "Nhập tên dịch vụ..." : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-mainTextV1">
                Đơn vị <span className="text-red-500">*</span>
              </Label>
              <Input
                id="unit"
                type="text"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 ${
                  isEditing 
                    ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                disabled={!isEditing || isUpdating}
                readOnly={!isEditing}
                placeholder={isEditing ? "Nhập đơn vị..." : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-mainTextV1">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`border-lightBorderV1 focus:border-mainTextHoverV1 min-h-[80px] ${
                  isEditing 
                    ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                disabled={!isEditing || isUpdating}
                readOnly={!isEditing}
                placeholder={isEditing ? "Nhập mô tả dịch vụ..." : ""}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                    disabled={isUpdating}
                  >
                    <IconX className="h-4 w-4" />
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-mainTextHoverV1 hover:bg-primary/90"
                  >
                    <IconCheck className="h-4 w-4" />
                    {isUpdating ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClose();
                    }}
                  >
                    Đóng
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-mainTextHoverV1 hover:bg-primary/90"
                  >
                    <IconEdit className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                </>
              )}
            </div>
          </motion.form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsDialog; 
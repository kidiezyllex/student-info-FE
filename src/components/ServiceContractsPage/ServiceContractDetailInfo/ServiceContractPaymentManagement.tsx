"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  IconCreditCard, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCheck, 
  IconX,
  IconCalendar,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetInvoicePaymentsByServiceContract, useCreateInvoicePayment, useUpdateInvoicePayment, useDeleteInvoicePayment } from '@/hooks/useInvoicePayment';
import { toast } from 'react-toastify';

interface ServiceContractPaymentManagementProps {
  serviceContractId: string;
  contractData: any;
  onRefresh?: () => void;
}

interface PaymentFormData {
  amount: number;
  dueDate: string;
  status: number;
  note: string;
}

const ServiceContractPaymentManagement = ({ serviceContractId, contractData, onRefresh }: ServiceContractPaymentManagementProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: 0,
    dueDate: '',
    status: 1,
    note: ''
  });

  const { data: paymentsData, isLoading, refetch } = useGetInvoicePaymentsByServiceContract({ serviceContractId });
  const { mutate: createPaymentMutation, isPending: isCreating } = useCreateInvoicePayment();
  const { mutate: updatePaymentMutation, isPending: isUpdating } = useUpdateInvoicePayment();
  const { mutate: deletePaymentMutation, isPending: isDeleting } = useDeleteInvoicePayment();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1: return { text: "Chưa thanh toán", color: "bg-yellow-100 text-yellow-800" };
      case 2: return { text: "Đã thanh toán", color: "bg-green-100 text-green-800" };
      default: return { text: "Không xác định", color: "bg-gray-100 text-gray-800" };
    }
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = useCallback(() => {
    setFormData({
      amount: contractData?.price || 0,
      dueDate: '',
      status: 1,
      note: ''
    });
  }, [contractData?.price]);

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    
    if (!formData.dueDate) {
      toast.error('Vui lòng chọn ngày đến hạn');
      return;
    }

    createPaymentMutation(
      {
        serviceContractId: serviceContractId,
        totalReceive: formData.amount,
        datePaymentExpec: formData.dueDate,
        statusPaym: formData.status,
        type: 2, // 2: Tiền dịch vụ
        note: formData.note
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 201) {
            toast.success('Tạo đợt thanh toán thành công');
            refetch();
            setIsCreateDialogOpen(false);
            resetForm();
            onRefresh?.();
          } else {
            toast.error('Tạo đợt thanh toán thất bại');
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleEditPayment = (payment: any) => {
    setSelectedPaymentId(payment._id);
    setFormData({
      amount: payment.totalReceive,
      dueDate: payment.datePaymentExpec.split('T')[0],
      status: payment.statusPaym,
      note: payment.note || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaymentId) return;
    
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    
    if (!formData.dueDate) {
      toast.error('Vui lòng chọn ngày đến hạn');
      return;
    }

    updatePaymentMutation(
      {
        params: { id: selectedPaymentId },
        body: {
          totalReceive: formData.amount,
          datePaymentExpec: formData.dueDate,
          statusPaym: formData.status,
          note: formData.note
        }
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success('Cập nhật đợt thanh toán thành công');
            refetch();
            setIsEditDialogOpen(false);
            setSelectedPaymentId(null);
            resetForm();
            onRefresh?.();
          } else {
            toast.error('Cập nhật đợt thanh toán thất bại');
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleDeletePayment = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePayment = () => {
    if (!selectedPaymentId) return;

    deletePaymentMutation(
      { id: selectedPaymentId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success('Xóa đợt thanh toán thành công');
            refetch();
            setIsDeleteDialogOpen(false);
            setSelectedPaymentId(null);
            onRefresh?.();
          } else {
            toast.error('Xóa đợt thanh toán thất bại');
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  useEffect(() => {
    resetForm();
  }, [contractData, resetForm]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const payments = paymentsData?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              Quản lý thanh toán dịch vụ
            </CardTitle>
            <Button onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}>
              <IconPlus className="h-4 w-4" />
              Thêm đợt thanh toán
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <IconCreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đợt thanh toán nào</h3>
              <p className="text-gray-500 mb-4">Hãy tạo đợt thanh toán đầu tiên cho hợp đồng dịch vụ này</p>
              <Button onClick={() => {
                resetForm();
                setIsCreateDialogOpen(true);
              }}>
                <IconPlus className="h-4 w-4" />
                Thêm đợt thanh toán
              </Button>
            </div>
          ) : (
            payments.map((payment: any, index: number) => {
              const statusInfo = getStatusInfo(payment.statusPaym);
              return (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <IconCurrencyDollar className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">{formatCurrency(payment.totalReceive)}</h4>
                        <p className="text-sm text-gray-500">
                          Đến hạn: {new Date(payment.datePaymentExpec).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusInfo.color}>
                        {statusInfo.text}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPayment(payment)}
                        className="h-8 w-8 p-0"
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePayment(payment._id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {payment.note && (
                    <p className="text-sm text-gray-600 mt-2">{payment.note}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Tạo: {new Date(payment.createdAt).toLocaleString('vi-VN')}
                  </p>
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Create Payment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-lightBorderV1">
          <DialogHeader>
            <DialogTitle>
            Thêm đợt thanh toán
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền <span className="text-red-500">*</span></Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                placeholder="Nhập số tiền..."
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Ngày đến hạn <span className="text-red-500">*</span></Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status.toString()} onValueChange={(value) => handleInputChange('status', Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Chưa thanh toán</SelectItem>
                  <SelectItem value="2">Đã thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Input
                id="note"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Nhập ghi chú..."
                disabled={isCreating}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                Hủy
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Đang tạo...' : 'Tạo đợt thanh toán'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-mainBackgroundV1 border-lightBorderV1">
          <DialogHeader>
            <DialogTitle>
              Cập nhật đợt thanh toán
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Số tiền <span className="text-red-500">*</span></Label>
              <Input
                id="edit-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                placeholder="Nhập số tiền..."
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Ngày đến hạn <span className="text-red-500">*</span></Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select value={formData.status.toString()} onValueChange={(value) => handleInputChange('status', Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Chưa thanh toán</SelectItem>
                  <SelectItem value="2">Đã thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-note">Ghi chú</Label>
              <Input
                id="edit-note"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Nhập ghi chú..."
                disabled={isUpdating}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-mainTextV1">
              Xác nhận xóa đợt thanh toán
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn xóa đợt thanh toán này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                Hủy
              </Button>
              <Button type="button" onClick={confirmDeletePayment} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ServiceContractPaymentManagement; 
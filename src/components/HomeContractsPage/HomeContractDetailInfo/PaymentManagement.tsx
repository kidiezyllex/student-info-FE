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
  IconCurrencyDollar,
  IconAlertTriangle
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetInvoicePaymentsByHomeContract, useCreateInvoicePayment, useUpdateInvoicePayment, useDeleteInvoicePayment } from '@/hooks/useInvoicePayment';
import { toast } from 'react-toastify';

interface PaymentManagementProps {
  contractId: string;
  contractData: any;
  onRefresh?: () => void;
}

interface PaymentFormData {
  amount: number;
  dueDate: string;
  status: number;
  note: string;
}

const PaymentManagement = ({ contractId, contractData, onRefresh }: PaymentManagementProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: 0,
    dueDate: '',
    status: 0,
    note: ''
  });

  const { data: paymentsData, isLoading, refetch } = useGetInvoicePaymentsByHomeContract({ homeContractId: contractId });
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
      case 0: return { text: "Chưa thanh toán", color: "bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-400 text-nowrap" };
      case 1: return { text: "Đã thanh toán", color: "bg-green-500 hover:bg-green-600 text-white border-2 border-green-400 text-nowrap" };
      case 2: return { text: "Quá hạn", color: "bg-red-500 hover:bg-red-600 text-white border-2 border-red-400 text-nowrap" };
      default: return { text: "Không xác định", color: "bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-400 text-nowrap" };
    }
  };

  const getPaymentTypeText = (type: number) => {
    switch (type) {
      case 1: return { text: "Tiền thuê nhà", color: "bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-400 text-nowrap" };
      case 2: return { text: "Tiền cọc", color: "bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-400 text-nowrap" };
      case 3: return { text: "Phí dịch vụ", color: "bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-400 text-nowrap" };
      default: return { text: "Khác", color: "bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-400 text-nowrap" };
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
      amount: contractData?.renta || 0,
      dueDate: '',
      status: 0,
      note: ''
    });
  }, [contractData?.renta]);

  // Business logic validation
  const validatePaymentUpdate = (payment: any, newStatus: number): { isValid: boolean; message?: string } => {
    const payments = paymentsData?.data || [];
    const currentDate = new Date();
    const dueDate = new Date(payment.datePaymentExpec);
    
    // Rule 1: Cannot update status if payment is not due yet
    if (newStatus === 1 && dueDate > currentDate) {
      return {
        isValid: false,
        message: 'Không thể cập nhật trạng thái "Đã thanh toán" cho khoản thanh toán chưa đến hạn'
      };
    }

    // Rule 2: Cannot mark as paid if there are unpaid previous payments
    const sortedPayments = [...payments].sort((a, b) => new Date(a.datePaymentExpec).getTime() - new Date(b.datePaymentExpec).getTime());
    const currentPaymentIndex = sortedPayments.findIndex(p => p._id === payment._id);
    
    if (newStatus === 1 && currentPaymentIndex > 0) {
      const previousPayments = sortedPayments.slice(0, currentPaymentIndex);
      const hasUnpaidPrevious = previousPayments.some(p => p.statusPaym === 0);
      
      if (hasUnpaidPrevious) {
        return {
          isValid: false,
          message: 'Không thể thanh toán khi còn các khoản thanh toán trước đó chưa được thanh toán'
        };
      }
    }

    // Rule 3: Automatically mark as overdue if past due date and not paid
    if (dueDate < currentDate && payment.statusPaym === 0 && newStatus !== 2) {
      return {
        isValid: true,
        message: 'Khoản thanh toán này đã quá hạn và sẽ được đánh dấu là "Quá hạn"'
      };
    }

    return { isValid: true };
  };

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

    // Business validation: Check if due date is reasonable
    const dueDate = new Date(formData.dueDate);
    const contractStart = new Date(contractData.dateStar);
    const contractEndMonths = contractData.duration || 12;
    const contractEnd = new Date(contractStart);
    contractEnd.setMonth(contractEnd.getMonth() + contractEndMonths);

    if (dueDate < contractStart) {
      toast.error('Ngày đến hạn không thể trước ngày bắt đầu hợp đồng');
      return;
    }

    if (dueDate > contractEnd) {
      toast.error('Ngày đến hạn không thể sau ngày kết thúc hợp đồng');
      return;
    }

    createPaymentMutation(
      {
        homeContractId: contractId,
        totalReceive: formData.amount,
        datePaymentExpec: formData.dueDate,
        statusPaym: formData.status,
        type: 1, // 1: Tiền thuê nhà
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
    setSelectedPayment(payment);
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
    
    if (!selectedPaymentId || !selectedPayment) return;
    
    if (!formData.amount || formData.amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    
    if (!formData.dueDate) {
      toast.error('Vui lòng chọn ngày đến hạn');
      return;
    }

    // Business validation
    const validation = validatePaymentUpdate(selectedPayment, formData.status);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    // Auto-correct status if overdue
    let finalStatus = formData.status;
    const dueDate = new Date(formData.dueDate);
    const currentDate = new Date();
    
    if (dueDate < currentDate && formData.status === 0) {
      finalStatus = 2; // Mark as overdue
      if (validation.message) {
        toast.warning(validation.message);
      }
    }

    updatePaymentMutation(
      {
        params: { id: selectedPaymentId },
        body: {
          totalReceive: formData.amount,
          datePaymentExpec: formData.dueDate,
          statusPaym: finalStatus,
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
            setSelectedPayment(null);
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
        <CardHeader className="flex items-center justify-between">
        Quản lý thanh toán
        <Button onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}>
              <IconPlus className="h-4 w-4" />
              Thêm đợt thanh toán
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <IconCreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có đợt thanh toán nào</h3>
              <p className="text-gray-500 mb-4">Hãy tạo đợt thanh toán đầu tiên cho hợp đồng này</p>
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
              const paymentTypeInfo = getPaymentTypeText(payment.type);
              const dueDate = new Date(payment.datePaymentExpec);
              const currentDate = new Date();
              const isOverdue = dueDate < currentDate && payment.statusPaym === 0;
              
              return (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <IconCurrencyDollar className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{formatCurrency(payment.totalReceive)}</h4>
                          {isOverdue && <IconAlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={paymentTypeInfo.color}>
                            {paymentTypeInfo.text}
                          </Badge>
                          <Badge className={statusInfo.color}>
                            {statusInfo.text}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Đến hạn: {new Date(payment.datePaymentExpec).toLocaleDateString('vi-VN')}</p>
                          <p>Kỳ: {new Date(payment.dateStar).toLocaleDateString('vi-VN')} - {new Date(payment.dateEnd).toLocaleDateString('vi-VN')}</p>
                          {payment.totalSend > 0 && (
                            <p className="text-blue-600">Đã nhận: {formatCurrency(payment.totalSend)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditPayment(payment)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeletePayment(payment._id)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {payment.note && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm border border-lightBorderV1">
                      <span className="font-medium text-gray-700">Ghi chú: </span>
                      <span className="text-gray-500">{payment.note}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Tạo: {new Date(payment.createdAt).toLocaleString('vi-VN')}
                    </p>
                    {payment.updatedAt !== payment.createdAt && (
                      <p className="text-xs text-gray-500">
                        Cập nhật: {new Date(payment.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Create Payment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent size="medium" className="bg-white max-h-[90vh] h-[90vh] overflow-y-auto">
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
                  <SelectItem value="0">Chưa thanh toán</SelectItem>
                  <SelectItem value="1">Đã thanh toán</SelectItem>
                  <SelectItem value="2">Quá hạn</SelectItem>
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
        <DialogContent className="sm:max-w-md bg-white border-lightBorderV1">
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
                  <SelectItem value="0">Chưa thanh toán</SelectItem>
                  <SelectItem value="1">Đã thanh toán</SelectItem>
                  <SelectItem value="2">Quá hạn</SelectItem>
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
            <p className="text-sm text-gray-500">
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

export default PaymentManagement; 
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  IconCreditCard, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconAlertTriangle,
  IconWand,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetInvoicePaymentsByServiceContract, useCreateInvoicePayment, useUpdateInvoicePayment, useDeleteInvoicePayment, useGenerateInvoicePaymentForServiceContract } from '@/hooks/useInvoicePayment';
import { toast } from 'react-toastify';

interface ServiceContractPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serviceContract: any;
  onRefresh?: () => void;
}

interface PaymentFormData {
  amount: number;
  dueDate: string;
  status: number;
  note: string;
}

const ServiceContractPaymentDialog = ({ isOpen, onClose, serviceContract, onRefresh }: ServiceContractPaymentDialogProps) => {
  const [activeTab, setActiveTab] = useState('list');
  const [isCreatePaymentDialogOpen, setIsCreatePaymentDialogOpen] = useState(false);
  const [isEditPaymentDialogOpen, setIsEditPaymentDialogOpen] = useState(false);
  const [isDeletePaymentDialogOpen, setIsDeletePaymentDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: 0,
    dueDate: '',
    status: 0,
    note: ''
  });
  const [priceSuggestions, setPriceSuggestions] = useState<number[]>([]);
  const [showPriceSuggestions, setShowPriceSuggestions] = useState(false);

  const { data: paymentsData, isLoading, refetch } = useGetInvoicePaymentsByServiceContract({ 
    serviceContractId: serviceContract?._id 
  });
  const { mutate: createPaymentMutation, isPending: isCreating } = useCreateInvoicePayment();
  const { mutate: updatePaymentMutation, isPending: isUpdating } = useUpdateInvoicePayment();
  const { mutate: deletePaymentMutation, isPending: isDeleting } = useDeleteInvoicePayment();
  const { mutate: generatePaymentsMutation, isPending: isGenerating } = useGenerateInvoicePaymentForServiceContract();

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

  const handleInputChange = (field: keyof PaymentFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = useCallback(() => {
    setFormData({
      amount: serviceContract?.price || serviceContract?.unitCost || 0,
      dueDate: '',
      status: 0,
      note: ''
    });
    setPriceSuggestions([]);
    setShowPriceSuggestions(false);
  }, [serviceContract?.price, serviceContract?.unitCost]);

  const generatePriceSuggestions = (inputValue: string): number[] => {
    if (!inputValue || inputValue === '0') return [];
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue <= 0) return [];
    
    const suggestions: number[] = [];
    
    // Gợi ý cho giá dịch vụ: tối thiểu 5 chữ số (10,000), tối đa 7 chữ số (9,999,999)
    if (numValue < 1000) {
      // Với số có 1-3 chữ số, tạo gợi ý để đạt 5-7 chữ số
      if (numValue >= 10) {
        suggestions.push(numValue * 1000); // nghìn (VD: 50 -> 50,000 - 5 chữ số)
        suggestions.push(numValue * 10000); // chục nghìn (VD: 50 -> 500,000 - 6 chữ số)
      }
      if (numValue >= 1) {
        suggestions.push(numValue * 10000); // chục nghìn (VD: 5 -> 50,000 - 5 chữ số)
        suggestions.push(numValue * 100000); // trăm nghìn (VD: 5 -> 500,000 - 6 chữ số)
        if (numValue <= 99) {
          suggestions.push(numValue * 1000000); // triệu (VD: 5 -> 5,000,000 - 7 chữ số)
        }
      }
    }
    else if (numValue < 10000) {
      // Với số có 4 chữ số (1000-9999), tạo gợi ý nghìn và chục nghìn
      const thousand = numValue * 10; // (VD: 1000 -> 10,000 - 5 chữ số)
      const tenThousand = numValue * 100; // (VD: 1000 -> 100,000 - 6 chữ số)
      
      if (thousand >= 10000) suggestions.push(thousand);
      if (tenThousand >= 10000 && tenThousand <= 9999999) suggestions.push(tenThousand);
    }
    
    // Lọc chỉ giữ các giá trị từ 5-7 chữ số (10,000 - 9,999,999)
    const filteredSuggestions = suggestions.filter(val => val >= 10000 && val <= 9999999);
    
    return Array.from(new Set(filteredSuggestions)).sort((a: number, b: number) => a - b).slice(0, 3);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Cập nhật giá trị
    handleInputChange('amount', Number(value));
    
    // Tạo gợi ý
    const suggestions = generatePriceSuggestions(value);
    setPriceSuggestions(suggestions);
    setShowPriceSuggestions(suggestions.length > 0 && value !== '');
  };

  const handlePriceSuggestionClick = (suggestedPrice: number) => {
    setFormData(prev => ({ ...prev, amount: suggestedPrice }));
    setShowPriceSuggestions(false);
    setPriceSuggestions([]);
  };

  const formatCurrencyDisplay = (amount: number): string => {
    return amount.toLocaleString('vi-VN');
  };

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
    toast.info('Đang xử lý yêu cầu tạo đợt thanh toán...');
    
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
    const contractStart = new Date(serviceContract.dateStar || serviceContract.signDate);
    const contractEndMonths = serviceContract.duration || 12;
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
        serviceContractId: serviceContract._id,
        totalReceive: formData.amount,
        datePaymentExpec: formData.dueDate,
        statusPaym: formData.status,
        type: 2, // 2: Service payment (changed from 3 to 2)
        note: formData.note
      },
      {
        onSuccess: (data) => {
          if (data?.statusCode === 201 || data?.statusCode === 200) {
            toast.success(data.message || 'Tạo đợt thanh toán thành công');
            refetch();
            setIsCreatePaymentDialogOpen(false);
            resetForm();
            onRefresh?.();
          } else {
            toast.error(data?.message || 'Tạo đợt thanh toán thất bại');
          }
        },
        onError: (error: any) => {
          console.error('Create payment error:', error);
          const errorMessage = error?.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo đợt thanh toán';
          toast.error(errorMessage);
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
    setIsEditPaymentDialogOpen(true);
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
            setIsEditPaymentDialogOpen(false);
            setSelectedPaymentId(null);
            setSelectedPayment(null);
            resetForm();
            onRefresh?.();
          } else {
            toast.error(data.message || 'Cập nhật đợt thanh toán thất bại');
          }
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error.message || 'Đã xảy ra lỗi khi cập nhật đợt thanh toán';
          toast.error(errorMessage);
        }
      }
    );
  };

  const handleDeletePayment = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsDeletePaymentDialogOpen(true);
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
            setIsDeletePaymentDialogOpen(false);
            setSelectedPaymentId(null);
            onRefresh?.();
          } else {
            toast.error(data.message || 'Xóa đợt thanh toán thất bại');
          }
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error.message || 'Đã xảy ra lỗi khi xóa đợt thanh toán';
          toast.error(errorMessage);
        }
      }
    );
  };

  const handleGeneratePayments = () => {
    if (!serviceContract) return;
    const contractStart = new Date(serviceContract.dateStar || serviceContract.signDate);
    const contractEndMonths = serviceContract.duration || 12;
    const contractEnd = new Date(contractStart);
    contractEnd.setMonth(contractEnd.getMonth() + contractEndMonths);

    generatePaymentsMutation(
      {
        params: { serviceContractId: serviceContract._id },
        body: {
          startDate: contractStart.toISOString().split('T')[0],
          endDate: contractEnd.toISOString().split('T')[0],
          paymentCycle: serviceContract.payCycle || 1,
          amount: serviceContract.price || serviceContract.unitCost || 0
        }
      },
      {
        onSuccess: (data) => {
          if (data?.statusCode === 201 || data?.statusCode === 200) {
            const generatedCount = data.data?.length || 0;
            if (generatedCount > 0) {
              toast.success(`${data.message || 'Tạo các đợt thanh toán tự động thành công'} (${generatedCount} đợt thanh toán)`);
            } else {
              toast.warning(data.message || 'Không có đợt thanh toán nào được tạo. Có thể đã tồn tại đầy đủ các đợt thanh toán.');
            }
            refetch();
            onRefresh?.();
          } else {
            toast.error(data?.message || 'Tạo các đợt thanh toán tự động thất bại');
          }
        },
        onError: (error: any) => {
          console.error('Generate payments error:', error);
          const errorMessage = error?.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo các đợt thanh toán tự động';
          toast.error(errorMessage);
        }
      }
    );
  };

  useEffect(() => {
    if (serviceContract) {
      resetForm();
    }
  }, [serviceContract, resetForm]);

  if (!serviceContract) return null;

  const payments = paymentsData?.data || [];
  const serviceName = serviceContract.serviceId?.name || 'Dịch vụ không xác định';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="medium" className="bg-white border-lightBorderV1 max-h-[90vh] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Quản lý thanh toán - {serviceName}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Danh sách thanh toán</TabsTrigger>
            <TabsTrigger value="generate">Tạo tự động</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-500">
                <p>Hợp đồng: {serviceName}</p>
                <p>Giá: {formatCurrency(serviceContract.price || serviceContract.unitCost)} / {serviceContract.payCycle} tháng</p>
              </div>
              <Button onClick={() => {
                resetForm();
                setIsCreatePaymentDialogOpen(true);
              }}>
                <IconPlus className="h-4 w-4" />
                Thêm đợt thanh toán
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
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
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <IconCreditCard className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có đợt thanh toán nào</h3>
                <p className="text-gray-500 mb-4">Hãy tạo đợt thanh toán hoặc sử dụng tính năng tạo tự động</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => {
                    resetForm();
                    setIsCreatePaymentDialogOpen(true);
                  }}>
                    <IconPlus className="h-4 w-4" />
                    Thêm thủ công
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('generate')}>
                    <IconWand className="h-4 w-4" />
                    Tạo tự động
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {payments.map((payment: any, index: number) => {
                  const statusInfo = getStatusInfo(payment.statusPaym);
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
                            <Badge className={statusInfo.color}>
                              {statusInfo.text}
                            </Badge>
                            <div className="text-sm text-gray-500 mt-2 space-y-1">
                              <p>Đến hạn: {dueDate.toLocaleDateString('vi-VN')}</p>
                              {payment.dateStar && payment.dateEnd && (
                                <p>Kỳ: {new Date(payment.dateStar).toLocaleDateString('vi-VN')} - {new Date(payment.dateEnd).toLocaleDateString('vi-VN')}</p>
                              )}
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
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
              Tạo các đợt thanh toán tự động
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-500 space-y-2">
                  <p><strong>Hợp đồng:</strong> {serviceName}</p>
                  <p><strong>Thời hạn:</strong> {serviceContract.duration} tháng</p>
                  <p><strong>Giá dịch vụ:</strong> {formatCurrency(serviceContract.price || serviceContract.unitCost)}</p>
                  <p><strong>Chu kỳ thanh toán:</strong> {serviceContract.payCycle} tháng</p>
                  <p><strong>Ngày bắt đầu:</strong> {new Date(serviceContract.dateStar || serviceContract.signDate).toLocaleDateString('vi-VN')}</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Thông tin tạo tự động:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Sẽ tạo các đợt thanh toán theo chu kỳ đã định</li>
                    <li>• Ngày đến hạn sẽ được tính từ ngày bắt đầu hợp đồng</li>
                    <li>• Số tiền mỗi đợt sẽ bằng giá dịch vụ trong hợp đồng</li>
                    <li>• Tất cả đợt thanh toán sẽ có trạng thái &quot;Chưa thanh toán&quot;</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={(e) => {
                      handleGeneratePayments();
                    }}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    <IconWand className="h-4 w-4" />
                    {isGenerating ? 'Đang tạo...' : 'Tạo các đợt thanh toán'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Payment Dialog */}
        <Dialog open={isCreatePaymentDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setPriceSuggestions([]);
            setShowPriceSuggestions(false);
          }
          setIsCreatePaymentDialogOpen(open);
        }}>
          <DialogContent size='medium' className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white border-lightBorderV1">
            <DialogHeader>
              <DialogTitle>Thêm đợt thanh toán</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePayment} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    value={formData.amount}
                    onChange={handleAmountInputChange}
                    onFocus={() => {
                      if (formData.amount > 0) {
                        const suggestions = generatePriceSuggestions(formData.amount.toString());
                        setPriceSuggestions(suggestions);
                        setShowPriceSuggestions(suggestions.length > 0);
                      }
                    }}
                    onBlur={() => {
                      // Delay để cho phép click vào suggestion
                      setTimeout(() => setShowPriceSuggestions(false), 200);
                    }}
                    placeholder="Nhập số tiền..."
                    disabled={isCreating}
                  />
                  {showPriceSuggestions && priceSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-lightBorderV1 rounded-md shadow-lg">
                      <div className="p-2 space-y-1">
                        <div className="text-xs text-secondaryTextV1 mb-2">Gợi ý số tiền:</div>
                        <div className="flex flex-wrap gap-1">
                          {priceSuggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handlePriceSuggestionClick(suggestion)}
                              className="text-xs h-7 px-2"
                            >
                              {formatCurrencyDisplay(suggestion)} VNĐ
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
                <Button type="button" variant="outline" onClick={() => setIsCreatePaymentDialogOpen(false)} disabled={isCreating}>
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating}
                >
                  {isCreating ? 'Đang tạo...' : 'Tạo đợt thanh toán'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Payment Dialog */}
        <Dialog open={isEditPaymentDialogOpen} onOpenChange={setIsEditPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white border-lightBorderV1 max-h-[90vh] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cập nhật đợt thanh toán</DialogTitle>
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
                <Button type="button" variant="outline" onClick={() => setIsEditPaymentDialogOpen(false)} disabled={isUpdating}>
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
        <Dialog open={isDeletePaymentDialogOpen} onOpenChange={setIsDeletePaymentDialogOpen}>
          <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                Xác nhận xóa đợt thanh toán
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn xóa đợt thanh toán này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDeletePaymentDialogOpen(false)} disabled={isDeleting}>
                  Hủy
                </Button>
                <Button type="button" onClick={confirmDeletePayment} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                  {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceContractPaymentDialog; 
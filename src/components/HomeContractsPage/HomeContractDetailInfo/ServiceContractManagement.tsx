"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconSettings, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconCalendar,
  IconCurrencyDollar,
  IconBrandAppleArcade,
  IconCreditCard
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetServiceContractsByHomeContract, useCreateServiceContract, useUpdateServiceContract, useDeleteServiceContract } from '@/hooks/useServiceContract';
import { useGetServices } from '@/hooks/useService';
import { toast } from 'react-toastify';
import ServiceContractPaymentDialog from '../../ServiceContractsPage/ServiceContractDetailInfo/ServiceContractPaymentDialog';

interface ServiceContractManagementProps {
  homeContractId: string;
  homeId: string;
  guestId: string;
  onRefresh?: () => void;
}

interface ServiceContractFormData {
  serviceId: string;
  dateStar: string;
  duration: number;
  price: number;
  payCycle: number;
}

const ServiceContractManagement = ({ homeContractId, homeId, guestId, onRefresh }: ServiceContractManagementProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedServiceContractId, setSelectedServiceContractId] = useState<string | null>(null);
  const [selectedServiceContract, setSelectedServiceContract] = useState<any>(null);
  const [formData, setFormData] = useState<ServiceContractFormData>({
    serviceId: '',
    dateStar: '',
    duration: 1,
    price: 0,
    payCycle: 1
  });
  const [priceSuggestions, setPriceSuggestions] = useState<number[]>([]);
  const [showPriceSuggestions, setShowPriceSuggestions] = useState(false);

  const { data: serviceContractsData, isLoading, refetch } = useGetServiceContractsByHomeContract({ homeContractId });
  const { data: servicesData } = useGetServices();
  const { mutate: createServiceContractMutation, isPending: isCreating } = useCreateServiceContract();
    const { mutate: updateServiceContractMutation, isPending: isUpdating } = useUpdateServiceContract();
  const { mutate: deleteServiceContractMutation, isPending: isDeleting } = useDeleteServiceContract();
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0: return { text: "Đã hủy", color: "bg-red-500 hover:bg-red-600 text-white border-2 border-red-400 text-nowrap" };
      case 1: return { text: "Đang hoạt động", color: "bg-green-500 hover:bg-green-600 text-white border-2 border-green-400 text-nowrap" };
      case 2: return { text: "Đã kết thúc", color: "bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-400 text-nowrap" };
      default: return { text: "Không xác định", color: "bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-400 text-nowrap" };
    }
  };

  const getPayCycleText = (payCycle: number) => {
    switch (payCycle) {
      case 1: return "Hàng tháng";
      case 3: return "Hàng quý";
      case 6: return "6 tháng";
      case 12: return "Hàng năm";
      default: return `${payCycle} tháng`;
    }
  };

  const handleInputChange = (field: keyof ServiceContractFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      serviceId: '',
      dateStar: '',
      duration: 1,
      price: 0,
      payCycle: 1
    });
    setPriceSuggestions([]);
    setShowPriceSuggestions(false);
  };

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

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Cập nhật giá trị
    handleInputChange('price', Number(value));
    
    // Tạo gợi ý
    const suggestions = generatePriceSuggestions(value);
    setPriceSuggestions(suggestions);
    setShowPriceSuggestions(suggestions.length > 0 && value !== '');
  };

  const handlePriceSuggestionClick = (suggestedPrice: number) => {
    setFormData(prev => ({ ...prev, price: suggestedPrice }));
    setShowPriceSuggestions(false);
    setPriceSuggestions([]);
  };

  const formatCurrencyDisplay = (amount: number): string => {
    return amount.toLocaleString('vi-VN');
  };

  const handleCreateServiceContract = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceId) {
      toast.error('Vui lòng chọn dịch vụ');
      return;
    }
    
    if (!formData.dateStar) {
      toast.error('Vui lòng chọn ngày bắt đầu');
      return;
    }
    
    if (!formData.duration || formData.duration <= 0) {
      toast.error('Vui lòng nhập thời hạn hợp lệ');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error('Vui lòng nhập giá dịch vụ hợp lệ');
      return;
    }

    createServiceContractMutation(
      {
        homeId,
        serviceId: formData.serviceId,
        guestId,
        homeContractId,
        dateStar: formData.dateStar,
        duration: formData.duration,
        price: formData.price,
        payCycle: formData.payCycle
        
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 201) {
            toast.success(data.message || 'Tạo hợp đồng dịch vụ thành công');
            refetch();
            setIsCreateDialogOpen(false);
            resetForm();
            onRefresh?.();
          } else {
            toast.error(data.message || 'Tạo hợp đồng dịch vụ thất bại');
          }
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo hợp đồng dịch vụ';
          toast.error(errorMessage);
        }
      }
    );
  };

  const handleEditServiceContract = (serviceContract: any) => {
    setSelectedServiceContractId(serviceContract._id);
    setFormData({
      serviceId: serviceContract.serviceId,
      dateStar: serviceContract.signDate ? serviceContract.signDate.split('T')[0] : (serviceContract.dateStar ? serviceContract.dateStar.split('T')[0] : ''),
      duration: serviceContract.duration,
      price: serviceContract.unitCost || serviceContract.price || 0,
      payCycle: serviceContract.payCycle
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateServiceContract = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedServiceContractId) return;
    
    if (!formData.duration || formData.duration <= 0) {
      toast.error('Vui lòng nhập thời hạn hợp lệ');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error('Vui lòng nhập giá dịch vụ hợp lệ');
      return;
    }

    updateServiceContractMutation(
      {
        params: { id: selectedServiceContractId },
        body: {
          duration: formData.duration,
          price: formData.price,
          payCycle: formData.payCycle
        }
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success(data.message || 'Cập nhật hợp đồng dịch vụ thành công');
            refetch();
            setIsEditDialogOpen(false);
            setSelectedServiceContractId(null);
            resetForm();
            onRefresh?.();
          } else {
            toast.error(data.message || 'Cập nhật hợp đồng dịch vụ thất bại');
          }
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error.message || 'Đã xảy ra lỗi khi cập nhật hợp đồng dịch vụ';
          toast.error(errorMessage);
        }
      }
    );
  };

  const handleViewDetails = (serviceContract: any) => {
    setSelectedServiceContract(serviceContract);
    setIsDetailsDialogOpen(true);
  };

  const handleViewPayments = (serviceContract: any) => {
    setSelectedServiceContract(serviceContract);
    setIsPaymentDialogOpen(true);
  };

  const handleDeleteServiceContract = (serviceContractId: string) => {
    setSelectedServiceContractId(serviceContractId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteServiceContract = () => {
    if (!selectedServiceContractId) return;

    deleteServiceContractMutation(
      { id: selectedServiceContractId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success(data.message || 'Xóa hợp đồng dịch vụ thành công');
            refetch();
            setIsDeleteDialogOpen(false);
            setSelectedServiceContractId(null);
            onRefresh?.();
          } else {
            toast.error(data.message || 'Xóa hợp đồng dịch vụ thất bại');
          }
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || error.message || 'Đã xảy ra lỗi khi xóa hợp đồng dịch vụ';
          toast.error(errorMessage);
        }
      }
    );
  };

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

  // Handle different data structures - the API returns data directly as an array
  const serviceContracts: any[] = Array.isArray(serviceContractsData?.data) 
    ? serviceContractsData.data 
    : serviceContractsData?.data?.contracts || [];
  const services = servicesData?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex items-center justify-between">
        Hợp đồng dịch vụ
            <Button onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}>
              <IconPlus className="h-4 w-4" />
              Thêm hợp đồng dịch vụ
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceContracts.length === 0 ? (
            <div className="text-center py-8">
              <IconBrandAppleArcade  className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có hợp đồng dịch vụ nào</h3>
              <p className="text-gray-500 mb-4">Hãy tạo hợp đồng dịch vụ đầu tiên cho hợp đồng thuê nhà này</p>
              <Button onClick={() => {
                resetForm();
                setIsCreateDialogOpen(true);
              }}>
                <IconPlus className="h-4 w-4" />
                Thêm hợp đồng dịch vụ
              </Button>
            </div>
          ) : (
            serviceContracts.map((serviceContract: any, index: number) => {
              const statusInfo = getStatusInfo(serviceContract.statusContrac);
              const serviceName = serviceContract.serviceId?.name || services.find(s => s._id === serviceContract.serviceId)?.name || 'Dịch vụ không xác định';
              const contractPrice = serviceContract.unitCost || serviceContract.price || 0;
              const contractStartDate = serviceContract.signDate || serviceContract.dateStar;
              
              return (
                <motion.div
                  key={serviceContract._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <IconSettings className="h-5 w-5 text-mainTextHoverV1" />
                      <div>
                      <Badge className={statusInfo.color}>
                        {statusInfo.text}
                      </Badge>
                        <h4 className="font-medium">{serviceName}</h4>
                        <p className="text-sm text-gray-500">
                        Thời hạn: {serviceContract.duration}{" "}tháng{" "}({formatCurrency(contractPrice)} / {getPayCycleText(serviceContract.payCycle)})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewPayments(serviceContract)}
                        title="Quản lý thanh toán"
                      >
                        <IconCreditCard className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditServiceContract(serviceContract)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteServiceContract(serviceContract._id)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Bắt đầu: {contractStartDate ? new Date(contractStartDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </motion.div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Create Service Contract Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent size='medium' className="bg-white max-h-[90vh] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Thêm hợp đồng dịch vụ
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateServiceContract} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceId">Dịch vụ <span className="text-red-500">*</span></Label>
              <Select value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dịch vụ..." />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service: any) => (
                    <SelectItem key={service._id} value={service._id}>
                      {service.name} ({service.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateStar">Ngày bắt đầu <span className="text-red-500">*</span></Label>
              <Input
                id="dateStar"
                type="date"
                value={formData.dateStar}
                onChange={(e) => handleInputChange('dateStar', e.target.value)}
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Thời hạn (tháng) <span className="text-red-500">*</span></Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                placeholder="Nhập thời hạn..."
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá dịch vụ <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handlePriceInputChange}
                  onFocus={() => {
                    if (formData.price > 0) {
                      const suggestions = generatePriceSuggestions(formData.price.toString());
                      setPriceSuggestions(suggestions);
                      setShowPriceSuggestions(suggestions.length > 0);
                    }
                  }}
                  onBlur={() => {
                    // Delay để cho phép click vào suggestion
                    setTimeout(() => setShowPriceSuggestions(false), 200);
                  }}
                  placeholder="Nhập giá dịch vụ..."
                  disabled={isCreating}
                />
                {showPriceSuggestions && priceSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-lightBorderV1 rounded-md shadow-lg">
                    <div className="p-2 space-y-1">
                      <div className="text-xs text-secondaryTextV1 mb-2">Gợi ý giá dịch vụ:</div>
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
              <Label htmlFor="payCycle">Chu kỳ thanh toán</Label>
              <Select value={formData.payCycle.toString()} onValueChange={(value) => handleInputChange('payCycle', Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hàng tháng</SelectItem>
                  <SelectItem value="3">Hàng quý</SelectItem>
                  <SelectItem value="6">6 tháng</SelectItem>
                  <SelectItem value="12">Hàng năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                Hủy
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Đang tạo...' : 'Tạo hợp đồng'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Contract Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent size='medium' className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white border-lightBorderV1">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-mainTextV1">
              Cập nhật hợp đồng dịch vụ
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateServiceContract} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Thời hạn (tháng) <span className="text-red-500">*</span></Label>
              <Input
                id="edit-duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', Number(e.target.value))}
                placeholder="Nhập thời hạn..."
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Giá dịch vụ <span className="text-red-500">*</span></Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                placeholder="Nhập giá dịch vụ..."
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-payCycle">Chu kỳ thanh toán</Label>
              <Select value={formData.payCycle.toString()} onValueChange={(value) => handleInputChange('payCycle', Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Hàng tháng</SelectItem>
                  <SelectItem value="3">Hàng quý</SelectItem>
                  <SelectItem value="6">6 tháng</SelectItem>
                  <SelectItem value="12">Hàng năm</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Service Contract Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-mainBackgroundV1 border-lightBorderV1">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-mainTextV1">
              <IconEye className="h-5 w-5" />
              Chi tiết hợp đồng dịch vụ
            </DialogTitle>
          </DialogHeader>
          {selectedServiceContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Dịch vụ</Label>
                  <p className="font-medium">
                    {selectedServiceContract.serviceId?.name || services.find(s => s._id === selectedServiceContract.serviceId)?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Trạng thái</Label>
                  <Badge className={getStatusInfo(selectedServiceContract.statusContrac || selectedServiceContract.status).color}>
                    {getStatusInfo(selectedServiceContract.statusContrac || selectedServiceContract.status).text}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Giá dịch vụ</Label>
                  <p className="font-medium">{formatCurrency(selectedServiceContract.unitCost || selectedServiceContract.price || 0)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Chu kỳ thanh toán</Label>
                  <p className="font-medium">{getPayCycleText(selectedServiceContract.payCycle)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Thời hạn</Label>
                  <p className="font-medium">{selectedServiceContract.duration} tháng</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Ngày bắt đầu</Label>
                  <p className="font-medium">
                    {(selectedServiceContract.signDate || selectedServiceContract.dateStar) ? 
                      new Date(selectedServiceContract.signDate || selectedServiceContract.dateStar).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <Label className="text-xs">Ngày tạo</Label>
                    <p>{new Date(selectedServiceContract.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Cập nhật</Label>
                    <p>{new Date(selectedServiceContract.updatedAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsDetailsDialogOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Service Contract Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-mainTextV1">
              Xác nhận xóa hợp đồng dịch vụ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa hợp đồng dịch vụ này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                Hủy
              </Button>
              <Button type="button" onClick={confirmDeleteServiceContract} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </div>
          </div>
                  </DialogContent>
        </Dialog>

        {/* Service Contract Payment Dialog */}
        <ServiceContractPaymentDialog
          isOpen={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
          serviceContract={selectedServiceContract}
          onRefresh={onRefresh}
        />
      </motion.div>
    );
  };

export default ServiceContractManagement; 
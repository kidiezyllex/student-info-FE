"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconFileText, IconCreditCard, IconSettings, IconCalendar, IconUser, IconHome } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import ServiceContractPaymentManagement from './ServiceContractPaymentManagement';

interface ServiceContractDetailInfoProps {
  contractData: any;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const ServiceContractDetailInfo = ({ contractData, isLoading, onRefresh }: ServiceContractDetailInfoProps) => {
  const [activeTab, setActiveTab] = useState('details');

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return { text: "Đã hủy", color: "bg-red-100 text-red-800" };
      case 1: return { text: "Đang hoạt động", color: "bg-green-100 text-green-800" };
      case 2: return { text: "Đã kết thúc", color: "bg-gray-100 text-gray-800" };
      default: return { text: "Không xác định", color: "bg-gray-100 text-gray-800" };
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contractData) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <IconFileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu</h3>
          <p className="text-gray-500">Không thể tải thông tin hợp đồng dịch vụ</p>
        </CardContent>
      </Card>
    );
  }

  const contract = contractData;
  const statusInfo = getStatusText(contract.statusContrac);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <IconFileText className="h-4 w-4" />
            Chi tiết hợp đồng
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <IconCreditCard className="h-4 w-4" />
            Quản lý thanh toán
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconSettings className="h-5 w-5" />
                  Thông tin hợp đồng dịch vụ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Trạng thái hợp đồng</h3>
                  <Badge className={statusInfo.color}>
                    {statusInfo.text}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <IconSettings className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Dịch vụ</p>
                        <p className="font-medium">{contract.serviceId?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">Đơn vị: {contract.serviceId?.unit || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <IconUser className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Khách sử dụng</p>
                        <p className="font-medium">{contract.guestId?.fullname || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{contract.guestId?.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <IconHome className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Căn hộ</p>
                        <p className="font-medium">
                          {contract.homeId?.building ? `${contract.homeId.building} - ${contract.homeId.apartmentNv}` : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">{contract.homeId?.address || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <IconCalendar className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Thời gian sử dụng</p>
                        <p className="font-medium">{contract.duration} tháng</p>
                        <p className="text-sm text-gray-500">
                          Từ {new Date(contract.dateStar).toLocaleDateString('vi-VN')} đến {new Date(contract.dateEnd).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Thông tin tài chính</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Giá dịch vụ:</span>
                          <span className="font-medium">{formatCurrency(contract.unitCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Chu kỳ thanh toán:</span>
                          <span className="font-medium">{getPayCycleText(contract.payCycle)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tổng giá trị:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(contract.unitCost * Math.ceil(contract.duration / contract.payCycle))}
                          </span>
                        </div>
                        {contract.limit > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Giới hạn:</span>
                            <span className="font-medium">{contract.limit}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Thông tin khác</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày ký:</span>
                          <span className="font-medium">
                            {new Date(contract.signDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        {contract.homeContractStk && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hợp đồng thuê:</span>
                            <span className="font-medium text-blue-600">
                              Có liên kết
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {contract.serviceId?.description && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Mô tả dịch vụ</h4>
                        <p className="text-sm text-gray-600">{contract.serviceId.description}</p>
                      </div>
                    )}

                    {contract.homeId?.homeOwnerId && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Chủ nhà</h4>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{contract.homeId.homeOwnerId.fullname}</p>
                          <p className="text-sm text-gray-600">{contract.homeId.homeOwnerId.phone}</p>
                          <p className="text-sm text-gray-600">{contract.homeId.homeOwnerId.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="payments">
          <ServiceContractPaymentManagement 
            serviceContractId={contract._id} 
            contractData={contract}
            onRefresh={onRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
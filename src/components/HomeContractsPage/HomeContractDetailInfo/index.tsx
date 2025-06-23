"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconFileText, 
  IconCreditCard, 
  IconSettings, 
  IconCalendar, 
  IconUser, 
  IconHome,
  IconBuildingSkyscraper,
  IconPhone,
  IconMail,
  IconMapPin,
  IconId,
  IconCake,
  IconGenderMale,
  IconGenderFemale,
  IconNote,
  IconCreditCardPay,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import PaymentManagement from './PaymentManagement';
import ServiceContractManagement from './ServiceContractManagement';

interface HomeContractDetailInfoProps {
  contractData: any;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const HomeContractDetailInfo = ({ contractData, isLoading, onRefresh }: HomeContractDetailInfoProps) => {
  const [activeTab, setActiveTab] = useState('details');

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('vi-VN');
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

  const getGenderText = (gender: boolean) => {
    return gender ? "Nam" : "Nữ";
  };

  const getGenderIcon = (gender: boolean) => {
    return gender ? IconGenderMale : IconGenderFemale;
  };

  const calculateEndDate = (startDate: string, duration: number): string => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + duration);
    return end.toLocaleDateString('vi-VN');
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
              {[...Array(8)].map((_, i) => (
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
          <IconFileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">Không có dữ liệu</h3>
          <p className="text-gray-500">Không thể tải thông tin hợp đồng</p>
        </CardContent>
      </Card>
    );
  }

  const contract = contractData;
  const guest = contract.guestId;
  const home = contract.homeId;
  const homeOwner = home?.homeOwnerId;
  const statusInfo = getStatusText(contract.status);
  const GenderIcon = guest ? getGenderIcon(guest.gender) : IconUser;

  // Home amenities mapping
  const amenities = [
    { key: 'hasBathroom', label: 'Phòng tắm riêng', icon: '🚿' },
    { key: 'hasBedroom', label: 'Phòng ngủ riêng', icon: '🛏️' },
    { key: 'hasBalcony', label: 'Ban công', icon: '🏠' },
    { key: 'hasKitchen', label: 'Bếp', icon: '🍳' },
    { key: 'hasWifi', label: 'Wifi', icon: '📶' },
    { key: 'hasSoundproof', label: 'Cách âm', icon: '🔇' },
    { key: 'hasAirConditioner', label: 'Điều hòa', icon: '❄️' },
    { key: 'hasWashingMachine', label: 'Máy giặt', icon: '🧺' },
    { key: 'hasRefrigerator', label: 'Tủ lạnh', icon: '🧊' },
    { key: 'hasElevator', label: 'Thang máy', icon: '↕' },
    { key: 'hasParking', label: 'Chỗ đậu xe', icon: '🚗' },
    { key: 'hasSecurity', label: 'Bảo vệ', icon: '🛡️' },
    { key: 'hasGym', label: 'Phòng gym', icon: '💪' },
    { key: 'hasSwimmingPool', label: 'Hồ bơi', icon: '🏊' },
    { key: 'hasGarden', label: 'Vườn', icon: '🌳' },
    { key: 'hasPetAllowed', label: 'Cho phép thú cưng', icon: '🐕' }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <IconFileText className="h-4 w-4" />
            Chi tiết hợp đồng
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <IconCreditCard className="h-4 w-4" />
            Quản lý thanh toán
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <IconSettings className="h-4 w-4" />
            Hợp đồng dịch vụ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Contract Overview */}
            <Card>
              <CardHeader>
              Thông tin hợp đồng thuê nhà
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <IconId className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Mã hợp đồng</span>
                    </div>
                    <p className="font-semibold text-blue-900">
                      {contract.contractCode || contract._id}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <IconCalendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Thời hạn</span>
                    </div>
                    <p className="font-semibold text-green-900">{contract.duration} tháng</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <IconCreditCard className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Giá thuê</span>
                    </div>
                    <p className="font-semibold text-purple-900">{formatCurrency(contract.renta)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-500 mb-3">Thời gian hợp đồng</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày bắt đầu:</span>
                        <span className="font-medium">{formatDate(contract.dateStar)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày kết thúc:</span>
                        <span className="font-medium">{calculateEndDate(contract.dateStar, contract.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Chu kỳ thanh toán:</span>
                        <span className="font-medium">{getPayCycleText(contract.payCycle)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-500 mb-3">Thông tin tài chính</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Giá thuê:</span>
                        <span className="font-medium">{formatCurrency(contract.renta)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tiền đặt cọc:</span>
                        <span className="font-medium">{formatCurrency(contract.deposit)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-500">Tổng tiền ban đầu:</span>
                        <span className="text-green-600">{formatCurrency(contract.renta + contract.deposit)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            {guest && (
              <Card>
                <CardHeader>
                Thông tin khách thuê
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <GenderIcon className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Họ và tên</p>
                          <p className="font-medium">{guest.fullname}</p>
                          <p className="text-sm text-gray-500">{getGenderText(guest.gender)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <IconPhone className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Số điện thoại</p>
                          <p className="font-medium">{guest.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <IconMail className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{guest.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-500 mb-3">Thông tin cá nhân</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">CCCD/CMND:</span>
                            <span className="font-medium">{guest.citizenId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngày cấp:</span>
                            <span className="font-medium">{formatDate(guest.citizen_date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Nơi cấp:</span>
                            <span className="font-medium text-sm">{guest.citizen_place}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngày sinh:</span>
                            <span className="font-medium">{formatDate(guest.birthday)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-500 mb-3">Địa chỉ & Ghi chú</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-500 text-sm">Quê quán:</span>
                            <p className="font-medium text-sm">{guest.hometown}</p>
                          </div>
                          {guest.note && (
                            <div>
                              <span className="text-gray-500 text-sm">Ghi chú:</span>
                              <p className="font-medium text-sm">{guest.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Home Information */}
            {home && (
              <Card>
                <CardHeader>
                Thông tin căn hộ
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <IconBuildingSkyscraper className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Tòa nhà</p>
                          <p className="font-medium">{home.building}</p>
                          <p className="text-sm text-gray-500">Căn hộ: {home.apartmentNv}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <IconMapPin className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Địa chỉ</p>
                          <p className="font-medium">{home.address}</p>
                          <p className="text-sm text-gray-500">{home.ward}, {home.district}</p>
                        </div>
                      </div>

                      {home.note && (
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <IconNote className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Ghi chú</p>
                              <p className="font-medium text-sm">{home.note}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-500 mb-3">Tiện ích căn hộ</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {amenities.map((amenity) => (
                            <div key={amenity.key} className="flex items-center gap-2">
                              {home[amenity.key] ? (
                                <IconCheck className="h-4 w-4 text-green-500" />
                              ) : (
                                <IconX className="h-4 w-4 text-red-400" />
                              )}
                              <span className={`text-sm ${home[amenity.key] ? 'text-green-700' : 'text-gray-500'}`}>
                                {amenity.icon} {amenity.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Home Owner Information */}
            {homeOwner && (
              <Card>
                <CardHeader>
                Thông tin chủ nhà
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <IconUser className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500">Họ và tên</p>
                          <p className="font-medium">{homeOwner.fullname}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <IconPhone className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Số điện thoại</p>
                          <p className="font-medium">{homeOwner.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <IconMail className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{homeOwner.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-500 mb-3">Thông tin ngân hàng</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngân hàng:</span>
                            <span className="font-medium text-sm">{homeOwner.bank}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tên tài khoản:</span>
                            <span className="font-medium">{homeOwner.bankAccount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Số tài khoản:</span>
                            <span className="font-medium">{homeOwner.bankNumber}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-gray-500 mb-3">Thông tin cá nhân</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">CCCD/CMND:</span>
                            <span className="font-medium">{homeOwner.citizenId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngày cấp:</span>
                            <span className="font-medium">{formatDate(homeOwner.citizen_date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Ngày sinh:</span>
                            <span className="font-medium">{formatDate(homeOwner.birthday)}</span>
                          </div>
                        </div>
                      </div>

                      {homeOwner.note && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-500 mb-2">Ghi chú</h4>
                          <p className="text-sm text-gray-500">{homeOwner.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contract Metadata */}
            <Card>
              <CardHeader>
                Thông tin thời gian
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Ngày tạo hợp đồng</p>
                    <p className="font-medium">{formatDateTime(contract.createdAt)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Lần cập nhật cuối</p>
                    <p className="font-medium">{formatDateTime(contract.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement 
            contractId={contract._id} 
            contractData={contract}
            onRefresh={onRefresh}
          />
        </TabsContent>

        <TabsContent value="services">
          <ServiceContractManagement 
            homeContractId={contract._id}
            homeId={contract.homeId?._id}
            guestId={contract.guestId?._id}
            onRefresh={onRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
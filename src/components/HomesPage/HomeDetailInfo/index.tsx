"use client";

import { IHome } from "@/interface/response/home";
import { formatDateOnly } from "@/utils/dateFormat";
import {
  IconBuilding,
  IconMapPin,
  IconUser,
  IconPhone,
  IconMail,
  IconNotes,
  IconHome,
  IconCheck,
  IconX,
  IconBath,
  IconBed,
  IconWifi,
  IconSnowflake,
  IconWashMachine,
  IconFridge,
  IconElevator,
  IconCar,
  IconShield,
  IconBarbell,
  IconPool,
  IconTrees,
  IconDog,
  IconVolume,
  IconChefHat,
  IconDoor
} from "@tabler/icons-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HomeDetailInfoProps {
  home: IHome;
}

export const HomeDetailInfo = ({ home }: HomeDetailInfoProps) => {
  const homeData = home as any;

  const basicInfo = [
    {
      icon: <IconBuilding className="h-4 w-4 text-blue-600" />,
      label: "Tòa nhà",
      value: homeData.building,
    },
    {
      icon: <IconHome className="h-4 w-4 text-green-600" />,
      label: "Số căn hộ",
      value: homeData.apartmentNv,
    },
    {
      icon: <IconMapPin className="h-4 w-4 text-red-600" />,
      label: "Địa chỉ",
      value: homeData.address,
    },
    {
      icon: <IconMapPin className="h-4 w-4 text-orange-600" />,
      label: "Quận/Huyện",
      value: homeData.district,
    },
    {
      icon: <IconMapPin className="h-4 w-4 text-purple-600" />,
      label: "Phường/Xã",
      value: homeData.ward,
    },
    {
      icon: homeData.active ? <IconCheck className="h-4 w-4 text-green-600" /> : <IconX className="h-4 w-4 text-red-600" />,
      label: "Trạng thái",
      value: homeData.active ? "Hoạt động" : "Không hoạt động",
    }
  ];

  const ownerInfo = [
    {
      icon: <IconUser className="h-4 w-4 text-slate-600" />,
      label: "Tên chủ nhà",
      value: homeData.homeOwnerId?.fullname,
    },
    {
      icon: <IconPhone className="h-4 w-4 text-green-600" />,
      label: "Số điện thoại",
      value: homeData.homeOwnerId?.phone,
    },
    {
      icon: <IconMail className="h-4 w-4 text-blue-600" />,
      label: "Email",
      value: homeData.homeOwnerId?.email,
    },
    ...(homeData.note ? [{
      icon: <IconNotes className="h-4 w-4 text-slate-600" />,
      label: "Ghi chú",
      value: homeData.note,
    }] : [])
  ];

  const amenities = [
    { key: 'hasBathroom', label: 'Phòng tắm', icon: <IconBath className="h-4 w-4" /> },
    { key: 'hasBedroom', label: 'Phòng ngủ', icon: <IconBed className="h-4 w-4" /> },
    { key: 'hasBalcony', label: 'Ban công', icon: <IconDoor className="h-4 w-4" /> },
    { key: 'hasKitchen', label: 'Nhà bếp', icon: <IconChefHat className="h-4 w-4" /> },
    { key: 'hasWifi', label: 'Wifi', icon: <IconWifi className="h-4 w-4" /> },
    { key: 'hasSoundproof', label: 'Cách âm', icon: <IconVolume className="h-4 w-4" /> },
    { key: 'hasAirConditioner', label: 'Điều hòa', icon: <IconSnowflake className="h-4 w-4" /> },
    { key: 'hasWashingMachine', label: 'Máy giặt', icon: <IconWashMachine className="h-4 w-4" /> },
    { key: 'hasRefrigerator', label: 'Tủ lạnh', icon: <IconFridge className="h-4 w-4" /> },
    { key: 'hasElevator', label: 'Thang máy', icon: <IconElevator className="h-4 w-4" /> },
    { key: 'hasParking', label: 'Chỗ đậu xe', icon: <IconCar className="h-4 w-4" /> },
    { key: 'hasSecurity', label: 'Bảo vệ', icon: <IconShield className="h-4 w-4" /> },
    { key: 'hasGym', label: 'Phòng gym', icon: <IconBarbell className="h-4 w-4" /> },
    { key: 'hasSwimmingPool', label: 'Hồ bơi', icon: <IconPool className="h-4 w-4" /> },
    { key: 'hasGarden', label: 'Vườn', icon: <IconTrees className="h-4 w-4" /> },
    { key: 'hasPetAllowed', label: 'Cho phép thú cưng', icon: <IconDog className="h-4 w-4" /> },
  ];



  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        <p className="text-sm text-slate-900 mt-0.5 truncate">
          {value || <span className="text-slate-400 italic">Chưa cập nhật</span>}
        </p>
      </div>
    </div>
  );

  const InfoSection = ({ title, items, className = "" }: { title: string, items: any[], className?: string }) => (
    <Card className={`border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardHeader>
        {title}
      </CardHeader>

      <div className="px-4 py-3 space-y-1">
        {items.map((item, index) => (
          <InfoRow key={index} {...item} />
        ))}
      </div>
    </Card>
  );

  const AmenityBadge = ({ amenity, isAvailable }: { amenity: any, isAvailable: boolean }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isAvailable
        ? 'bg-green-50 border-green-200 text-green-700'
        : 'bg-gray-50 border-gray-200 text-gray-500'
      }`}>
      <div className={isAvailable ? 'text-green-600' : 'text-gray-500'}>
        {amenity.icon}
      </div>
      <span className="text-sm font-medium">{amenity.label}</span>
      {isAvailable ? (
        <IconCheck className="h-3 w-3 text-green-600 ml-auto" />
      ) : (
        <IconX className="h-3 w-3 text-gray-500 ml-auto" />
      )}
    </div>
  );

  return (
    <div className="space-y-4 bg-[#F9F9FC]">
      <Card className="border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          Hình ảnh căn hộ
        </CardHeader>
        <div className="px-4 py-3">
          {homeData.images && homeData.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {homeData.images.map((image: string, index: number) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image}
                    alt={`Căn hộ ${homeData.apartmentNv} - Ảnh ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <IconHome className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">Chưa có hình ảnh nào cho căn hộ này</p>
            </div>
          )}
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InfoSection
          title="Thông tin căn hộ"
          items={basicInfo}
        />
        <InfoSection
          title="Thông tin chủ nhà"
          items={ownerInfo}
        />
      </div>

      <Card className="border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          Tiện nghi & Dịch vụ
        </CardHeader>
        <div className="px-4 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {amenities.map((amenity) => (
              <AmenityBadge
                key={amenity.key}
                amenity={amenity}
                isAvailable={!!homeData[amenity.key]}
              />
            ))}
          </div>
        </div>
      </Card>

      <Card className="border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          Thông tin thời gian
        </CardHeader>
        <div className="px-4 py-3 space-y-1">
          <InfoRow
            icon={<IconNotes className="h-4 w-4 text-slate-600" />}
            label="Ngày tạo"
            value={formatDateOnly(homeData.createdAt)}
          />
          <InfoRow
            icon={<IconNotes className="h-4 w-4 text-slate-600" />}
            label="Cập nhật lần cuối"
            value={formatDateOnly(homeData.updatedAt)}
          />
        </div>
      </Card>
    </div>
  );
}; 
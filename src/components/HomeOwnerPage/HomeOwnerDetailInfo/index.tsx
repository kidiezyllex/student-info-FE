"use client";

import { IHomeOwner } from "@/interface/response/homeOwner";
import { formatDateOnly } from "@/utils/dateFormat";
import { 
  IconUser, 
  IconPhone, 
  IconMail, 
  IconId, 
  IconCalendar, 
  IconMapPin, 
  IconHome, 
  IconNotes,
  IconGenderMale,
  IconGenderFemale,
  IconBuildingBank
} from "@tabler/icons-react";
import { Card, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";

interface HomeOwnerDetailInfoProps {
  homeOwner: any;
}

export const HomeOwnerDetailInfo = ({ homeOwner }: HomeOwnerDetailInfoProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const personalContactInfo = [
    {
      icon: <IconUser className="h-4 w-4 text-slate-600" />,
      label: "Họ và tên",
      value: homeOwner.fullname,
    },
    {
      icon: <IconPhone className="h-4 w-4 text-green-600" />,
      label: "Số điện thoại",
      value: homeOwner.phone,
    },
    {
      icon: <IconMail className="h-4 w-4 text-blue-600" />,
      label: "Email",
      value: homeOwner.email,
    },
    {
      icon: <IconCalendar className="h-4 w-4 text-slate-600" />,
      label: "Ngày sinh",
      value: homeOwner.birthday ? formatDate(homeOwner.birthday) : "",
    },
  ];

  const identityInfo = [
    {
      icon: <IconId className="h-4 w-4 text-red-600" />,
      label: "Số CMND/CCCD",
      value: homeOwner.citizenId,
    },
    {
      icon: <IconCalendar className="h-4 w-4 text-slate-600" />,
      label: "Ngày cấp",
      value: homeOwner.citizen_date ? formatDate(homeOwner.citizen_date) : "",
    },
    {
      icon: <IconMapPin className="h-4 w-4 text-slate-600" />,
      label: "Nơi cấp",
      value: homeOwner.citizen_place,
    },
  ];

  const bankInfo = [
    {
      icon: <IconBuildingBank className="h-4 w-4 text-blue-600" />,
      label: "Tên ngân hàng",
      value: homeOwner.bank,
    },
    {
      icon: <IconBuildingBank className="h-4 w-4 text-slate-600" />,
      label: "Số tài khoản",
      value: homeOwner.bankAccount,
    },
    {
      icon: <IconBuildingBank className="h-4 w-4 text-slate-600" />,
      label: "Số thẻ",
      value: homeOwner.bankNumber,
    },
  ];

  const additionalInfo = [
    {
      icon: <IconNotes className="h-4 w-4 text-slate-600" />,
      label: "Ghi chú",
      value: homeOwner.note,
    },
    {
      icon: <IconUser className="h-4 w-4 text-slate-600" />,
      label: "Trạng thái",
      value: homeOwner.active ? "Đang hoạt động" : "Không hoạt động",
    },
    {
      icon: <IconCalendar className="h-4 w-4 text-slate-600" />,
      label: "Ngày tạo",
      value: homeOwner.createdAt ? formatDate(homeOwner.createdAt) : "",
    },
    {
      icon: <IconCalendar className="h-4 w-4 text-slate-600" />,
      label: "Ngày cập nhật",
      value: homeOwner.updatedAt ? formatDate(homeOwner.updatedAt) : "",
    },
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
    <Card className={`border border-slate-200 bg-white overflow-hidden ${className}`}>
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

  return (
    <div className="space-y-4 bg-[#F9F9FC]">
      {/* Avatar Display if available */}
      {homeOwner.avatarUrl && (
        <Card className="border border-slate-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0">
                <img 
                  src={homeOwner.avatarUrl} 
                  alt={homeOwner.fullname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-slate-900 truncate">{homeOwner.fullname}</h2>
                <p className="text-sm text-slate-600">{homeOwner.phone}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Information Grid - Cards with sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#F9F9FC]">
        <InfoSection 
          title="Thông tin cá nhân" 
          items={personalContactInfo}
        />
        
        <InfoSection 
          title="Thông tin CMND/CCCD" 
          items={identityInfo}
        />

        <InfoSection 
          title="Thông tin ngân hàng" 
          items={bankInfo}
        />

        <InfoSection 
          title="Thông tin bổ sung" 
          items={additionalInfo}
        />
      </div>
    </div>
  );
}; 
"use client";

import { IGuest } from "@/interface/response/guest";
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
  IconGenderFemale
} from "@tabler/icons-react";
import { Card, CardHeader } from "@/components/ui/card";

interface GuestDetailInfoProps {
  guest: IGuest;
}

export const GuestDetailInfo = ({ guest }: GuestDetailInfoProps) => {
  const personalContactInfo = [
    {
      icon: <IconUser className="h-4 w-4 text-slate-600" />,
      label: "Họ tên",
      value: guest.fullname,
    },
    {
      icon: <IconPhone className="h-4 w-4 text-green-600" />,
      label: "Số điện thoại",
      value: guest.phone,
    },
    {
      icon: <IconMail className="h-4 w-4 text-blue-600" />,
      label: "Email",
      value: guest.email,
    },
    {
      icon: guest.gender !== undefined ? (guest.gender ? <IconGenderMale className="h-4 w-4 text-blue-600" /> : <IconGenderFemale className="h-4 w-4 text-pink-600" />) : <IconUser className="h-4 w-4 text-gray-500" />,
      label: "Giới tính",
      value: guest.gender !== undefined ? (guest.gender ? "Nam" : "Nữ") : "",
    },
    {
      icon: <IconCalendar className="h-4 w-4 text-slate-600" />,
      label: "Ngày sinh",
      value: guest.birthday ? formatDateOnly(guest.birthday) : "",
    },
    {
      icon: <IconHome className="h-4 w-4 text-slate-600" />,
      label: "Quê quán",
      value: guest.hometown,
    }
  ];

  const identityAdditionalInfo = [
    {
      icon: <IconId className="h-4 w-4 text-red-600" />,
      label: "Số CMND/CCCD",
      value: guest.citizenId,
    },
    {
      icon: <IconCalendar className="h-4 w-4 text-slate-600" />,
      label: "Ngày cấp",
      value: guest.citizen_date ? formatDateOnly(guest.citizen_date) : "",
    },
    {
      icon: <IconMapPin className="h-4 w-4 text-slate-600" />,
      label: "Nơi cấp",
      value: guest.citizen_place,
    },
    ...(guest.note ? [{
      icon: <IconNotes className="h-4 w-4 text-slate-600" />,
      label: "Ghi chú",
      value: guest.note,
    }] : [])
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
      {/* Header with Avatar */}
      {guest.avatarUrl && (
        <Card className="border border-slate-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0">
                <img 
                  src={guest.avatarUrl} 
                  alt={guest.fullname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-slate-900 truncate">{guest.fullname}</h2>
                <p className="text-sm text-slate-600">{guest.phone}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Information Grid - Only 2 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-[#F9F9FC]">
        <InfoSection 
          title="Thông tin cá nhân & liên hệ" 
          items={personalContactInfo}
        />
        
        <InfoSection 
          title="Thông tin giấy tờ & bổ sung" 
          items={identityAdditionalInfo}
        />
      </div>
    </div>
  );
}; 
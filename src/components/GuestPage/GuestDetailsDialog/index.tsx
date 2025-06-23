"use client";

import { useEffect, useState } from "react";
import { useGetGuestDetail, useUpdateGuest, useDeleteGuest } from "@/hooks/useGuest";
import { useGetHomeContractsByGuest } from "@/hooks/useHomeContract";
import { useGetServiceContractsByGuest } from "@/hooks/useServiceContract";
import { useUploadFile } from "@/hooks/useUpload";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { GuestDetailInfo } from "@/components/GuestPage/GuestDetailInfo";
import { HomeContractDetailsDialog } from "@/components/HomeContractsPage/HomeContractDetailsDialog";
import { ServiceContractDetailsDialog } from "@/components/ServiceContractsPage/ServiceContractDetailsDialog";
import { IUpdateGuestBody } from "@/interface/request/guest";
import { IUploadResponse } from "@/interface/response/upload";
import { IHomeContract } from "@/interface/response/homeContract";
import { IServiceContract } from "@/interface/response/serviceContract";
import { formatDate } from "@/utils/dateFormat";
import { formatCurrency } from "@/utils/format";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IconPencil, IconTrash, IconLoader2, IconCheck, IconX, IconUpload, IconAlertTriangle, IconEye } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface GuestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  guestId: string;
  onSuccess?: () => void;
}

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
  province_code: number;
}

interface Ward {
  code: number;
  name: string;
  district_code: number;
}

// Combined contract interface for unified table
interface CombinedContract {
  _id: string;
  type: 'home' | 'service';
  contractCode?: string;
  serviceName?: string;
  homeName?: string;
  homeAddress?: string;
  startDate: string;
  duration: number;
  price: number;
  deposit?: number;
  payCycle: number;
  status: number;
  createdAt?: string;
}

export const GuestDetailsDialog = ({ isOpen, onClose, guestId, onSuccess }: GuestDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [selectedContractType, setSelectedContractType] = useState<'home' | 'service' | null>(null);
  const [isHomeContractDialogOpen, setIsHomeContractDialogOpen] = useState(false);
  const [isServiceContractDialogOpen, setIsServiceContractDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<IUpdateGuestBody>({
    fullname: "",
    phone: "",
    email: "",
    citizenId: "",
    citizen_date: "",
    citizen_place: "",
    birthday: "",
    hometown: "",
    note: "",
    gender: undefined,
    avatarUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Address selection states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Date input states for display (dd/MM/yyyy format)
  const [citizenDateInput, setCitizenDateInput] = useState("");
  const [birthdayInput, setBirthdayInput] = useState("");

  // Avatar upload state
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Date format validation function
  const isValidDateFormat = (dateString: string): boolean => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(dateString)) return false;
    
    const [, day, month, year] = dateString.match(dateRegex)!;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return (
      date.getDate() === parseInt(day) &&
      date.getMonth() === parseInt(month) - 1 &&
      date.getFullYear() === parseInt(year)
    );
  };

  // Convert dd/MM/yyyy to ISO string
  const convertToISOString = (dateString: string): string => {
    if (!dateString || !isValidDateFormat(dateString)) return "";
    
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toISOString();
  };

  // Convert ISO string to dd/MM/yyyy
  const convertFromISOString = (isoString: string): string => {
    if (!isoString) return "";
    
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    return `${day}/${month}/${year}`;
  };

  const { data: guestData, isLoading, error, refetch } = useGetGuestDetail({
    id: guestId
  });

  const { data: homeContractsData, isLoading: isLoadingHomeContracts } = useGetHomeContractsByGuest({
    guestId: guestId
  });

  const { data: serviceContractsData, isLoading: isLoadingServiceContracts } = useGetServiceContractsByGuest({
    guestId: guestId
  });

  const { mutate: updateGuestMutation, isPending: isUpdating } = useUpdateGuest();
  const { mutate: deleteGuestMutation, isPending: isDeleting } = useDeleteGuest();
  const { mutate: uploadFileMutation } = useUploadFile();

  // Combine contracts for unified table
  const homeContracts = Array.isArray(homeContractsData?.data)
    ? homeContractsData.data
    : homeContractsData?.data?.contracts || [];

  const serviceContracts = Array.isArray(serviceContractsData?.data)
    ? serviceContractsData.data
    : serviceContractsData?.data?.contracts || [];

  const combinedContracts: CombinedContract[] = [
    ...homeContracts.map((contract: any): CombinedContract => ({
      _id: contract._id,
      type: 'home',
      contractCode: contract.contractCode,
      homeName: contract.homeId ?
        `${contract.homeId.building} - ${contract.homeId.apartmentNv || ''}` :
        `Căn hộ #${contract._id}`,
      homeAddress: contract.homeId ?
        `${contract.homeId.address}, ${contract.homeId.ward}, ${contract.homeId.district}` :
        '',
      startDate: contract.dateStar,
      duration: contract.duration,
      price: contract.renta,
      deposit: contract.deposit,
      payCycle: contract.payCycle,
      status: contract.status,
      createdAt: contract.createdAt,
    })),
    ...serviceContracts.map((contract: any): CombinedContract => ({
      _id: contract._id,
      type: 'service',
      serviceName: contract.serviceId && typeof contract.serviceId === 'object' ?
        contract.serviceId.name :
        `Dịch vụ #${contract.serviceId}`,
      homeName: contract.homeId && typeof contract.homeId === 'object' ?
        `${contract.homeId.building} - ${contract.homeId.apartmentNv || ''}` :
        `Căn hộ #${contract.homeId}`,
      startDate: contract.dateStar,
      duration: contract.duration,
      price: contract.price,
      payCycle: contract.payCycle,
      status: contract.status,
      createdAt: contract.createdAt,
    }))
  ];

  // Sort contracts by creation date (newest first)
  const sortedContracts = combinedContracts.sort((a, b) =>
    new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );

  // Pagination logic
  const totalContracts = sortedContracts.length;
  const totalPages = Math.ceil(totalContracts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContracts = sortedContracts.slice(startIndex, endIndex);

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch('https://provinces.open-api.vn/api/');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        toast.error('Không thể tải danh sách tỉnh/thành');
      } finally {
        setLoadingProvinces(false);
      }
    };

    if (isEditing) {
      fetchProvinces();
    }
  }, [isEditing]);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
          const data = await response.json();
          setDistricts(data.districts || []);
          setSelectedDistrict("");
          setSelectedWard("");
          setWards([]);
        } catch (error) {
          toast.error('Không thể tải danh sách quận/huyện');
        } finally {
          setLoadingDistricts(false);
        }
      };

      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          setLoadingWards(true);
          const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
          const data = await response.json();
          setWards(data.wards || []);
          setSelectedWard("");
        } catch (error) {
          toast.error('Không thể tải danh sách phường/xã');
        } finally {
          setLoadingWards(false);
        }
      };

      fetchWards();
    } else {
      setWards([]);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  // Update hometown when address components change
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard && specificAddress) {
      const provinceName = provinces.find(p => p.code.toString() === selectedProvince)?.name || "";
      const districtName = districts.find(d => d.code.toString() === selectedDistrict)?.name || "";
      const wardName = wards.find(w => w.code.toString() === selectedWard)?.name || "";

      const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;
      setFormData(prev => ({ ...prev, hometown: fullAddress }));
    }
  }, [selectedProvince, selectedDistrict, selectedWard, specificAddress, provinces, districts, wards]);

  useEffect(() => {
    if (guestData?.data) {
      const guest = guestData.data;
      setFormData({
        fullname: guest.fullname,
        phone: guest.phone,
        email: guest.email,
        citizenId: guest.citizenId,
        citizen_date: guest.citizen_date,
        citizen_place: guest.citizen_place,
        birthday: guest.birthday,
        hometown: guest.hometown,
        note: guest.note,
        gender: guest.gender,
        avatarUrl: guest.avatarUrl || "",
      });

      // Set date input values
      setCitizenDateInput(guest.citizen_date ? convertFromISOString(guest.citizen_date) : "");
      setBirthdayInput(guest.birthday ? convertFromISOString(guest.birthday) : "");
    }
  }, [guestData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateInputChange = (field: 'citizen_date' | 'birthday', value: string) => {
    // Update display value
    if (field === 'citizen_date') {
      setCitizenDateInput(value);
    } else {
      setBirthdayInput(value);
    }

    // Clear previous error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Validate and convert to ISO if valid
    if (value.trim() === "") {
      // Empty value is allowed
      setFormData((prev) => ({ ...prev, [field]: "" }));
    } else if (isValidDateFormat(value)) {
      // Valid format, convert to ISO
      const isoString = convertToISOString(value);
      setFormData((prev) => ({ ...prev, [field]: isoString }));
    } else if (value.length === 10) {
      // Full length but invalid format, show error
      setErrors((prev) => ({ 
        ...prev, 
        [field]: "Định dạng ngày không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy" 
      }));
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value === "male" }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const isValidType = file.type.startsWith('image/');
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
    
    if (!isValidType) {
      toast.error(`File ${file.name} không phải là hình ảnh hợp lệ`);
      return;
    }
    if (!isValidSize) {
      toast.error(`File ${file.name} quá lớn (tối đa 10MB)`);
      return;
    }

    setIsUploadingAvatar(true);

    uploadFileMutation({ file }, {
      onSuccess: (response: IUploadResponse) => {
        if (response?.statusCode === 200 || response?.statusCode === 201) {
          const imageUrl = response?.data?.url;
          
          if (imageUrl) {
            setFormData(prev => ({ ...prev, avatarUrl: imageUrl }));
            toast.success(`Upload ảnh "${file.name}" thành công!`);
          } else {
            console.error('No URL in response:', response);
            toast.error(`Lỗi: Không nhận được URL ảnh từ server cho file "${file.name}"`);
          }
        } else {
          console.error('Upload failed with status:', response?.statusCode, response?.message);
          toast.error(`Lỗi upload ảnh "${file.name}": ${response?.message || 'Lỗi không xác định'}`);
        }
        setIsUploadingAvatar(false);
      },
      onError: (error: any) => {
        console.error('Upload error for file:', file.name, error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Không thể upload ảnh';
        toast.error(`Lỗi upload ảnh "${file.name}": ${errorMessage}`);
        setIsUploadingAvatar(false);
      }
    });

    // Clear the input value to allow re-uploading the same file
    e.target.value = '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullname?.trim()) newErrors.fullname = "Họ tên không được để trống";
    if (!formData.phone?.trim()) newErrors.phone = "Số điện thoại không được để trống";

    if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original values
    if (guestData?.data) {
      const guest = guestData.data;
      setFormData({
        fullname: guest.fullname,
        phone: guest.phone,
        email: guest.email,
        citizenId: guest.citizenId,
        citizen_date: guest.citizen_date,
        citizen_place: guest.citizen_place,
        birthday: guest.birthday,
        hometown: guest.hometown,
        note: guest.note,
        gender: guest.gender,
        avatarUrl: guest.avatarUrl || "",
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateGuestMutation(
      {
        params: { id: guestId },
        body: formData
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Cập nhật thông tin khách hàng thành công");
            setIsEditing(false);
            refetch();
            onSuccess?.();
          } else {
            toast.error("Cập nhật thông tin khách hàng thất bại");
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteGuestMutation(
      { id: guestId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa khách hàng thành công");
            setIsDeleteDialogOpen(false);
            onSuccess?.();
            onClose();
          } else {
            toast.error("Xóa khách hàng thất bại");
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  const handleViewContract = (contractId: string, contractType: 'home' | 'service') => {
    setSelectedContractId(contractId);
    setSelectedContractType(contractType);

    if (contractType === 'home') {
      setIsHomeContractDialogOpen(true);
    } else {
      setIsServiceContractDialogOpen(true);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 1:
        return <Badge className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-100 text-nowrap">Hoạt động</Badge>;
      case 2:
        return <Badge variant="outline">Hết hạn</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getContractTypeBadge = (type: 'home' | 'service') => {
    return type === 'home' ? (
      <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-nowrap">Thuê nhà</Badge>
    ) : (
      <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-nowrap">Dịch vụ</Badge>
    );
  };

  const getPayCycleText = (payCycle: number) => {
    switch (payCycle) {
      case 1:
        return "Hàng tháng";
      case 3:
        return "Hàng quý";
      case 6:
        return "6 tháng";
      case 12:
        return "Hàng năm";
      default:
        return `${payCycle} tháng`;
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              Chi tiết khách hàng
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <Card className="!p-0">
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle  >
              {isEditing ? "Chỉnh sửa thông tin khách hàng" : "Chi tiết khách hàng"}
            </DialogTitle>
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="flex w-full items-center justify-end gap-4">
                {!isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleDelete}
                    >
                      <IconTrash className="h-4 w-4" />
                      Xóa
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleEdit}
                    >
                      <IconPencil className="h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                    >
                      <IconX className="h-4 w-4" />
                      Hủy
                    </Button>
                    <Button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
                    >
                      {isUpdating ? (
                        <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <IconCheck className="h-4 w-4" />
                      )}
                      Cập nhật
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-6">


              {/* Guest Information Card */}
              <Card className="border border-lightBorderV1 bg-[#F9F9FC]">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="p-6 space-y-6">
                    {/* Avatar Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-secondaryTextV1">Ảnh đại diện</Label>
                        {isUploadingAvatar && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <IconLoader2 className="h-4 w-4 animate-spin" />
                            <span>Đang tải ảnh...</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="avatar-upload"
                            disabled={isUploadingAvatar}
                          />
                          <Label htmlFor="avatar-upload" className={`cursor-pointer ${isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-lightBorderV1 rounded-lg hover:border-mainTextHoverV1 hover:bg-blue-50/50 transition-all duration-200 group">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200">
                                {isUploadingAvatar ? (
                                  <IconLoader2 className="h-5 w-5 text-blue-600 animate-spin" />
                                ) : (
                                  <IconUpload className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium text-mainTextV1 group-hover:text-mainTextHoverV1">
                                  {isUploadingAvatar ? "Đang tải ảnh..." : "Tải ảnh đại diện lên"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Chọn ảnh (tối đa 10MB)
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* Avatar Preview */}
                        {formData.avatarUrl && (
                          <div className="grid grid-cols-1 gap-4">
                            <div className="relative group">
                              <div className="w-32 h-32 border border-lightBorderV1 rounded-lg overflow-hidden mx-auto">
                                <img
                                  src={formData.avatarUrl}
                                  alt="Ảnh đại diện"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={isUploadingAvatar}
                              >
                                <IconX className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-secondaryTextV1">
                          Họ tên <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="fullname"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleChange}
                          placeholder="Nhập họ tên"
                          className={`border-lightBorderV1 ${errors.fullname ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.fullname && (
                          <p className="text-sm text-mainDangerV1">{errors.fullname}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-secondaryTextV1">
                          Số điện thoại <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Nhập số điện thoại"
                          className={`border-lightBorderV1 ${errors.phone ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.phone && (
                          <p className="text-sm text-mainDangerV1">{errors.phone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-secondaryTextV1">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Nhập email"
                          className={`border-lightBorderV1 ${errors.email ? "border-mainDangerV1" : ""}`}
                          disabled
                        />
                        {errors.email && (
                          <p className="text-sm text-mainDangerV1">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="citizenId" className="text-secondaryTextV1">
                          Số CMND/CCCD
                        </Label>
                        <Input
                          id="citizenId"
                          name="citizenId"
                          value={formData.citizenId}
                          onChange={handleChange}
                          placeholder="Nhập số CMND/CCCD"
                          className="border-lightBorderV1"
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="citizen_date" className="text-secondaryTextV1">
                          Ngày cấp
                        </Label>
                        <Input
                          id="citizen_date"
                          value={citizenDateInput}
                          onChange={(e) => handleDateInputChange('citizen_date', e.target.value)}
                          placeholder="dd/MM/yyyy"
                          className={`border-lightBorderV1 ${errors.citizen_date ? "border-mainDangerV1" : ""}`}
                          maxLength={10}
                        />
                        {errors.citizen_date && (
                          <p className="text-sm text-mainDangerV1">{errors.citizen_date}</p>
                        )}
                        <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/03/2020)</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="citizen_place" className="text-secondaryTextV1">
                          Nơi cấp
                        </Label>
                        <Input
                          id="citizen_place"
                          name="citizen_place"
                          value={formData.citizen_place}
                          onChange={handleChange}
                          placeholder="Nhập nơi cấp"
                          className="border-lightBorderV1"
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthday" className="text-secondaryTextV1">
                          Ngày sinh
                        </Label>
                        <Input
                          id="birthday"
                          value={birthdayInput}
                          onChange={(e) => handleDateInputChange('birthday', e.target.value)}
                          placeholder="dd/MM/yyyy"
                          className={`border-lightBorderV1 ${errors.birthday ? "border-mainDangerV1" : ""}`}
                          maxLength={10}
                        />
                        {errors.birthday && (
                          <p className="text-sm text-mainDangerV1">{errors.birthday}</p>
                        )}
                        <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/03/1990)</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-secondaryTextV1">Giới tính</Label>
                        <RadioGroup
                          value={formData.gender === true ? "male" : formData.gender === false ? "female" : ""}
                          onValueChange={handleGenderChange}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Nam</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Nữ</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Address Selection */}
                    <div className="space-y-4">
                      <Label className="text-secondaryTextV1 text-lg font-semibold">Địa chỉ</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-secondaryTextV1">Tỉnh/Thành phố</Label>
                          <Select
                            value={selectedProvince}
                            onValueChange={setSelectedProvince}
                            disabled={loadingProvinces}
                          >
                            <SelectTrigger className="border-lightBorderV1">
                              <SelectValue placeholder={loadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"} />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem key={province.code} value={province.code.toString()}>
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-secondaryTextV1">Quận/Huyện</Label>
                          <Select
                            value={selectedDistrict}
                            onValueChange={setSelectedDistrict}
                            disabled={!selectedProvince || loadingDistricts}
                          >
                            <SelectTrigger className="border-lightBorderV1">
                              <SelectValue placeholder={
                                !selectedProvince
                                  ? "Vui lòng chọn tỉnh/thành phố trước"
                                  : loadingDistricts
                                    ? "Đang tải..."
                                    : "Chọn quận/huyện"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.map((district) => (
                                <SelectItem key={district.code} value={district.code.toString()}>
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-secondaryTextV1">Phường/Xã</Label>
                          <Select
                            value={selectedWard}
                            onValueChange={setSelectedWard}
                            disabled={!selectedDistrict || loadingWards}
                          >
                            <SelectTrigger className="border-lightBorderV1">
                              <SelectValue placeholder={
                                !selectedDistrict
                                  ? "Vui lòng chọn quận/huyện trước"
                                  : loadingWards
                                    ? "Đang tải..."
                                    : "Chọn phường/xã"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {wards.map((ward) => (
                                <SelectItem key={ward.code} value={ward.code.toString()}>
                                  {ward.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-secondaryTextV1">Địa chỉ cụ thể</Label>
                          <Input
                            value={specificAddress}
                            onChange={(e) => setSpecificAddress(e.target.value)}
                            placeholder="Số nhà, tên đường..."
                            className="border-lightBorderV1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-secondaryTextV1">Địa chỉ đầy đủ</Label>
                        <Input
                          value={formData.hometown}
                          readOnly
                          className="border-lightBorderV1 bg-gray-50"
                          placeholder="Địa chỉ sẽ được tự động tạo từ các trường trên"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note" className="text-secondaryTextV1">
                        Ghi chú
                      </Label>
                      <Textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Nhập ghi chú"
                        className="border-lightBorderV1 min-h-[120px]"
                      />
                    </div>
                  </form>
                ) : (
                  guestData?.data && <div className="p-4 bg-[#F9F9FC]">
                    <GuestDetailInfo guest={guestData.data} />
                  </div>
                )}
              </Card>

              {/* Contracts Table */}
              {!isEditing && (
                <Card className="border border-lightBorderV1">
                  <CardHeader>
                    Danh sách hợp đồng ({totalContracts})
                  </CardHeader>
                  <div className="!p-0">
                    {isLoadingHomeContracts || isLoadingServiceContracts ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                          <Skeleton key={index} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : totalContracts === 0 ? (
                      <div className="text-center py-8 text-secondaryTextV1">
                        Khách hàng chưa có hợp đồng nào
                      </div>
                    ) : (
                      <>
                        <div className="w-full overflow-x-auto">
                          <Table className="text-mainTextV1">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-medium text-mainTextV1">Loại</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Mã hợp đồng</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Thông tin</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Ngày bắt đầu</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Thời hạn</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Giá</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Trạng thái</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Thao tác</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedContracts.map((contract) => (
                                <TableRow
                                  key={`${contract.type}-${contract._id}`}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <TableCell>
                                    {getContractTypeBadge(contract.type)}
                                  </TableCell>
                                  <TableCell className="font-medium text-mainTextV1">
                                    <div className="flex flex-col">
                                      <span className="text-sm">
                                        {contract.contractCode || `${contract._id.substring(0, 8)}...`}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="font-medium text-sm">
                                        {contract.type === 'home' ? contract.homeName : contract.serviceName}
                                      </span>
                                      {contract.type === 'home' && contract.homeAddress && (
                                        <span className="text-xs text-secondaryTextV1">
                                          {contract.homeAddress}
                                        </span>
                                      )}
                                      {contract.type === 'service' && contract.homeName && (
                                        <span className="text-xs text-secondaryTextV1">
                                          Tại: {contract.homeName}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-sm font-medium">
                                      {formatDate(contract.startDate)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-sm font-medium">
                                    {contract.duration} tháng
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                      <span>{formatCurrency(contract.price)}</span>
                                      <span className="text-xs text-secondaryTextV1">
                                        {getPayCycleText(contract.payCycle)}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(contract.status)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleViewContract(contract._id, contract.type)}
                                      className="text-mainTextV1 hover:text-mainTextHoverV1 hover:bg-transparent"
                                    >
                                      <IconEye className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="mt-6 flex justify-center">
                            <Pagination
                              page={currentPage}
                              pageSize={itemsPerPage}
                              total={totalContracts}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent size="small" className="bg-white max-h-[90vh] h-fit overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              Xác nhận xóa khách hàng
            </DialogTitle>
            <DialogDescription className="text-secondaryTextV1 pt-2">
              Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 p-4 my-4 rounded-sm border border-red-200">
            <p className="text-mainTextV1 text-sm">
              Khi xóa khách hàng, tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
            </p>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeleting} className="text-secondaryTextV1">
                Hủy
              </Button>
            </DialogClose>

            <Button
              type="button"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <IconTrash className="mr-2 h-4 w-4" />
                  Xóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Home Contract Details Dialog */}
      {selectedContractId && selectedContractType === 'home' && (
        <HomeContractDetailsDialog
          isOpen={isHomeContractDialogOpen}
          onClose={() => {
            setIsHomeContractDialogOpen(false);
            setSelectedContractId(null);
            setSelectedContractType(null);
          }}
          contractId={selectedContractId}
          onSuccess={() => {
            // Optionally refetch contracts data
          }}
        />
      )}

      {/* Service Contract Details Dialog */}
      {selectedContractId && selectedContractType === 'service' && (
        <ServiceContractDetailsDialog
          isOpen={isServiceContractDialogOpen}
          onClose={() => {
            setIsServiceContractDialogOpen(false);
            setSelectedContractId(null);
            setSelectedContractType(null);
          }}
          contractId={selectedContractId}
          onSuccess={() => {
            // Optionally refetch contracts data
          }}
        />
      )}
    </>
  );
}; 
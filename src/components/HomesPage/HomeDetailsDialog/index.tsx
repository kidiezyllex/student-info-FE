"use client";

import { useEffect, useState } from "react";
import { useGetHomeDetail, useUpdateHome, useDeleteHome } from "@/hooks/useHome";
import { useGetHomeContractsByHome } from "@/hooks/useHomeContract";
import { useGetServiceContractsByHome } from "@/hooks/useServiceContract";
import { useGetHomeOwners } from "@/hooks/useHomeOwner";
import { useUploadFile } from "@/hooks/useUpload";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { HomeDetailInfo } from "@/components/HomesPage/HomeDetailInfo";
import { HomeContractDetailsDialog } from "@/components/HomeContractsPage/HomeContractDetailsDialog";
import { ServiceContractDetailsDialog } from "@/components/ServiceContractsPage/ServiceContractDetailsDialog";
import { IUpdateHomeBody } from "@/interface/request/home";
import { IHomeContract } from "@/interface/response/homeContract";
import { IServiceContract } from "@/interface/response/serviceContract";
import { IUploadResponse } from "@/interface/response/upload";
import { formatDate } from "@/utils/dateFormat";
import { formatCurrency } from "@/utils/format";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IconPencil, IconTrash, IconLoader2, IconCheck, IconX, IconAlertTriangle, IconEye, IconUpload, IconPhone } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import Icon from "@mdi/react";
import { mdiAccountTie } from "@mdi/js";

interface HomeDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  homeId: string;
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

interface CombinedContract {
  _id: string;
  type: 'home' | 'service';
  contractCode?: string;
  serviceName?: string;
  guestName?: string;
  guestPhone?: string;
  startDate: string;
  duration: number;
  price: number;
  deposit?: number;
  payCycle: number;
  status: number;
  createdAt?: string;
}

export const HomeDetailsDialog = ({ isOpen, onClose, homeId, onSuccess }: HomeDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [selectedContractType, setSelectedContractType] = useState<'home' | 'service' | null>(null);
  const [isHomeContractDialogOpen, setIsHomeContractDialogOpen] = useState(false);
  const [isServiceContractDialogOpen, setIsServiceContractDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<IUpdateHomeBody>({
    address: "",
    homeOwnerId: "",
    district: "",
    province: "",
    ward: "",
    building: "",
    apartmentNv: "",
    active: true,
    note: "",
    images: [],
    hasBathroom: false,
    hasBedroom: false,
    hasBalcony: false,
    hasKitchen: false,
    hasWifi: false,
    hasSoundproof: false,
    hasAirConditioner: false,
    hasWashingMachine: false,
    hasRefrigerator: false,
    hasElevator: false,
    hasParking: false,
    hasSecurity: false,
    hasGym: false,
    hasSwimmingPool: false,
    hasGarden: false,
    hasPetAllowed: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { data: homeData, isLoading, error, refetch } = useGetHomeDetail({
    id: homeId
  });
  const { data: homeContractsData, isLoading: isLoadingHomeContracts } = useGetHomeContractsByHome({
    homeId: homeId
  });

  const { data: serviceContractsData, isLoading: isLoadingServiceContracts } = useGetServiceContractsByHome({
    homeId: homeId
  });

  const { mutate: updateHomeMutation, isPending: isUpdating } = useUpdateHome();
  const { mutate: deleteHomeMutation, isPending: isDeleting } = useDeleteHome();
  const { data: homeOwnersData, isLoading: isLoadingHomeOwners, error: homeOwnersError } = useGetHomeOwners();
  const { mutate: uploadFileMutation } = useUploadFile();

  const amenitiesList = [
    { key: 'hasBathroom', label: 'Phòng tắm riêng' },
    { key: 'hasBedroom', label: 'Phòng ngủ riêng' },
    { key: 'hasBalcony', label: 'Ban công' },
    { key: 'hasKitchen', label: 'Bếp' },
    { key: 'hasWifi', label: 'Wifi' },
    { key: 'hasSoundproof', label: 'Cách âm' },
    { key: 'hasAirConditioner', label: 'Điều hòa' },
    { key: 'hasWashingMachine', label: 'Máy giặt' },
    { key: 'hasRefrigerator', label: 'Tủ lạnh' },
    { key: 'hasElevator', label: 'Thang máy' },
    { key: 'hasParking', label: 'Chỗ đậu xe' },
    { key: 'hasSecurity', label: 'Bảo vệ' },
    { key: 'hasGym', label: 'Phòng gym' },
    { key: 'hasSwimmingPool', label: 'Hồ bơi' },
    { key: 'hasGarden', label: 'Vườn' },
    { key: 'hasPetAllowed', label: 'Cho phép nuôi thú cưng' },
  ];

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
      guestName: contract.guestId && typeof contract.guestId === 'object' ?
        contract.guestId.fullname :
        `Khách hàng #${contract.guestId}`,
      guestPhone: contract.guestId && typeof contract.guestId === 'object' ?
        contract.guestId.phone : '',
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
      guestName: contract.guestId && typeof contract.guestId === 'object' ?
        contract.guestId.fullname :
        `Khách hàng #${contract.guestId}`,
      guestPhone: contract.guestId && typeof contract.guestId === 'object' ?
        contract.guestId.phone : '',
      startDate: contract.dateStar,
      duration: contract.duration,
      price: contract.price,
      payCycle: contract.payCycle,
      status: contract.status,
      createdAt: contract.createdAt,
    }))
  ];
  const getContractStatusBadge = () => {
    const contract = homeData?.data?.home?.homeContract;
    if (contract) {
      switch (contract.status) {
        case 0:
          return <Badge variant="destructive">Hợp đồng đã hủy</Badge>;
        case 1:
          return <Badge className="bg-green-500 hover:bg-green-600 text-white text-nowrap">Đang cho thuê</Badge>;
        case 2:
          return <Badge variant="outline">Hợp đồng hết hạn</Badge>;
        default:
          return <Badge className="bg-gray-500 hover:bg-gray-600 text-white text-nowrap">Không xác định</Badge>;
      }
    }
    return <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-400 text-nowrap">Chưa cho thuê</Badge>;
  };
  const sortedContracts = combinedContracts.sort((a, b) =>
    new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );

  const totalContracts = sortedContracts.length;
  const totalPages = Math.ceil(totalContracts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContracts = sortedContracts.slice(startIndex, endIndex);

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

  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard && specificAddress) {
      const provinceName = provinces.find(p => p.code.toString() === selectedProvince)?.name || "";
      const districtName = districts.find(d => d.code.toString() === selectedDistrict)?.name || "";
      const wardName = wards.find(w => w.code.toString() === selectedWard)?.name || "";

      const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;
      setFormData(prev => ({ ...prev, address: fullAddress }));
    }
  }, [selectedProvince, selectedDistrict, selectedWard, specificAddress, provinces, districts, wards]);

  useEffect(() => {
    if (homeData?.data) {
      const home = homeData.data as any;
      setFormData({
        address: home.address || "",
        homeOwnerId: home.homeOwnerId?._id || home.homeOwnerId || "",
        district: home.district || "",
        province: home.province || "",
        ward: home.ward || "",
        building: home.building || "",
        apartmentNv: home.apartmentNv || "",
        active: home.active ?? true,
        note: home.note || "",
        images: home.images || [],
        hasBathroom: home.hasBathroom || false,
        hasBedroom: home.hasBedroom || false,
        hasBalcony: home.hasBalcony || false,
        hasKitchen: home.hasKitchen || false,
        hasWifi: home.hasWifi || false,
        hasSoundproof: home.hasSoundproof || false,
        hasAirConditioner: home.hasAirConditioner || false,
        hasWashingMachine: home.hasWashingMachine || false,
        hasRefrigerator: home.hasRefrigerator || false,
        hasElevator: home.hasElevator || false,
        hasParking: home.hasParking || false,
        hasSecurity: home.hasSecurity || false,
        hasGym: home.hasGym || false,
        hasSwimmingPool: home.hasSwimmingPool || false,
        hasGarden: home.hasGarden || false,
        hasPetAllowed: home.hasPetAllowed || false,
      });

      if (home.province && home.district && home.ward) {
        const fullAddress = home.address || "";
        const provinceName = home.province;
        const districtName = home.district;
        const wardName = home.ward;
        
        const addressParts = fullAddress.split(', ');
        if (addressParts.length >= 4) {
          setSpecificAddress(addressParts[0]);
        }
      }
    }
  }, [homeData]);

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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAmenityChange = (amenityKey: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [amenityKey]: checked }));
  };

  const handleHomeOwnerSelect = (homeOwnerId: string) => {
    setFormData((prev) => ({ ...prev, homeOwnerId }));
    if (errors.homeOwnerId) {
      setErrors((prev) => ({ ...prev, homeOwnerId: "" }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024;
      
      if (!isValidType) {
        toast.error(`File ${file.name} không phải là hình ảnh hợp lệ`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`File ${file.name} quá lớn (tối đa 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newFiles = [...imageFiles, ...validFiles];
    setImageFiles(newFiles);
    
    const newUploadingStates = [...uploadingImages];
    validFiles.forEach(() => {
      newUploadingStates.push(true);
    });
    setUploadingImages(newUploadingStates);

    validFiles.forEach((file, i) => {
      const uploadIndex = imageFiles.length + i;
      uploadFileMutation({ file }, {
        onSuccess: (response: IUploadResponse) => {
          if (response?.statusCode === 200 || response?.statusCode === 201) {
            const imageUrl = response?.data?.url;
            
            if (imageUrl) {
              setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), imageUrl]
              }));
              toast.success(`Upload ảnh "${file.name}" thành công!`);
            } else {
              console.error('No URL in response:', response);
              toast.error(`Lỗi: Không nhận được URL ảnh từ server cho file "${file.name}"`);
            }
          } else {
            console.error('Upload failed with status:', response?.statusCode, response?.message);
            toast.error(`Lỗi upload ảnh "${file.name}": ${response?.message || 'Lỗi không xác định'}`);
          }
          
          setUploadingImages(prev => {
            const newStates = [...prev];
            newStates[uploadIndex] = false;
            return newStates;
          });
        },
        onError: (error: any) => {
          console.error('Upload error for file:', file.name, error);
          const errorMessage = error?.response?.data?.message || error?.message || 'Không thể upload ảnh';
          toast.error(`Lỗi upload ảnh "${file.name}": ${errorMessage}`);
          
          setUploadingImages(prev => {
            const newStates = [...prev];
            newStates[uploadIndex] = false;
            return newStates;
          });
        }
      });
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setUploadingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.homeOwnerId?.trim()) newErrors.homeOwnerId = "Vui lòng chọn chủ nhà";
    if (!formData.building?.trim()) newErrors.building = "Tên tòa nhà không được để trống";
    if (!formData.apartmentNv?.trim()) newErrors.apartmentNv = "Số căn hộ không được để trống";
    if (!formData.address?.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!formData.district?.trim()) newErrors.district = "Quận/huyện không được để trống";
    if (!formData.ward?.trim()) newErrors.ward = "Phường/xã không được để trống";

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const errorCount = Object.keys(newErrors).length;
      toast.warning(`Vui lòng điền đầy đủ thông tin! Còn ${errorCount} trường bắt buộc chưa điền.`);
      return false;
    }
    
    return true;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setSpecificAddress("");
    setImageFiles([]);
    setUploadingImages([]);
    
    if (homeData?.data) {
      const home = homeData.data as any;
      setFormData({
        address: home.address || "",
        homeOwnerId: home.homeOwnerId?._id || home.homeOwnerId || "",
        district: home.district || "",
        province: home.province || "",
        ward: home.ward || "",
        building: home.building || "",
        apartmentNv: home.apartmentNv || "",
        active: home.active ?? true,
        note: home.note || "",
        images: home.images || [],
        hasBathroom: home.hasBathroom || false,
        hasBedroom: home.hasBedroom || false,
        hasBalcony: home.hasBalcony || false,
        hasKitchen: home.hasKitchen || false,
        hasWifi: home.hasWifi || false,
        hasSoundproof: home.hasSoundproof || false,
        hasAirConditioner: home.hasAirConditioner || false,
        hasWashingMachine: home.hasWashingMachine || false,
        hasRefrigerator: home.hasRefrigerator || false,
        hasElevator: home.hasElevator || false,
        hasParking: home.hasParking || false,
        hasSecurity: home.hasSecurity || false,
        hasGym: home.hasGym || false,
        hasSwimmingPool: home.hasSwimmingPool || false,
        hasGarden: home.hasGarden || false,
        hasPetAllowed: home.hasPetAllowed || false,
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    updateHomeMutation(
      {
        params: { id: homeId },
        body: formData
      },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Cập nhật thông tin căn hộ thành công");
            setIsEditing(false);
            refetch();
            onSuccess?.();
          } else {
            toast.error("Cập nhật thông tin căn hộ thất bại");
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
    deleteHomeMutation(
      { id: homeId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa căn hộ thành công");
            setIsDeleteDialogOpen(false);
            onSuccess?.();
            onClose();
          } else {
            toast.error("Xóa căn hộ thất bại");
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

  const getAvailableOwners = () => {
    if (homeOwnersData?.data && Array.isArray(homeOwnersData.data)) {
      return homeOwnersData.data;
    }
    if (homeOwnersData?.data?.owners && Array.isArray(homeOwnersData.data.owners)) {
      return homeOwnersData.data.owners;
    }
    return [];
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
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-white text-nowrap">Không xác định</Badge>;
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

  const amenityLabels = {
    hasBathroom: 'Phòng tắm',
    hasBedroom: 'Phòng ngủ',
    hasBalcony: 'Ban công',
    hasKitchen: 'Nhà bếp',
    hasWifi: 'Wifi',
    hasSoundproof: 'Cách âm',
    hasAirConditioner: 'Điều hòa',
    hasWashingMachine: 'Máy giặt',
    hasRefrigerator: 'Tủ lạnh',
    hasElevator: 'Thang máy',
    hasParking: 'Chỗ đậu xe',
    hasSecurity: 'Bảo vệ',
    hasGym: 'Phòng gym',
    hasSwimmingPool: 'Hồ bơi',
    hasGarden: 'Vườn',
    hasPetAllowed: 'Cho phép thú cưng',
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle  >
              Chi tiết căn hộ
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
        <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-medium text-mainTextV1 flex items-center gap-2">
              {getContractStatusBadge()}
              {isEditing ? "Chỉnh sửa thông tin căn hộ" : "Chi tiết căn hộ"}
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
              {/* Home Information Card */}
              <Card className="border border-lightBorderV1 bg-[#F9F9FC]">
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="p-6 space-y-6">
                    {/* Home Owner Selection */}
                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">
                        Chủ nhà <span className="text-mainDangerV1">*</span>
                      </Label>
                      <Select value={formData.homeOwnerId} onValueChange={handleHomeOwnerSelect}>
                        <SelectTrigger className={`border-lightBorderV1 ${errors.homeOwnerId ? "border-mainDangerV1" : ""}`}>
                          <SelectValue placeholder="Chọn chủ nhà">
                            {formData.homeOwnerId && getAvailableOwners().length > 0 && (() => {
                              const selectedOwner = getAvailableOwners().find(owner => owner._id === formData.homeOwnerId);
                              return selectedOwner ? `${selectedOwner.fullname} (${selectedOwner.phone})` : "Chọn chủ nhà";
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingHomeOwners ? (
                            <SelectItem value="loading" disabled>
                              <div className="flex items-center space-x-2">
                                <IconLoader2 className="w-4 h-4 animate-spin" />
                                <span>Đang tải...</span>
                              </div>
                            </SelectItem>
                          ) : homeOwnersError ? (
                            <SelectItem value="error" disabled>
                              <div className="flex items-center space-x-2 text-red-500">
                                <span>Lỗi tải dữ liệu</span>
                              </div>
                            </SelectItem>
                          ) : getAvailableOwners().length > 0 ? (
                            getAvailableOwners().map((owner, index) => (
                              <>
                                <SelectItem key={owner._id} value={owner._id}>
                                  <div className="flex items-center space-x-3 py-1">
                                    <div className="flex-shrink-0">
                                      <div className="w-8 h-8 border rounded-full bg-slate-100 flex items-center justify-center">
                                        <Icon
                                          path={mdiAccountTie}
                                          size={0.8}
                                          className="text-slate-400"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-500 truncate">
                                        {owner.fullname}
                                      </div>
                                      <div className="flex items-center text-sm text-mainTextV1">
                                        <IconPhone className="w-3 h-3 mr-1" />
                                        {owner.phone}
                                      </div>
                                    </div>
                                  </div>
                                </SelectItem>
                                {index < getAvailableOwners().length - 1 && <SelectSeparator />}
                              </>
                            ))
                          ) : (
                            <SelectItem value="no-data" disabled>
                              <span className="text-mainTextV1">Không có dữ liệu chủ nhà</span>
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.homeOwnerId && (
                        <p className="text-sm text-mainDangerV1">{errors.homeOwnerId}</p>
                      )}
                    </div>

                    {/* Address Selection */}
                    <div className="space-y-4">
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
                          value={formData.address}
                          readOnly
                          className="border-lightBorderV1 bg-gray-50"
                          placeholder="Địa chỉ sẽ được tự động tạo từ các trường trên"
                        />
                        {errors.address && (
                          <p className="text-sm text-mainDangerV1">{errors.address}</p>
                        )}
                      </div>
                    </div>

                    {/* Building Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="building" className="text-secondaryTextV1">
                          Tòa nhà <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="building"
                          name="building"
                          value={formData.building}
                          onChange={handleChange}
                          placeholder="Nhập tên tòa nhà"
                          className={`border-lightBorderV1 ${errors.building ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.building && (
                          <p className="text-sm text-mainDangerV1">{errors.building}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="apartmentNv" className="text-secondaryTextV1">
                          Số căn hộ <span className="text-mainDangerV1">*</span>
                        </Label>
                        <Input
                          id="apartmentNv"
                          name="apartmentNv"
                          value={formData.apartmentNv}
                          onChange={handleChange}
                          placeholder="Nhập số căn hộ"
                          className={`border-lightBorderV1 ${errors.apartmentNv ? "border-mainDangerV1" : ""}`}
                        />
                        {errors.apartmentNv && (
                          <p className="text-sm text-mainDangerV1">{errors.apartmentNv}</p>
                        )}
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">Trạng thái hoạt động</Label>
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={formData.active}
                          onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                        />
                        <span className="text-sm text-mainTextV1">
                          {formData.active ? "Đang hoạt động" : "Không hoạt động"}
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                      <Label className="text-secondaryTextV1">Tiện nghi</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {amenitiesList.map((amenity) => (
                          <div key={amenity.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity.key}
                              checked={formData[amenity.key as keyof typeof formData] as boolean}
                              onCheckedChange={(checked) => handleAmenityChange(amenity.key, checked as boolean)}
                            />
                            <Label htmlFor={amenity.key} className="text-sm text-mainTextV1 cursor-pointer">
                              {amenity.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-secondaryTextV1">Hình ảnh căn hộ</Label>
                        {uploadingImages.some(uploading => uploading) && (
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
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={uploadingImages.some(uploading => uploading)}
                          />
                          <Label htmlFor="image-upload" className={`cursor-pointer ${uploadingImages.some(uploading => uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-lightBorderV1 rounded-lg hover:border-mainTextHoverV1 hover:bg-blue-50/50 transition-all duration-200 group">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200">
                                <IconUpload className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium text-mainTextV1 group-hover:text-mainTextHoverV1">
                                  Tải ảnh lên
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Chọn nhiều ảnh cùng lúc (tối đa 10MB/ảnh)
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* Image Preview */}
                        {(formData.images && formData.images.length > 0) && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {formData.images.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <div className="w-full h-32 border border-lightBorderV1 rounded-lg overflow-hidden">
                                  {uploadingImages[index] ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                      <IconLoader2 className="h-6 w-6 animate-spin text-gray-500" />
                                    </div>
                                  ) : (
                                    <img
                                      src={imageUrl}
                                      alt={`Ảnh căn hộ ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                {!uploadingImages[index] && (
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <IconX className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                      <Label htmlFor="note" className="text-secondaryTextV1">
                        Ghi chú
                      </Label>
                      <Textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Nhập ghi chú về căn hộ"
                        className="border-lightBorderV1 min-h-[80px]"
                      />
                    </div>
                  </form>
                ) : (
                  homeData?.data && <div className="p-4 bg-[#F9F9FC]">
                    <HomeDetailInfo home={homeData.data as any} />
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
                        Căn hộ chưa có hợp đồng nào
                      </div>
                    ) : (
                      <>
                        <div className="w-full overflow-x-auto">
                          <Table className="text-mainTextV1">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-medium text-mainTextV1">Loại</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Mã hợp đồng</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Khách hàng</TableHead>
                                <TableHead className="font-medium text-mainTextV1">Dịch vụ</TableHead>
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
                                        {contract.guestName}
                                      </span>
                                      {contract.guestPhone && (
                                        <span className="text-xs text-secondaryTextV1">
                                          {contract.guestPhone}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-sm">
                                      {contract.type === 'service' ? contract.serviceName : '--'}
                                    </span>
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
              Xác nhận xóa căn hộ
            </DialogTitle>
            <DialogDescription className="text-secondaryTextV1 pt-2">
              Bạn có chắc chắn muốn xóa căn hộ này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 p-4 my-4 rounded-sm border border-red-200">
            <p className="text-mainTextV1 text-sm">
              Khi xóa căn hộ, tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
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
          }}
        />
      )}
    </>
  );
};

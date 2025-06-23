"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateHome } from "@/hooks/useHome";
import { useGetHomeOwners } from "@/hooks/useHomeOwner";
import { useUploadFile } from "@/hooks/useUpload";
import { ICreateHomeBody } from "@/interface/request/home";
import { IUploadResponse } from "@/interface/response/upload";
import { toast } from "react-toastify";
import { IconLoader2, IconUpload, IconX, IconMapPin, IconPhone } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Icon from "@mdi/react";
import { mdiAccountTie } from "@mdi/js";

interface HomeCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
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

export const HomeCreateDialog = ({ isOpen, onClose, onSuccess }: HomeCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateHomeBody>({
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
    // Amenities
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

  // Image upload states
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { mutate: createHomeMutation, isPending } = useCreateHome();
  const { data: homeOwnersData, isLoading: isLoadingHomeOwners, error: homeOwnersError } = useGetHomeOwners();
  const { mutate: uploadFileMutation } = useUploadFile();

  // Amenities list for checkboxes
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

    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen]);

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

  // Update address when address components change
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard && specificAddress) {
      const provinceName = provinces.find(p => p.code.toString() === selectedProvince)?.name || "";
      const districtName = districts.find(d => d.code.toString() === selectedDistrict)?.name || "";
      const wardName = wards.find(w => w.code.toString() === selectedWard)?.name || "";

      const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;
      setFormData(prev => ({ ...prev, address: fullAddress, province: provinceName }));
    }
  }, [selectedProvince, selectedDistrict, selectedWard, specificAddress, provinces, districts, wards]);

  // Update district and ward names when selections change
  useEffect(() => {
    if (selectedDistrict) {
      const districtName = districts.find(d => d.code.toString() === selectedDistrict)?.name || "";
      setFormData(prev => ({ ...prev, district: districtName }));
    }
  }, [selectedDistrict, districts]);

  useEffect(() => {
    if (selectedWard) {
      const wardName = wards.find(w => w.code.toString() === selectedWard)?.name || "";
      setFormData(prev => ({ ...prev, ward: wardName }));
    }
  }, [selectedWard, wards]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }));
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

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
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

    // Update file states
    const newFiles = [...imageFiles, ...validFiles];
    setImageFiles(newFiles);
    
    // Initialize uploading states for new files
    const newUploadingStates = [...uploadingImages];
    validFiles.forEach(() => {
      newUploadingStates.push(true);
    });
    setUploadingImages(newUploadingStates);

        // Upload each valid file
    validFiles.forEach((file, i) => {
      const uploadIndex = imageFiles.length + i;
      uploadFileMutation({ file }, {
        onSuccess: (response: IUploadResponse) => {
          if (response?.statusCode === 200 || response?.statusCode === 201) {
            // Check if response has the expected structure
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
          
          // Update uploading state
          setUploadingImages(prev => {
            const newStates = [...prev];
            newStates[uploadIndex] = false;
            return newStates;
          });
        },
        onError: (error: any) => {
          console.error('Upload error for file:', file.name, error); // Debug log
          const errorMessage = error?.response?.data?.message || error?.message || 'Không thể upload ảnh';
          toast.error(`Lỗi upload ảnh "${file.name}": ${errorMessage}`);
          
          // Update uploading state
          setUploadingImages(prev => {
            const newStates = [...prev];
            newStates[uploadIndex] = false;
            return newStates;
          });
        }
      });
    });

    // Clear the input value to allow re-uploading the same file
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
    
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }
    if (!formData.homeOwnerId.trim()) {
      newErrors.homeOwnerId = "Vui lòng chọn chủ nhà";
    }
    if (!formData.district.trim()) {
      newErrors.district = "Quận/Huyện không được để trống";
    }
    if (!formData.ward.trim()) {
      newErrors.ward = "Phường/Xã không được để trống";
    }
    if (!formData.building.trim()) {
      newErrors.building = "Tòa nhà không được để trống";
    }
    if (!formData.apartmentNv.trim()) {
      newErrors.apartmentNv = "Số căn hộ không được để trống";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const errorCount = Object.keys(newErrors).length;
      toast.warning(`Vui lòng điền đầy đủ thông tin! Còn ${errorCount} trường bắt buộc chưa điền.`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Include images in the submission data
    const homeData = { ...formData };
    
    createHomeMutation(homeData as ICreateHomeBody, {
      onSuccess: (response: any) => {
        if (response.statusCode === 500) {
          toast.error(response.message || "Lỗi hệ thống, vui lòng thử lại sau");
          return;
        }
        if (response.statusCode === 200 || response.statusCode === 201) {
          toast.success(response.message || "Tạo căn hộ thành công!");
          resetForm();
          onSuccess?.();
          onClose();
        } else {
          toast.error(response.message || "Tạo căn hộ thất bại");
        }
      },
      onError: (error: any) => {
        console.error("Error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo căn hộ";
        toast.error(errorMessage);
      }
    });
  };

  const resetForm = () => {
    setFormData({
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
      // Reset amenities
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
    setErrors({});
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setSpecificAddress("");
    setImageFiles([]);
    setUploadingImages([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get available owners data
  const getAvailableOwners = () => {
    if (homeOwnersData?.data && Array.isArray(homeOwnersData.data)) {
      return homeOwnersData.data;
    }
    if (homeOwnersData?.data?.owners && Array.isArray(homeOwnersData.data.owners)) {
      return homeOwnersData.data.owners;
    }
    return [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle  >
            Tạo căn hộ mới
          </DialogTitle>
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              {isPending ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : 'Tạo căn hộ'}
            </Button>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-[#F9F9FC]">
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      onCheckedChange={handleSwitchChange}
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
                          checked={formData[amenity.key as keyof ICreateHomeBody] as boolean}
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
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}; 
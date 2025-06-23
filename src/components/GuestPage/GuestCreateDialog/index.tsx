"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateGuest } from "@/hooks/useGuest";
import { useUploadFile } from "@/hooks/useUpload";
import { ICreateGuestBody } from "@/interface/request/guest";
import { IUploadResponse } from "@/interface/response/upload";
import { toast } from "react-toastify"
import { IconLoader2, IconUpload, IconX } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GuestCreateDialogProps {
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

export const GuestCreateDialog = ({ isOpen, onClose, onSuccess }: GuestCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateGuestBody>({
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

  // Date input states for display (dd/MM/yyyy format)
  const [citizenDateInput, setCitizenDateInput] = useState("");
  const [birthdayInput, setBirthdayInput] = useState("");

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

  // Avatar upload state
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const { mutate: createGuestMutation, isPending } = useCreateGuest();
  const { mutate: uploadFileMutation } = useUploadFile();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
    
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Họ tên không được để trống";
      toast.error("Vui lòng nhập họ tên");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
      toast.error("Vui lòng nhập số điện thoại");
    }
    if (!formData.citizenId.trim()) {
      newErrors.citizenId = "Số CMND/CCCD không được để trống";
      toast.error("Vui lòng nhập số CMND/CCCD");
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      toast.error("Email không đúng định dạng");
    }
    if (formData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      toast.error("Số điện thoại không đúng định dạng");
    }

    // Validate date formats
    if (citizenDateInput && !isValidDateFormat(citizenDateInput)) {
      newErrors.citizen_date = "Định dạng ngày cấp không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy";
      toast.error("Định dạng ngày cấp không hợp lệ");
    }
    if (birthdayInput && !isValidDateFormat(birthdayInput)) {
      newErrors.birthday = "Định dạng ngày sinh không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy";
      toast.error("Định dạng ngày sinh không hợp lệ");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    createGuestMutation(formData, {
      onSuccess: (response: any) => {
        if (response.statusCode === 500) {
          toast.error(response.message || "Lỗi hệ thống, vui lòng thử lại sau");
          return;
        }
        if (response.statusCode === 200 || response.statusCode === 201) {
          toast.success(response.message || "Tạo khách hàng thành công!");
          setFormData({
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
          setErrors({});
          setCitizenDateInput("");
          setBirthdayInput("");
          setSelectedProvince("");
          setSelectedDistrict("");
          setSelectedWard("");
          setSpecificAddress("");
          onSuccess?.();
          onClose();
        } else {
          toast.error(response.message || "Tạo khách hàng thất bại");
        }
      },
      onError: (error: any) => {
        console.error("Error:", error); // For debugging
        const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo khách hàng";
        toast.error(errorMessage);
      }
    });
  };

  const handleClose = () => {
    setFormData({
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
    setErrors({});
    setCitizenDateInput("");
    setBirthdayInput("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setSpecificAddress("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium" className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            Tạo khách hàng mới
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
              ) : 'Tạo khách hàng'}
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
                    />
                    {errors.email && (
                      <p className="text-sm text-mainDangerV1">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citizenId" className="text-secondaryTextV1">
                      Số CMND/CCCD <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      type="number"
                      id="citizenId"
                      name="citizenId"
                      value={formData.citizenId}
                      onChange={handleChange}
                      placeholder="Nhập số CMND/CCCD"
                      className={`border-lightBorderV1 ${errors.citizenId ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.citizenId && (
                      <p className="text-sm text-mainDangerV1">{errors.citizenId}</p>
                    )}
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
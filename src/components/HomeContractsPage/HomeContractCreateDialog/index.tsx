"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateHomeContract } from "@/hooks/useHomeContract";
import { useGetHomeOwners } from "@/hooks/useHomeOwner";
import { useGetHomes, useGetHomesByOwner } from "@/hooks/useHome";
import { useGetGuests } from "@/hooks/useGuest";
import { ICreateHomeContractBody } from "@/interface/request/homeContract";
import { toast } from "react-toastify";
import { IconLoader2, IconUser, IconHome, IconUsers, IconMapPin, IconPhone, IconCurrencyDong } from "@tabler/icons-react";
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Icon from "@mdi/react";
import { mdiAccount, mdiAccountTie, mdiHomeCity } from "@mdi/js";

interface HomeContractCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ExtendedCreateHomeContractBody extends ICreateHomeContractBody {
  note?: string;
}

type SelectionMode = "owner-first" | "home-first";

export const HomeContractCreateDialog = ({ isOpen, onClose, onSuccess }: HomeContractCreateDialogProps) => {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("owner-first");
  const [selectedHomeOwnerId, setSelectedHomeOwnerId] = useState<string>("");
  const [selectedHomeId, setSelectedHomeId] = useState<string>("");
  const [selectedGuestId, setSelectedGuestId] = useState<string>("");

  const [formData, setFormData] = useState<ExtendedCreateHomeContractBody>({
    homeId: "",
    guestId: "",
    contractCode: "",
    dateStar: "",
    duration: 0,
    price: 0,
    deposit: 0,
    payCycle: 1,
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [priceSuggestions, setPriceSuggestions] = useState<number[]>([]);
  const [depositSuggestions, setDepositSuggestions] = useState<number[]>([]);
  const [showPriceSuggestions, setShowPriceSuggestions] = useState(false);
  const [showDepositSuggestions, setShowDepositSuggestions] = useState(false);

  // Date input state for display (dd/MM/yyyy format)
  const [dateStarInput, setDateStarInput] = useState("");

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

  // Hooks for data fetching
  const { data: homeOwnersData, isLoading: isLoadingHomeOwners, error: homeOwnersError } = useGetHomeOwners();
  const { data: allHomesData, isLoading: isLoadingAllHomes, error: allHomesError } = useGetHomes();
  const { data: homesByOwnerData, isLoading: isLoadingHomesByOwner, error: homesByOwnerError } = useGetHomesByOwner({
    homeOwnerId: selectedHomeOwnerId
  });
  const { data: guestsData, isLoading: isLoadingGuests, error: guestsError } = useGetGuests();

  const { mutate: createContractMutation, isPending } = useCreateHomeContract();
  
  useEffect(() => {
    if (selectionMode === "home-first" && selectedHomeId && allHomesData?.data) {
      const homes = Array.isArray(allHomesData.data) ? allHomesData.data : allHomesData.data?.homes || [];
      const selectedHome = homes.find(home => home._id === selectedHomeId);
      if (selectedHome) {
        setFormData(prev => ({
          ...prev,
          homeId: selectedHomeId,
          price: selectedHome.price || 0
        }));
      }
    }
  }, [selectedHomeId, allHomesData, selectionMode]);

  useEffect(() => {
    if (selectionMode === "owner-first" && selectedHomeId) {
      const homes = Array.isArray(homesByOwnerData?.data) ? homesByOwnerData.data : [];
      const selectedHome = homes.find((home: any) => home._id === selectedHomeId);
      if (selectedHome) {
        setFormData(prev => ({
          ...prev,
          homeId: selectedHomeId,
          price: selectedHome.price || 0
        }));
      }
    }
  }, [selectedHomeId, homesByOwnerData, selectionMode]);

  useEffect(() => {
    if (selectedGuestId) {
      setFormData(prev => ({ ...prev, guestId: selectedGuestId }));
    }
  }, [selectedGuestId]);

  const resetForm = () => {
    setFormData({
      homeId: "",
      guestId: "",
      contractCode: "",
      dateStar: "",
      duration: 0,
      price: 0,
      deposit: 0,
      payCycle: 1,
      note: "",
    });
    setSelectedHomeOwnerId("");
    setSelectedHomeId("");
    setSelectedGuestId("");
    setErrors({});
    setSelectionMode("owner-first");
    setPriceSuggestions([]);
    setDepositSuggestions([]);
    setShowPriceSuggestions(false);
    setShowDepositSuggestions(false);
    setDateStarInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (["price", "duration", "deposit", "payCycle"].includes(name)) {
      const numValue = parseFloat(value);
      if (numValue < 0) {
        toast.warning(`${getFieldDisplayName(name)} không được nhập số âm`);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: numValue || 0
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getFieldDisplayName = (fieldName: string): string => {
    const fieldNames: Record<string, string> = {
      price: "Giá thuê",
      duration: "Thời hạn",
      deposit: "Tiền đặt cọc",
      payCycle: "Chu kỳ thanh toán"
    };
    return fieldNames[fieldName] || fieldName;
  };

  const handleDateInputChange = (field: 'dateStar', value: string) => {
    // Update display value
    setDateStarInput(value);

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

  const handleTodayClick = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    const todayString = `${day}/${month}/${year}`;
    
    setDateStarInput(todayString);
    setFormData((prev) => ({ ...prev, dateStar: today.toISOString() }));
    
    if (errors.dateStar) {
      setErrors((prev) => ({ ...prev, dateStar: "" }));
    }
  };

  const handleSelectionModeChange = (mode: SelectionMode) => {
    setSelectionMode(mode);
    setSelectedHomeOwnerId("");
    setSelectedHomeId("");
    setFormData(prev => ({ ...prev, homeId: "", price: 0 }));
    setErrors({});
  };

  const handleHomeOwnerSelect = (homeOwnerId: string) => {
    setSelectedHomeOwnerId(homeOwnerId);
    setSelectedHomeId("");
    setFormData(prev => ({ ...prev, homeId: "", price: 0 }));
  };

  const handleHomeSelect = (homeId: string) => {
    setSelectedHomeId(homeId);
  };

  const handleGuestSelect = (guestId: string) => {
    setSelectedGuestId(guestId);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    if (!formData.homeId.trim()) {
      newErrors.homeId = "Vui lòng chọn nhà";
      hasErrors = true;
    }
    if (!formData.guestId.trim()) {
      newErrors.guestId = "Vui lòng chọn khách hàng";
      hasErrors = true;
    }
    if (!formData.dateStar) {
      newErrors.dateStar = "Vui lòng chọn ngày bắt đầu";
      hasErrors = true;
    }
    
    // Validate date format
    if (dateStarInput && !isValidDateFormat(dateStarInput)) {
      newErrors.dateStar = "Định dạng ngày bắt đầu không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy";
      hasErrors = true;
    }
    if (formData.duration <= 0) {
      newErrors.duration = "Thời hạn phải lớn hơn 0";
      hasErrors = true;
    }
    if (formData.price <= 0) {
      newErrors.price = "Giá thuê phải lớn hơn 0";
      hasErrors = true;
    }
    if (formData.payCycle <= 0) {
      newErrors.payCycle = "Chu kỳ thanh toán phải lớn hơn 0";
      hasErrors = true;
    }

    if (formData.duration > 120) {
      newErrors.duration = "Thời hạn không được vượt quá 120 tháng";
      hasErrors = true;
    }
    if (formData.payCycle > formData.duration) {
      newErrors.payCycle = "Chu kỳ thanh toán không được lớn hơn thời hạn hợp đồng";
      hasErrors = true;
    }
    if (formData.deposit > formData.price * 12) {
      newErrors.deposit = "Tiền đặt cọc không được vượt quá 12 tháng tiền thuê";
      hasErrors = true;
    }

    setErrors(newErrors);
    if (hasErrors) {
      const errorCount = Object.keys(newErrors).length;
      toast.error(`Vui lòng kiểm tra lại thông tin! Có ${errorCount} lỗi cần sửa.`);
    }

    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const { note, ...contractData } = formData;
    createContractMutation(contractData, {
      onSuccess: (data) => {
        if (data.statusCode === 200 || data.statusCode === 201) {
          toast.success(data.message || "Tạo hợp đồng thuê nhà thành công!");
          resetForm();
          onSuccess?.();
          onClose();
        } else {
          toast.error(data.message || "Tạo hợp đồng thuê nhà thất bại");
        }
      },
      onError: (error: any) => {
        console.error("Create contract error:", error);
        if (error?.response?.status === 400) {
          const errorMessage = error?.response?.data?.message;
          if (errorMessage === "Căn hộ này đã được cho thuê và đang có hợp đồng hiệu lực") {
            toast.error("Căn hộ này đã được cho thuê và đang có hợp đồng hiệu lực. Vui lòng chọn căn hộ khác!");
          } else {
            toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!");
          }
        } else if (error?.response?.status === 409) {
          toast.error("Hợp đồng đã tồn tại hoặc xung đột dữ liệu!");
        } else if (error?.response?.status === 500) {
          toast.error("Lỗi hệ thống. Vui lòng thử lại sau!");
        } else {
          const errorMessage = error?.response?.data?.message || error.message || "Đã xảy ra lỗi khi tạo hợp đồng";
          toast.error(errorMessage);
        }
      }
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get available homes based on selection mode
  const getAvailableHomes = () => {
    let homes: any[] = [];
    
    if (selectionMode === "owner-first") {
      // Handle the API response structure - data is directly an array of homes
      if (homesByOwnerData?.data) {
        homes = Array.isArray(homesByOwnerData.data) ? homesByOwnerData.data : [];
      }
    } else {
      // Handle different data structures for useGetHomes - following HomesPage pattern
      if (allHomesData?.data) {
        homes = Array.isArray(allHomesData.data) ? allHomesData.data : allHomesData.data?.homes || [];
      }
    }
    
    // Filter out homes that already have active contracts
    return homes.filter((home: any) => !home.homeContract || home.homeContract.status !== 1);
  };

  // Get available owners data - try both patterns
  const getAvailableOwners = () => {
    // Try HomeOwnerPage pattern first
    if (homeOwnersData?.data && Array.isArray(homeOwnersData.data)) {
      return homeOwnersData.data;
    }
    // Try interface pattern 
    if (homeOwnersData?.data?.owners && Array.isArray(homeOwnersData.data.owners)) {
      return homeOwnersData.data.owners;
    }
    return [];
  };

  // Get available guests data
  const getAvailableGuests = () => {
    if (guestsData?.data && Array.isArray(guestsData.data)) {
      return guestsData.data;
    }
    return [];
  };

  const getSelectedHomeOwnerName = () => {
    if (selectionMode === "home-first" && selectedHomeId && allHomesData?.data) {
      const homes = Array.isArray(allHomesData.data) ? allHomesData.data : allHomesData.data?.homes || [];
      const selectedHome = homes.find((home: any) => home._id === selectedHomeId);
      // Handle different homeOwnerId structures
      if (selectedHome?.homeOwnerId) {
        if (typeof selectedHome.homeOwnerId === 'string') {
          return selectedHome.homeOwnerId;
        } else if (selectedHome.homeOwnerId.fullname) {
          return selectedHome.homeOwnerId.fullname;
        }
      }
      return "Không xác định";
    }
    if (selectionMode === "owner-first" && selectedHomeOwnerId && getAvailableOwners().length > 0) {
      const selectedOwner = getAvailableOwners().find((owner: any) => owner._id === selectedHomeOwnerId);
      return selectedOwner?.fullname || "Không xác định";
    }
    return "";
  };

  const generatePriceSuggestions = (inputValue: string): number[] => {
    if (!inputValue || inputValue === '0') return [];
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue <= 0) return [];
    
    const suggestions: number[] = [];
    
    // Nếu nhập số nhỏ (1-999), tạo gợi ý với đơn vị triệu và chục triệu
    if (numValue < 1000) {
      // Với số có 3 chữ số (100-999), thêm gợi ý nghìn và chục nghìn
      if (numValue >= 100) {
        suggestions.push(numValue * 1000); // nghìn (VD: 345 -> 345,000)
        suggestions.push(numValue * 10000); // chục nghìn (VD: 345 -> 3,450,000)
      }
      
      suggestions.push(numValue * 1000000); // triệu
      if (numValue >= 10) {
        suggestions.push(numValue * 100000); // trăm nghìn
      }
      if (numValue <= 99) {
        suggestions.push(numValue * 10000000); // chục triệu
      }
    }
    else if (numValue < 1000000) {
      suggestions.push(numValue * 1000); // nghìn
      suggestions.push(numValue * 10000); // chục nghìn
    }
    
    return Array.from(new Set(suggestions)).sort((a: number, b: number) => a - b).slice(0, 3);
  };

  const generateDepositSuggestions = (inputValue: string): number[] => {
    if (!inputValue || inputValue === '0') return [];
    
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue <= 0) return [];
    
    const suggestions: number[] = [];
    
    if (numValue < 1000) {
      if (numValue >= 100) {
        suggestions.push(numValue * 1000); // nghìn (VD: 345 -> 345,000)
        suggestions.push(numValue * 10000); // chục nghìn (VD: 345 -> 3,450,000)
      }
      
      suggestions.push(numValue * 100000); // trăm nghìn (6 chữ số)
      suggestions.push(numValue * 1000000); // triệu (7 chữ số)
      if (numValue <= 99) {
        suggestions.push(numValue * 10000000); // chục triệu (8 chữ số)
      }
    }
    else if (numValue < 100000) {
      const thousand = numValue * 1000;
      const tenThousand = numValue * 10000;
      
      if (thousand >= 100000) suggestions.push(thousand); // tối thiểu 6 chữ số
      if (tenThousand >= 100000 && tenThousand <= 99999999) suggestions.push(tenThousand);
    }
    
    const filteredSuggestions = suggestions.filter(val => val >= 100000 && val <= 99999999);
    
    return Array.from(new Set(filteredSuggestions)).sort((a: number, b: number) => a - b).slice(0, 3);
  };

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    handleChange(e);
    
    const suggestions = generatePriceSuggestions(value);
    setPriceSuggestions(suggestions);
    setShowPriceSuggestions(suggestions.length > 0 && value !== '');
  };

  const handleDepositInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleChange(e);
    const suggestions = generateDepositSuggestions(value);
    setDepositSuggestions(suggestions);
    setShowDepositSuggestions(suggestions.length > 0 && value !== '');
  };

  const handlePriceSuggestionClick = (suggestedPrice: number) => {
    setFormData(prev => ({ ...prev, price: suggestedPrice }));
    setShowPriceSuggestions(false);
    setPriceSuggestions([]);
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: "" }));
    }
  };

  const handleDepositSuggestionClick = (suggestedDeposit: number) => {
    setFormData(prev => ({ ...prev, deposit: suggestedDeposit }));
    setShowDepositSuggestions(false);
    setDepositSuggestions([]);
    
    if (errors.deposit) {
      setErrors(prev => ({ ...prev, deposit: "" }));
    }
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('vi-VN');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium" className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>
            Tạo hợp đồng thuê nhà mới
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-lightBorderV1 bg-mainBackgroundV1">
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-secondaryTextV1 font-medium">
                    Phương thức chọn nhà
                  </Label>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant={selectionMode === "owner-first" ? "default" : "outline"}
                      onClick={() => handleSelectionModeChange("owner-first")}
                      className="flex items-center space-x-2"
                    >
                      <Icon
                        path={mdiAccountTie}
                        size={0.8} />

                      <span>Chọn chủ nhà trước</span>
                    </Button>
                    <Button
                      type="button"
                      variant={selectionMode === "home-first" ? "default" : "outline"}
                      onClick={() => handleSelectionModeChange("home-first")}
                      className="flex items-center space-x-2"
                    >
                      <Icon
                        path={mdiHomeCity}
                        size={0.8} />
                      <span>Chọn nhà trước</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectionMode === "owner-first" && (
                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">
                        Chủ nhà <span className="text-mainDangerV1">*</span>
                      </Label>
                      <Select value={selectedHomeOwnerId} onValueChange={handleHomeOwnerSelect}>
                        <SelectTrigger className={`border-lightBorderV1 ${errors.homeId ? "border-mainDangerV1" : ""}`}>
                          <SelectValue placeholder="Chọn chủ nhà">
                            {selectedHomeOwnerId && getAvailableOwners().length > 0 && (() => {
                              const selectedOwner = getAvailableOwners().find(owner => owner._id === selectedHomeOwnerId);
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
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-secondaryTextV1">
                      Nhà <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Select
                      value={selectedHomeId}
                      onValueChange={handleHomeSelect}
                      disabled={selectionMode === "owner-first" && !selectedHomeOwnerId}
                    >
                      <SelectTrigger className={`border-lightBorderV1 ${errors.homeId ? "border-mainDangerV1" : ""}`}>
                        <SelectValue placeholder="Chọn nhà">
                          {selectedHomeId && getAvailableHomes().length > 0 && (() => {
                            const selectedHome = getAvailableHomes().find(home => home._id === selectedHomeId);
                            if (selectedHome) {
                              const homeName = selectedHome.building || selectedHome.name || 'Nhà không có tên';
                              const homeApartment = selectedHome.apartmentNv ? ` - ${selectedHome.apartmentNv}` : '';
                              const homeAddress = selectedHome.address || 'Không có địa chỉ';
                              return `${homeName}${homeApartment} (${homeAddress})`;
                            }
                            return "Chọn nhà";
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(selectionMode === "owner-first" ? isLoadingHomesByOwner : isLoadingAllHomes) ? (
                          <SelectItem value="loading" disabled>
                            <div className="flex items-center space-x-2">
                              <IconLoader2 className="w-4 h-4 animate-spin" />
                              <span>Đang tải...</span>
                            </div>
                          </SelectItem>
                        ) : (selectionMode === "owner-first" ? homesByOwnerError : allHomesError) ? (
                          <SelectItem value="error" disabled>
                            <div className="flex items-center space-x-2 text-red-500">
                              <span>Lỗi tải dữ liệu</span>
                            </div>
                          </SelectItem>
                        ) : getAvailableHomes().length > 0 ? (
                          getAvailableHomes().map((home, index) => (
                            <>
                              <SelectItem key={home._id} value={home._id}>
                                <div className="flex items-center space-x-3 py-1">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 border rounded-full bg-slate-100 flex items-center justify-center">
                                      <Icon
                                        path={mdiHomeCity}
                                        size={0.8}
                                        className="text-slate-400"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-500 truncate">
                                      {home.building || 'Nhà không có tên'}{home.apartmentNv ? ` - ${home.apartmentNv}` : ''}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-mainTextV1">
                                      <div className="flex items-center">
                                        <IconMapPin className="w-3 h-3 mr-1" />
                                        <span className="truncate">{home.address || 'Không có địa chỉ'}</span>
                                      </div>
                                      {home.price && (
                                        <div className="flex items-center ml-2 text-blue-600 font-medium">
                                          <IconCurrencyDong className="w-3 h-3 mr-1" />
                                          {home.price.toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                              {index < getAvailableHomes().length - 1 && <SelectSeparator />}
                            </>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            <span className="text-mainTextV1">
                              {selectionMode === "owner-first"
                                ? "Chưa có nhà nào cho chủ nhà này"
                                : "Không có nhà nào có sẵn"
                              }
                            </span>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.homeId && (
                      <p className="text-sm text-mainDangerV1">{errors.homeId}</p>
                    )}
                  </div>

                  {/* Display selected home owner info when selecting home first */}
                  {selectionMode === "home-first" && selectedHomeId && (
                    <div className="space-y-2">
                      <Label className="text-secondaryTextV1">Chủ nhà</Label>
                      <Input
                        value={getSelectedHomeOwnerName()}
                        disabled
                        className="border-lightBorderV1 bg-gray-50"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-secondaryTextV1">
                      Khách hàng <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Select value={selectedGuestId} onValueChange={handleGuestSelect}>
                      <SelectTrigger className={`border-lightBorderV1 ${errors.guestId ? "border-mainDangerV1" : ""}`}>
                        <SelectValue placeholder="Chọn khách hàng">
                          {selectedGuestId && getAvailableGuests().length > 0 && (() => {
                            const selectedGuest = getAvailableGuests().find(guest => guest._id === selectedGuestId);
                            return selectedGuest ? `${selectedGuest.fullname} (${selectedGuest.phone})` : "Chọn khách hàng";
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingGuests ? (
                          <SelectItem value="loading" disabled>
                            <div className="flex items-center space-x-2">
                              <IconLoader2 className="w-4 h-4 animate-spin" />
                              <span>Đang tải...</span>
                            </div>
                          </SelectItem>
                        ) : guestsError ? (
                          <SelectItem value="error" disabled>
                            <div className="flex items-center space-x-2 text-red-500">
                              <span>Lỗi tải dữ liệu</span>
                            </div>
                          </SelectItem>
                        ) : getAvailableGuests().length > 0 ? (
                          getAvailableGuests().map((guest, index) => (
                            <>
                              <SelectItem key={guest._id} value={guest._id}>
                                <div className="flex items-center space-x-3 py-1">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 border rounded-full bg-slate-100 flex items-center justify-center">
                                      <Icon
                                        path={mdiAccount}
                                        size={0.8}
                                        className="text-slate-400"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-500 truncate">
                                      {guest.fullname}
                                    </div>
                                    <div className="flex items-center text-sm text-mainTextV1">
                                      <IconPhone className="w-3 h-3 mr-1" />
                                      {guest.phone}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                              {index < getAvailableGuests().length - 1 && <SelectSeparator />}
                            </>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            <span className="text-mainTextV1">Không có dữ liệu khách hàng</span>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.guestId && (
                      <p className="text-sm text-mainDangerV1">{errors.guestId}</p>
                    )}
                  </div>
                </div>

                {/* Contract Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateStar" className="text-secondaryTextV1">
                      Ngày bắt đầu <span className="text-mainDangerV1">*</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="dateStar"
                        value={dateStarInput}
                        onChange={(e) => handleDateInputChange('dateStar', e.target.value)}
                        placeholder="dd/MM/yyyy"
                        className={`border-lightBorderV1 ${errors.dateStar ? "border-mainDangerV1" : ""}`}
                        maxLength={10}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleTodayClick}
                        className="flex-shrink-0"
                      >
                        Chọn hôm nay
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Định dạng: dd/MM/yyyy (ví dụ: 15/03/2024)</p>
                    {errors.dateStar && (
                      <p className="text-sm text-mainDangerV1">{errors.dateStar}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-secondaryTextV1">
                      Thời hạn (tháng) <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="Nhập thời hạn"
                      className={`border-lightBorderV1 ${errors.duration ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.duration && (
                      <p className="text-sm text-mainDangerV1">{errors.duration}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-secondaryTextV1">
                      Giá thuê (VNĐ) <span className="text-mainDangerV1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="price"
                        name="price"
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
                          setTimeout(() => setShowPriceSuggestions(false), 200);
                        }}
                        placeholder="Nhập giá thuê"
                        className={`border-lightBorderV1 ${errors.price ? "border-mainDangerV1" : ""}`}
                      />
                      {showPriceSuggestions && priceSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-lightBorderV1 rounded-md shadow-lg">
                          <div className="p-2 space-y-1">
                            <div className="text-xs text-secondaryTextV1 mb-2">Gợi ý giá thuê:</div>
                            <div className="flex flex-wrap gap-1">
                              {priceSuggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePriceSuggestionClick(suggestion)}
                                >
                                  {formatCurrency(suggestion)} VNĐ
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.price && (
                      <p className="text-sm text-mainDangerV1">{errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit" className="text-secondaryTextV1">
                      Tiền đặt cọc (VNĐ)
                    </Label>
                    <div className="relative">
                      <Input
                        id="deposit"
                        name="deposit"
                        type="number"
                        min="0"
                        value={formData.deposit}
                        onChange={handleDepositInputChange}
                        onFocus={() => {
                          if (formData.deposit > 0) {
                            const suggestions = generateDepositSuggestions(formData.deposit.toString());
                            setDepositSuggestions(suggestions);
                            setShowDepositSuggestions(suggestions.length > 0);
                          }
                        }}
                        onBlur={() => {
                          // Delay để cho phép click vào suggestion
                          setTimeout(() => setShowDepositSuggestions(false), 200);
                        }}
                        placeholder="Nhập tiền đặt cọc"
                        className="border-lightBorderV1"
                      />
                      {showDepositSuggestions && depositSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-lightBorderV1 rounded-md shadow-lg">
                          <div className="p-2 space-y-1">
                            <div className="text-xs text-secondaryTextV1 mb-2">Gợi ý tiền đặt cọc:</div>
                            <div className="flex flex-wrap gap-1">
                              {depositSuggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDepositSuggestionClick(suggestion)}
                                  className="text-xs h-7 px-2"
                                >
                                  {formatCurrency(suggestion)} VNĐ
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.deposit && (
                      <p className="text-sm text-mainDangerV1">{errors.deposit}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payCycle" className="text-secondaryTextV1">
                      Chu kỳ thanh toán (tháng) <span className="text-mainDangerV1">*</span>
                    </Label>
                    <Input
                      id="payCycle"
                      name="payCycle"
                      type="number"
                      min="1"
                      value={formData.payCycle}
                      onChange={handleChange}
                      placeholder="Nhập chu kỳ thanh toán"
                      className={`border-lightBorderV1 ${errors.payCycle ? "border-mainDangerV1" : ""}`}
                    />
                    {errors.payCycle && (
                      <p className="text-sm text-mainDangerV1">{errors.payCycle}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractCode" className="text-secondaryTextV1">
                      Mã hợp đồng
                    </Label>
                    <Input
                      id="contractCode"
                      name="contractCode"
                      value={formData.contractCode}
                      onChange={handleChange}
                      placeholder="Nhập mã hợp đồng (tự động tạo nếu để trống)"
                      className="border-lightBorderV1"
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
            <CardFooter className="flex justify-end space-x-4 border-t border-lightBorderV1 pt-6">
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
                ) : 'Tạo hợp đồng'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}; 
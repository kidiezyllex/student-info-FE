"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IHomeContract } from "@/interface/response/homeContract";
import { formatDate } from "@/utils/dateFormat";
import { formatCurrency } from "@/utils/format";
import { motion } from "framer-motion";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface HomeContractTableProps {
  contracts: IHomeContract[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HomeContractTable = ({ contracts, onView, onEdit, onDelete }: HomeContractTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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

  if (contracts.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-medium text-mainTextV1 w-[150px]">Mã hợp đồng</TableHead>
              <TableHead className="font-medium text-mainTextV1">Thông tin khách hàng</TableHead>
              <TableHead className="font-medium text-mainTextV1">Thông tin căn hộ</TableHead>
              <TableHead className="font-medium text-mainTextV1">Giá thuê</TableHead>
              <TableHead className="font-medium text-mainTextV1">Tiền cọc</TableHead>
              <TableHead className="font-medium text-mainTextV1">Thời hạn</TableHead>
              <TableHead className="font-medium text-mainTextV1">Ngày bắt đầu</TableHead>
              <TableHead className="font-medium text-mainTextV1">Trạng thái</TableHead>
              <TableHead className=" font-medium text-mainTextV1">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-secondaryTextV1">
                Chưa có hợp đồng thuê nhà nào được tìm thấy
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
  return (
    <div className="w-full">
      <Table className="text-mainTextV1">
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-medium text-mainTextV1 w-[120px]">Mã hợp đồng</TableHead>
            <TableHead className="font-medium text-mainTextV1">Khách hàng</TableHead>
            <TableHead className="font-medium text-mainTextV1 w-[150px]">Thông tin căn hộ</TableHead>
            <TableHead className="font-medium text-mainTextV1">Giá thuê</TableHead>
            <TableHead className="font-medium text-mainTextV1">Tiền cọc</TableHead>
            <TableHead className="font-medium text-mainTextV1">Thời hạn</TableHead>
            <TableHead className="font-medium text-mainTextV1">Ngày bắt đầu</TableHead>
            <TableHead className="font-medium text-mainTextV1">Trạng thái</TableHead>
            <TableHead className=" font-medium text-mainTextV1">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow
              key={contract._id}
              className="hover:bg-gray-50 transition-colors"
              onMouseEnter={() => setHoveredRow(contract._id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <TableCell className="font-medium text-mainTextV1">
                <div className="flex flex-col">
                  <span className="text-sm">{contract._id.substring(0, 8)}...</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {contract.guestId && typeof contract.guestId === 'object' && 'fullname' in contract.guestId
                      ? (contract.guestId as any).fullname
                      : contract.guestId}
                  </span>
                  <span className="text-xs text-mainTextV1">
                    ({contract.guestId && typeof contract.guestId === 'object' && 'phone' in contract.guestId
                      ? (contract.guestId as any).phone
                      : ''})
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {contract.homeId && typeof contract.homeId === 'object' && 'building' in contract.homeId
                      ? `${(contract.homeId as any).building} - ${(contract.homeId as any).apartmentNv || ''}`
                      : 'Căn hộ #' + contract.homeId}
                  </span>
                  <span className="text-xs text-mainTextV1">
                    {contract.homeId && typeof contract.homeId === 'object' && 'address' in contract.homeId
                      ? (contract.homeId as any).address
                      : ''}
                  </span>
                  <span className="text-xs text-mainTextV1">
                    {contract.homeId && typeof contract.homeId === 'object' && 'district' in contract.homeId
                      ? `${(contract.homeId as any).ward}, ${(contract.homeId as any).district}`
                      : ''}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{formatCurrency((contract as any).renta)}</span>
                  <span className="text-xs text-mainTextV1">
                    {getPayCycleText(contract.payCycle)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency((contract as any).deposit)}
              </TableCell>
              <TableCell className="text-sm font-medium">
                {contract.duration} tháng
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">
                  {formatDate((contract as any).dateStar || '')}
                </span>
              </TableCell>
              <TableCell>
                {getStatusBadge(contract.status)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(contract._id)}
                      className="text-mainTextV1 hover:text-mainTextHoverV1 hover:bg-transparent"
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(contract._id)}
                      className="text-mainTextV1 hover:text-mainDangerV1 hover:bg-transparent"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 
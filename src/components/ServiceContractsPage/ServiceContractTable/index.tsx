"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateOnly } from "@/utils/dateFormat";
import { motion } from "framer-motion";
import { IconEye, IconEdit, IconTrash, IconClock, IconCash, IconUser, IconCategory } from "@tabler/icons-react";

// Helper function for currency formatting
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(value);
};

interface ServiceContractTableProps {
  contracts: any[]; // Replace with proper interface when available
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ServiceContractTable = ({ contracts, onView, onEdit, onDelete }: ServiceContractTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 1:
        return <Badge className="bg-green-500 hover:bg-green-600">Đang hoạt động</Badge>;
      case 2:
        return <Badge variant="outline">Đã hết hạn</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#1B61FF20] hover:bg-gray-50">
            <TableHead className="font-medium text-mainTextV1">Dịch vụ</TableHead>
            <TableHead className="font-medium text-mainTextV1">Khách hàng</TableHead>
            <TableHead className="font-medium text-mainTextV1">Thời gian</TableHead>
            <TableHead className="font-medium text-mainTextV1">Giá dịch vụ</TableHead>
            <TableHead className="font-medium text-mainTextV1">Trạng thái</TableHead>
            <TableHead className=" font-medium text-mainTextV1">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-secondaryTextV1">
                Chưa có hợp đồng dịch vụ nào
              </TableCell>
            </TableRow>
          ) : (
            contracts.map((contract) => {
              const serviceName = typeof contract.serviceId === 'object' ? contract.serviceId.name : 'Không xác định';
              const guestName = typeof contract.guestId === 'object' ? contract.guestId.fullname : 'Không xác định';
              
              return (
                <TableRow
                  key={contract._id}
                  className="hover:bg-gray-50 transition-colors"
                  onMouseEnter={() => setHoveredRow(contract._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell>
                    <div className="flex items-center">
                      <IconCategory className="w-4 h-4 mr-1 text-blue-600" />
                      <span className="text-secondaryTextV1 font-medium">{serviceName}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center">
                      <IconUser className="w-4 h-4 mr-1 text-slate-600" />
                      <span className="text-secondaryTextV1">{guestName}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <IconClock className="w-4 h-4 mr-1 text-green-600" />
                        <span className="text-xs text-slate-500">Bắt đầu:</span>
                        <span className="text-secondaryTextV1 text-xs ml-1">{formatDateOnly(contract.startDate)}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <IconClock className="w-4 h-4 mr-1 text-red-600" />
                        <span className="text-xs text-slate-500">Kết thúc:</span>
                        <span className="text-secondaryTextV1 text-xs ml-1">{formatDateOnly(contract.endDate)}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center">
                      <IconCash className="w-4 h-4 mr-1 text-amber-600" />
                      <span className="text-secondaryTextV1 font-medium">{formatCurrency(contract.price)}</span>
                    </div>
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
                          onClick={() => onView(contract._id)}
                          className="text-mainTextV1 hover:text-mainTextHoverV1 hover:bg-transparent"
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      
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
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}; 
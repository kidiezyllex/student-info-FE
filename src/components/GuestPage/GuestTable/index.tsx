"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IGuest, IGuestSearchResult } from "@/interface/response/guest";
import { formatDate } from "@/utils/dateFormat";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconPhone, IconMail, IconId, IconUserCircle } from "@tabler/icons-react";

interface GuestTableProps {
  guests: (IGuest | IGuestSearchResult)[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const GuestTable = ({ guests, isSearching, onEdit, onDelete }: GuestTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader >
          <TableRow className="bg-[#1B61FF20] hover:bg-gray-50">
            <TableHead className="font-medium text-mainTextV1">Tên khách hàng</TableHead>
            <TableHead className="font-medium text-mainTextV1">Số điện thoại</TableHead>
            <TableHead className="font-medium text-mainTextV1">Email</TableHead>
            <TableHead className="font-medium text-mainTextV1">Số CMND/CCCD</TableHead>
            {!isSearching && (
              <TableHead className="font-medium text-mainTextV1">Ngày tạo</TableHead>
            )}
            <TableHead className=" font-medium text-mainTextV1">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isSearching ? 5 : 6} className="text-center py-8 text-secondaryTextV1">
                {isSearching ? "Không tìm thấy khách hàng phù hợp" : "Chưa có khách hàng nào"}
              </TableCell>
            </TableRow>
          ) : (
            guests.map((guest) => (
              <TableRow
                key={guest._id}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(guest._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    {guest.avatarUrl ? (
                      <img
                        src={guest.avatarUrl}
                        alt={guest.fullname}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <IconUserCircle className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-mainTextV1">{guest.fullname}</p>
                    <p className="text-sm text-secondaryTextV1">
                      {guest.gender !== undefined ? (guest.gender ? "Nam" : "Nữ") : "Chưa cập nhật"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <IconPhone className="w-4 h-4 mr-1 text-mainTextV1" />
                    <span className="text-secondaryTextV1">{guest.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <IconMail className="w-4 h-4 mr-1 text-mainTextV1" />
                    <span className="text-secondaryTextV1">{guest.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <IconId className="w-4 h-4 mr-1 text-mainTextV1" />
                    <span className="text-secondaryTextV1">{guest.citizenId}</span>
                  </div>
                </TableCell>
                {!isSearching && "createdAt" in guest && (
                  <TableCell className="text-secondaryTextV1">
                    {formatDate(guest.createdAt)}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(guest._id)}
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
                        onClick={() => onDelete(guest._id)}
                        className="text-mainTextV1 hover:text-mainDangerV1 hover:bg-transparent"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}; 
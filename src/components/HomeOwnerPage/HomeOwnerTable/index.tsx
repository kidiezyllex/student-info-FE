"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IHomeOwner } from "@/interface/response/homeOwner";
import { formatDate } from "@/utils/dateFormat";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconPhone, IconMail, IconId, IconUserCircle } from "@tabler/icons-react";

interface HomeOwnerTableProps {
  homeOwners: any;
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HomeOwnerTable = ({
  homeOwners,
  isSearching,
  onEdit,
  onDelete,
}: HomeOwnerTableProps) => {
  if (homeOwners.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-secondaryTextV1">
          {isSearching
            ? "Không tìm thấy chủ nhà phù hợp"
            : "Chưa có chủ nhà nào trong hệ thống"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thông tin chủ nhà</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead>CMND/CCCD</TableHead>
            {!isSearching && <TableHead>Ngày tạo</TableHead>}
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {homeOwners.map((homeOwner: any) => (
            <TableRow key={homeOwner._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    {homeOwner.avatarUrl ? (
                      <img
                        src={homeOwner.avatarUrl}
                        alt={homeOwner.fullname}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <IconUserCircle className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-mainTextV1">{homeOwner.fullname}</p>
                    <p className="text-sm text-secondaryTextV1">
                      {homeOwner.gender !== undefined ? (homeOwner.gender ? "Nam" : "Nữ") : "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <IconPhone className="w-4 h-4 text-slate-400" />
                    <span className="text-mainTextV1">{homeOwner.phone}</span>
                  </div>
                  {homeOwner.email && (
                    <div className="flex items-center gap-1.5">
                      <IconMail className="w-4 h-4 text-slate-400" />
                      <span className="text-mainTextV1">{homeOwner.email}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <IconId className="w-4 h-4 text-slate-400" />
                  <span className="text-mainTextV1">{homeOwner.citizenId}</span>
                </div>
              </TableCell>
              {!isSearching && (
                <TableCell className="text-secondaryTextV1">
                  {formatDate(homeOwner.createdAt)}
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
                      onClick={() => onEdit(homeOwner._id)}
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
                      onClick={() => onDelete(homeOwner._id)}
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
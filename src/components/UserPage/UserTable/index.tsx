"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/interface/response/user";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconMail, IconUserCircle, IconShield, IconUser, IconId, IconBuildingBank, IconMenu3 } from "@tabler/icons-react";
import { Activity } from "lucide-react";
import { getRoleBadge } from "@/lib/badge-helpers";
interface UserTableProps {
  users: IUser[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage?: number;
  pageSize?: number;
}

export const UserTable = ({ users, isSearching, onEdit, onDelete, currentPage = 1, pageSize = 10 }: UserTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getStatusBadge = (active: boolean) => {
    return active ? <Badge variant="green"><Activity className="h-3 w-3" />Active</Badge> : <Badge variant="red">Inactive</Badge>;
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-800 text-nowrap w-[60px]">No.</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">User Information</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap w-[180px]">Email</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Student ID</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Department</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Role</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Status</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-800">
                {isSearching ? "No user found" : "No user found"}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => {
              const rowNumber = (currentPage - 1) * pageSize + index + 1;
              return (
              <TableRow
                key={user._id}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(user._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="text-center font-medium text-gray-800">
                  {rowNumber}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName || user.name}
                        className="w-full h-full object-cover flex-shrink-0"
                      />
                    ) : <img
                      src={`/images/${user.gender ? user.gender : "male"}-${user.role}.webp`}
                      alt={"default-avatar"}
                      className="w-full h-full object-cover flex-shrink-0"
                    />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.fullName || user.name}</p>
                    {user.phoneNumber && (
                      <p className="text-xs text-gray-800">{user.phoneNumber}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="w-[180px]">
                  <div className="flex items-center">
                    <span className="text-gray-800 text-wrap">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {user.studentId ? (
                      <Badge variant="orange">
                        {user.studentId}
                      </Badge>
                    ) : ""}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {user.department ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-800 text-nowrap">{user.department.name}</span>
                        <span className="text-sm font-semibold text-gray-800 text-nowrap">Code: {user.department.code}</span>
                      </div>
                    ) : ""}
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(user.active)}
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
                        onClick={() => onEdit(user._id)}
                        className="text-gray-800 hover:text-mainTextHoverV1 hover:bg-transparent"
                      >
                        <IconMenu3 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(user._id)}
                        className="text-gray-800 hover:text-mainDangerV1 hover:bg-transparent"
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
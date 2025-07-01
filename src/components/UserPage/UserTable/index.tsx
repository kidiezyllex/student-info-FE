"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/interface/response/user";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconMail, IconUserCircle, IconShield, IconUser, IconId, IconBuildingBank } from "@tabler/icons-react";

interface UserTableProps {
  users: IUser[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const UserTable = ({ users, isSearching, onEdit, onDelete }: UserTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-100 text-nowrap flex items-center gap-1">
            Admin
          </Badge>
        );
      case 'student':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-100 text-nowrap flex items-center gap-1">
            Student
          </Badge>
        );
      case 'coordinator':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-100 text-nowrap flex items-center gap-1">
            Coordinator
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-100 text-nowrap flex items-center gap-1">
            {role}
          </Badge>
        );
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-green-500 hover:bg-green-600 text-white text-nowrap">
        Active
      </Badge>
    ) : (
      <Badge variant="destructive" className="text-nowrap">
        Inactive
      </Badge>
    );
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#1B61FF20] hover:bg-gray-50">
            <TableHead className="font-medium text-mainTextV1 text-nowrap">User Information</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Email</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Student ID</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Department</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Role</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Status</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-secondaryTextV1">
                {isSearching ? "No user found" : "No user found"}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(user._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.fullName || user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IconUserCircle className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-mainTextV1">{user.fullName || user.name}</p>
                    <p className="text-sm text-secondaryTextV1">{user.name}</p>
                    {user.phoneNumber && (
                      <p className="text-xs text-secondaryTextV1">{user.phoneNumber}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="text-secondaryTextV1">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {user.studentId ? (
                      <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-nowrap">
                        {user.studentId}
                      </Badge>
                    ) : (
                      <span className="text-secondaryTextV1 text-sm">No student ID</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {user.department ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-mainTextV1">{user.department.name}</span>
                        <Badge className="bg-purple-100 text-purple-800 border border-purple-200 text-nowrap w-fit">
                          {user.department.code}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-secondaryTextV1 text-sm">No department</span>
                    )}
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
                        onClick={() => onDelete(user._id)}
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
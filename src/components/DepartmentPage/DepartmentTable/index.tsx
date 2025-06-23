"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IDepartment } from "@/interface/response/department";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconBuilding, IconCode, IconUser } from "@tabler/icons-react";

interface DepartmentTableProps {
  departments: IDepartment[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DepartmentTable = ({ departments, isSearching, onEdit, onDelete }: DepartmentTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#1B61FF20] hover:bg-gray-50">
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Tên khoa</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Mã khoa</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Mô tả</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Quản trị ngành</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-secondaryTextV1">
                {isSearching ? "Không tìm thấy khoa phù hợp" : "Chưa có khoa nào"}
              </TableCell>
            </TableRow>
          ) : (
            departments.map((department) => (
              <TableRow
                key={department._id}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(department._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <IconBuilding className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-mainTextV1">{department.name}</p>
                    <p className="text-sm text-secondaryTextV1">ID: {department._id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-100 text-nowrap flex items-center gap-1">
                      {department.code}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-secondaryTextV1 line-clamp-2">{department.description}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="text-secondaryTextV1">{department.coordinatorId || "Chưa chỉ định"}</span>
                  </div>
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
                        onClick={() => onEdit(department._id)}
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
                        onClick={() => onDelete(department._id)}
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
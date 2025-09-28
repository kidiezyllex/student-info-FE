"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IDepartment } from "@/interface/response/department";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconBuilding, IconCode, IconUser, IconMenu3 } from "@tabler/icons-react";

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
          <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Department Name</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Department Code</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Description</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Coordinator</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-secondaryTextV1">
                {isSearching ? "No department found" : "No department"}
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
                <TableCell className="flex items-center gap-2">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                    <IconBuilding className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-mainTextV1">{department.name}</p>
                    <p className="text-sm text-secondaryTextV1">ID: {department._id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Badge variant="slate">
                      {department.code}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-secondaryTextV1 line-clamp-2">{department.description}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {department.coordinator ? (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-mainTextV1">{department.coordinator.name}</p>
                        <p className="text-xs text-secondaryTextV1">{department.coordinator.email}</p>
                      </div>
                    ) : (
                      <span className="text-secondaryTextV1">No coordinator</span>
                    )}
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
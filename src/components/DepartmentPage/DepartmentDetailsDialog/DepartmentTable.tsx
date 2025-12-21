"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IDepartment } from "@/interface/response/department";
import { formatDate } from "@/utils/dateFormat";

interface DepartmentTableProps {
  department: IDepartment;
}

export const DepartmentTable = ({ department }: DepartmentTableProps) => {
  return (
    <div className="w-full overflow-auto">
      <Table className="border border-lightBorderV1">
        <TableHeader>
          <TableRow className="bg-[#F56C1420] hover">
            <TableHead className="font-semibold text-gray-800 text-nowrap w-1/3">Field</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-gray-800">Department Name</TableCell>
            <TableCell className="text-gray-800">
              {department.name}
            </TableCell>
          </TableRow>

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-gray-800">Department Code</TableCell>
            <TableCell className="text-gray-800">
              <Badge variant="orange">{department.code}</Badge>
            </TableCell>
          </TableRow>

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-gray-800 align-top">Description</TableCell>
            <TableCell className="text-gray-800 whitespace-pre-wrap">
              {department.description}
            </TableCell>
          </TableRow>

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-gray-800">Coordinator</TableCell>
            <TableCell className="text-gray-800">
              {department.coordinator ? (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{department.coordinator.name}</span>
                  <span className="text-sm text-gray-500">({department.coordinator.email})</span>
                </div>
              ) : (
                <span className="text-gray-400">No coordinator assigned</span>
              )}
            </TableCell>
          </TableRow>

          {department.createdAt && (
            <TableRow className="transition-colors">
              <TableCell className="font-semibold text-gray-800">Created At</TableCell>
              <TableCell className="text-gray-800">
                {formatDate(department.createdAt)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IScholarship } from "@/interface/response/scholarship";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconAward, IconCalendar, IconMenu3 } from "@tabler/icons-react";
import { Activity, AlarmClockOff, MonitorCheck } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";

interface ScholarshipTableProps {
  scholarships: IScholarship[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getStatusBadge = (applicationDeadline: string) => {
  const deadlineDate = new Date(applicationDeadline);
  const currentDate = new Date();
  const isActive = deadlineDate > currentDate;

  if (isActive) {
    return (
      <Badge variant="green">
        <Activity className="w-3 h-3" />
        Active
      </Badge>
    );
  } else {
    return (
      <Badge variant="slate">
        <IconCalendar className="w-3 h-3" />
        Expired
      </Badge>
    );
  }
};

export const ScholarshipTable = ({ scholarships, isSearching, onEdit, onDelete }: ScholarshipTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-800 text-nowrap">Title</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Provider</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Value</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Department</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Deadline</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Status</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scholarships.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-800">
                {isSearching ? "No matching scholarships found" : "No scholarships yet"}
              </TableCell>
            </TableRow>
          ) : (
            scholarships.map((scholarship) => (
              <TableRow
                key={scholarship._id}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(scholarship._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="flex items-center gap-2">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                    <IconAward className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 line-clamp-1">{scholarship.title}</p>
                    <p className="text-sm text-gray-800 line-clamp-2">{scholarship.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-800">{scholarship.provider}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-gray-800">{scholarship.value}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {scholarship.department ? (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800 text-nowrap">{scholarship.department.name}</p>
                      </div>
                    ) : (
                      <span className="text-gray-800">No department</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <AlarmClockOff className="w-4 h-4 text-gray-800" />
                    <p className="text-gray-800 text-nowrap text-sm">
                      {formatDate(scholarship.applicationDeadline)}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    {getStatusBadge(scholarship.applicationDeadline)}
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
                        onClick={() => onEdit(scholarship._id)}
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
                        onClick={() => onDelete(scholarship._id)}
                        className="text-gray-800 hover:text-mainDangerV1 hover:bg-transparent"
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
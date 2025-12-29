"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ITopic } from "@/interface/response/topic";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconMenu3 } from "@tabler/icons-react";
import { getRoleBadge } from "@/lib/badge-helpers";

interface TopicTableProps {
  topics: ITopic[];
  isSearching: boolean;
  currentPage: number;
  pageSize: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeColorMap: Record<string, BadgeProps["variant"]> = {
  event: "blue",
  scholarship: "green",
  notification: "orange",
  job: "indigo",
  advertisement: "purple",
  internship: "cyan",
  recruitment: "teal",
  volunteer: "emerald",
  extracurricular: "pink",
};

export const TopicTable = ({
  topics,
  isSearching,
  currentPage,
  pageSize,
  onEdit,
  onDelete,
}: TopicTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-800 text-nowrap w-[60px]">
              No.
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Title
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Type
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap min-w-[200px]">
              Department
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Created By
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Created At
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Deadline
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-800">
                {isSearching ? "No topic found" : "No topic"}
              </TableCell>
            </TableRow>
          ) : (
            topics.map((topic, index) => (
              <TableRow
                key={topic._id}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(topic._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="text-gray-800 font-medium">
                  {(currentPage - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell className="text-gray-800">
                  <div className="font-semibold text-gray-800">
                    {topic.title}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {topic.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={typeColorMap[topic.type] || "outline"}
                    className="capitalize"
                  >
                    {topic.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {topic.department ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="orange">{topic.department.code}</Badge>
                      <Badge variant="orange">{topic.department.name}</Badge>
                    </div>
                  ) : (
                    <Badge variant="gray">General</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-gray-800 font-semibold">
                    {topic.createdBy.name}
                  </div>
                  <div className="mt-1">
                    {getRoleBadge(topic.createdBy.role)}
                  </div>
                </TableCell>
                <TableCell className="text-gray-800">
                  {new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(topic.createdAt))}
                </TableCell>
                <TableCell className="text-gray-800">
                  {topic.applicationDeadline ? (
                    <div>
                      <div className="font-medium">
                        {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(topic.applicationDeadline))}
                      </div>
                      <Badge
                        variant={
                          new Date(topic.applicationDeadline) < new Date()
                            ? "destructive"
                            : "green"
                        }
                        className="mt-1 text-sm"
                      >
                        {new Date(topic.applicationDeadline) < new Date()
                          ? "Expired"
                          : "Active"}
                      </Badge>
                    </div>
                  ) : topic.endDate ? (
                    <div>
                      <div className="font-medium">
                        {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(topic.endDate))}
                      </div>
                      <Badge
                        variant={
                          new Date(topic.endDate) < new Date()
                            ? "destructive"
                            : "green"
                        }
                        className="mt-1 text-sm"
                      >
                        {new Date(topic.endDate) < new Date()
                          ? "Expired"
                          : "Active"}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
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
                        onClick={() => onEdit(topic._id)}
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
                        onClick={() => onDelete(topic._id)}
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

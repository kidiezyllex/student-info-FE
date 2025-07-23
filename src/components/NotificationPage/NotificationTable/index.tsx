"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INotification } from "@/interface/response/notification";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconBell, IconStar } from "@tabler/icons-react";

interface NotificationTableProps {
  notifications: INotification[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getTypeBadge = (type: string) => {
  switch (type.toLowerCase()) {
    case 'announcement':
      return <Badge variant="orange">Announcement</Badge>;
    case 'academic':
      return <Badge variant="green">Academic</Badge>;
    case 'scholarship':
      return <Badge variant="purple">Scholarship</Badge>;
    case 'event':
      return <Badge variant="orange">Event</Badge>;
    case 'system':
      return <Badge variant="red">System</Badge>;
    case 'urgent':
      return <Badge variant="red">Urgent</Badge>;
    default:
      return <Badge variant="outline">{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  }
};

const getStatusBadge = (startDate: string, endDate: string) => {
  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (currentDate < start) {
    return (
      <Badge variant="yellow" className="flex items-center gap-1">
        Scheduled
      </Badge>
    );
  } else if (currentDate >= start && currentDate <= end) {
    return (
      <Badge variant="green" className="flex items-center gap-1">
        Active
      </Badge>
    );
  } else {
    return (
      <Badge variant="red" className="flex items-center gap-1">
        Expired
      </Badge>
    );
  }
};

export const NotificationTable = ({ notifications, isSearching, onEdit, onDelete }: NotificationTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Title</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Type</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Department</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Period</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Status</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Priority</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-secondaryTextV1">
                {isSearching ? "No matching notifications found" : "No notifications yet"}
              </TableCell>
            </TableRow>
          ) : (
            notifications.map((notification) => (
              <TableRow
                key={notification._id}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(notification._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="flex items-center gap-2">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                    <IconBell className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="max-w-xs">
                    <p className="font-semibold text-mainTextV1">{notification.title}</p>
                    <p className="text-sm text-secondaryTextV1 line-clamp-2">{notification.content}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getTypeBadge(notification.type)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {notification.department ? (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-mainTextV1">{notification.department.name}</p>
                        <p className="text-xs text-secondaryTextV1">ID: {notification.department._id}</p>
                      </div>
                    ) : (
                      <span className="text-secondaryTextV1">All departments</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-secondaryTextV1">
                    <div>Start: {new Date(notification.startDate).toLocaleDateString()}</div>
                    <div>End: {new Date(notification.endDate).toLocaleDateString()}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getStatusBadge(notification.startDate, notification.endDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {notification.isImportant ? (
                      <Badge variant="red">
                        <IconStar className="w-3 h-3" />
                        Important
                      </Badge>
                    ) : (
                      <Badge variant="gray">
                        Normal
                      </Badge>
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
                        onClick={() => onEdit(notification._id)}
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
                        onClick={() => onDelete(notification._id)}
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
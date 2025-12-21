"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INotification } from "@/interface/response/notification";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconBell, IconStar, IconClock, IconX, IconMenu3 } from "@tabler/icons-react";
import { Activity } from "lucide-react";

interface NotificationTableProps {
  notifications: INotification[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getTypeBadge = (type: string) => {
  switch (type.toLowerCase()) {
    case 'scholarship':
      return <Badge variant="indigo">Scholarship</Badge>;
    case 'event':
      return <Badge variant="sky">Event</Badge>;
    case 'notification':
      return <Badge variant="blue">Notification</Badge>;
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
      <Badge variant="yellow">
        <IconClock className="h-3 w-3" />
        Scheduled
      </Badge>
    );
  } else if (currentDate >= start && currentDate <= end) {
    return (
      <Badge variant="green">
        <Activity className="h-3 w-3" />
        Active
      </Badge>
    );
  } else {
    return (
      <Badge variant="red">
        <IconX className="h-3 w-3" />
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
            <TableHead className="font-semibold text-gray-800 text-nowrap">Title</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Type</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Department</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Period</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Status</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Priority</TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-800">
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
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                    <IconBell className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="max-w-xs">
                    <p className="font-semibold text-gray-800 line-clamp-1">{notification.title}</p>
                    <p className="text-sm text-gray-800 line-clamp-2">{notification.content}</p>
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
                       <p className="text-sm font-semibold text-gray-800 text-nowrap">{notification.department.name}</p>
                    ) : (
                      <span className="text-gray-800 text-nowrap">All departments</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-gray-800">
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
                      <Badge variant="orange">
                        <IconStar className="h-3 w-3" />
                        Important
                      </Badge>
                    ) : (
                      <Badge variant="gray">
                        <IconBell className="h-3 w-3" />
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
                        onClick={() => onDelete(notification._id)}
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
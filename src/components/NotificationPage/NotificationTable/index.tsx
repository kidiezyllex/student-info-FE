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
  const typeColors: Record<string, string> = {
    'announcement': 'bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-100',
    'academic': 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-100',
    'scholarship': 'bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-100',
    'event': 'bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-100',
    'system': 'bg-red-500 hover:bg-red-600 text-white border-2 border-red-100',
    'urgent': 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-100',
    'default': 'bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-100'
  };

  const colorClass = typeColors[type.toLowerCase()] || typeColors.default;

  return (
    <Badge className={`text-nowrap flex items-center gap-1 ${colorClass}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

const getStatusBadge = (startDate: string, endDate: string) => {
  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (currentDate < start) {
    return (
      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-100 text-nowrap flex items-center gap-1">
        Scheduled
      </Badge>
    );
  } else if (currentDate >= start && currentDate <= end) {
    return (
      <Badge className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-100 text-nowrap flex items-center gap-1">
        Active
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-100 text-nowrap flex items-center gap-1">
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
          <TableRow className="bg-[#1B61FF20] hover:bg-gray-50">
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Title</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Type</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Department</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Period</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Status</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Priority</TableHead>
            <TableHead className="font-medium text-mainTextV1 text-nowrap">Action</TableHead>
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
                <TableCell className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <IconBell className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="max-w-xs">
                    <p className="font-medium text-mainTextV1">{notification.title}</p>
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
                        <p className="text-sm font-medium text-mainTextV1">{notification.department.name}</p>
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
                      <Badge className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-100 text-nowrap flex items-center gap-1">
                        <IconStar className="w-3 h-3" />
                        Important
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-100 text-nowrap flex items-center gap-1">
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
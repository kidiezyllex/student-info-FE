"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IEvent } from "@/interface/response/event";
import { formatDate } from "@/utils/dateFormat";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconCalendar, IconMapPin, IconUser, IconBuilding } from "@tabler/icons-react";

interface EventTableProps {
  events: IEvent[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EventTable = ({ events, isSearching, onEdit, onDelete }: EventTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getEventStatusBadge = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-100 text-nowrap flex items-center gap-1">
          Upcoming
        </Badge>
      );
    } else if (now >= start && now <= end) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-100 text-nowrap flex items-center gap-1">
          Ongoing
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-100 text-nowrap flex items-center gap-1">
          Ended
        </Badge>
      );
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#1B61FF20] hover:bg-gray-50">
            <TableHead className="font-medium text-mainTextV1">Event Name</TableHead>
            <TableHead className="font-medium text-mainTextV1">Time</TableHead>
            <TableHead className="font-medium text-mainTextV1">Location</TableHead>
            <TableHead className="font-medium text-mainTextV1">Department</TableHead>
            <TableHead className="font-medium text-mainTextV1">Organizer</TableHead>
            <TableHead className="font-medium text-mainTextV1">Status</TableHead>
            <TableHead className="font-medium text-mainTextV1">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-secondaryTextV1">
                {isSearching ? "No event found" : "No event"}
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => {
              return (
                <TableRow
                  key={event._id}
                  className="hover:bg-gray-50 transition-colors"
                  onMouseEnter={() => setHoveredRow(event._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-primary">{event.title}</p>
                      <p className="text-sm text-secondaryTextV1 line-clamp-2">{event.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <div className="text-sm">
                        <p className="text-mainTextV1 font-medium">
                          {formatDate(event.startDate)}
                        </p>
                        <p className="text-secondaryTextV1">
                          to {formatDate(event.endDate)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-secondaryTextV1 text-sm">{event.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-mainTextV1 font-medium text-sm">
                          {event.department?.name || "Not updated"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-secondaryTextV1 text-sm">{event.organizer}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getEventStatusBadge(event.startDate, event.endDate)}
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
                          onClick={() => onEdit(event._id)}
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
                          onClick={() => onDelete(event._id)}
                          className="text-mainTextV1 hover:text-mainDangerV1 hover:bg-transparent"
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
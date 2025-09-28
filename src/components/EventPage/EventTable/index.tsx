"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IEvent } from "@/interface/response/event";
import { formatDate } from "@/utils/dateFormat";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconCalendar, IconMapPin, IconUser, IconBuilding, IconMenu3 } from "@tabler/icons-react";
import { Activity, AlarmClock, AlarmClockOff } from "lucide-react";

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
        <Badge variant="orange">
          Upcoming
        </Badge>
      );
    } else if (now >= start && now <= end) {
      return (
        <Badge variant="green"><Activity className="h-3 w-3" />Ongoing</Badge>
      );
    } else {
      return (
        <Badge variant="gray">
          Ended
        </Badge>
      );
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
            <TableHead className="font-semibold text-mainTextV1">Event Name</TableHead>
            <TableHead className="font-semibold text-mainTextV1">Time</TableHead>
            <TableHead className="font-semibold text-mainTextV1">Location</TableHead>
            <TableHead className="font-semibold text-mainTextV1">Department</TableHead>
            <TableHead className="font-semibold text-mainTextV1">Organizer</TableHead>
            <TableHead className="font-semibold text-mainTextV1">Status</TableHead>
            <TableHead className="font-semibold text-mainTextV1">Action</TableHead>
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
                  <TableCell className="flex items-center gap-2">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                      <IconCalendar className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-mainTextV1 font-semibold">{event.title}</p>
                      <p className="text-sm text-secondaryTextV1 line-clamp-2">Desc: {event.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1"> 
                        <AlarmClock className="w-4 h-4 text-mainTextV1" />
                        <p className="text-mainTextV1 text-nowrap text-sm">
                          {formatDate(event.startDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1"> 
                        <AlarmClockOff className="w-4 h-4 text-mainTextV1" />
                        <p className="text-secondaryTextV1 text-nowrap text-sm">
                          {formatDate(event.endDate)}
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
                        <p className="text-mainTextV1 font-semibold text-sm">
                          {event.department?.name || "Not updated"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-semibold">
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
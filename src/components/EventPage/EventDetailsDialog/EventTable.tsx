"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IEvent } from "@/interface/response/event";
import { formatDate } from "@/utils/dateFormat";
import { 
  IconCalendar, 
  IconMapPin, 
  IconUser, 
  IconBuilding,
  IconFileDescription,
} from "@tabler/icons-react";

interface EventTableProps {
  event: IEvent;
}

export const EventTable = ({ event }: EventTableProps) => {
  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { status: "upcoming", label: "Upcoming", color: "orange" };
    } else if (now >= start && now <= end) {
      return { status: "ongoing", label: "Ongoing", color: "green" };
    } else {
      return { status: "ended", label: "Ended", color: "gray" };
    }
  };

  const eventStatus = getEventStatus(event.startDate, event.endDate);

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
            <TableCell className="font-semibold text-gray-800">Event Title</TableCell>
            <TableCell className="text-gray-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">{event.title}</span>
                <Badge variant={eventStatus.color as any}>
                  {eventStatus.label}
                </Badge>
              </div>
            </TableCell>
          </TableRow>

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <IconCalendar className="w-4 h-4" />
                Time
              </div>
            </TableCell>
            <TableCell className="text-gray-800">
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </TableCell>
          </TableRow>

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <IconMapPin className="w-4 h-4" />
                Location
              </div>
            </TableCell>
            <TableCell className="text-gray-800">
              {event.location}
            </TableCell>
          </TableRow>

          {event.department && (
            <TableRow className="transition-colors">
              <TableCell className="font-semibold text-gray-800">
                <div className="flex items-center gap-2">
                  <IconBuilding className="w-4 h-4" />
                  Department
                </div>
              </TableCell>
              <TableCell className="text-gray-800">
                {event.department.name}
              </TableCell>
            </TableRow>
          )}

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <IconUser className="w-4 h-4" />
                Organizer
              </div>
            </TableCell>
            <TableCell className="text-gray-800">
              {event.organizer}
            </TableCell>
          </TableRow>

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-gray-800 align-top">
              <div className="flex items-center gap-2">
                <IconFileDescription className="w-4 h-4" />
                Description
              </div>
            </TableCell>
            <TableCell className="text-gray-800 whitespace-pre-wrap">
              {event.description}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

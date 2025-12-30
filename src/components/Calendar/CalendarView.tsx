"use client";

import React, { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ICalendarEvent } from "@/interface/response/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconMapPin, IconClock, IconUser } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: ICalendarEvent & { color?: string };
  color?: string;
}

export interface CalendarInfo {
  id: string;
  name: string;
  color: string;
}

interface CalendarViewProps {
  events: (ICalendarEvent & { color?: string })[];
  isLoading?: boolean;
  calendars?: CalendarInfo[];
}

export function CalendarView({
  events,
  isLoading,
  calendars,
}: CalendarViewProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<
    (ICalendarEvent & { color?: string }) | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return events.map((event) => ({
      id: event.id,
      title: event.summary,
      start: new Date(event.start),
      end: new Date(event.end),
      resource: event,
      color: event.color,
    }));
  }, [events]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event.resource);
    setIsDialogOpen(true);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || "#3B82F6",
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "none",
        display: "block",
        fontSize: "0.875rem",
        padding: "2px 6px",
      },
    };
  };

  const renderTableRow = (label: string, value: React.ReactNode) => (
    <TableRow className="transition-colors">
      <TableCell className="font-semibold text-gray-800 w-1/3 align-top">
        {label}
      </TableCell>
      <TableCell className="text-gray-800">{value}</TableCell>
    </TableRow>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Card className="p-4 bg-white shadow-lg">
        <div className="calendar-container" style={{ height: "600px" }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            popup
            style={{ height: "100%" }}
            views={["month", "week", "day", "agenda"]}
          />
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center gap-2">
            <DialogTitle className="text-2xl font-semibold text-gray-800 w-fit">
              {selectedEvent?.summary}
            </DialogTitle>
            {calendars && selectedEvent && (
              <div className="w-fit -translate-y-1">
                {calendars
                  .filter((cal) => cal.color === selectedEvent.color)
                  .map((cal) => (
                    <div
                      key={cal.id}
                      style={{ background: cal.color }}
                      className="flex items-center gap-2 px-3 py-0.5 rounded-full shadow-sm border"
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                      <span className="text-sm font-medium text-white">
                        {cal.name}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </DialogHeader>
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-800 w-1/3">
                  Field
                </TableHead>
                <TableHead className="font-semibold text-gray-800">
                  Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedEvent &&
                renderTableRow(
                  "Time",
                  <div className="flex flex-col">
                    <span>{format(new Date(selectedEvent.start), "PPpp")}</span>
                    <span className="text-gray-500 text-xs my-1">to</span>
                    <span>{format(new Date(selectedEvent.end), "PPpp")}</span>
                  </div>
                )}

              {selectedEvent?.location &&
                renderTableRow(
                  "Location",
                  <div className="flex items-center gap-2">
                    <IconMapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

              {selectedEvent?.description &&
                renderTableRow(
                  "Description",
                  <p className="whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                )}

              {selectedEvent?.organizer &&
                renderTableRow(
                  "Organized by",
                  <div className="flex items-center gap-2">
                    <IconUser className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>
                      {selectedEvent.organizer.displayName ||
                        selectedEvent.organizer.email}
                    </span>
                  </div>
                )}

              {renderTableRow(
                "Status",
                <Badge
                  variant={
                    selectedEvent?.status === "confirmed"
                      ? "default"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {selectedEvent?.status || "N/A"}
                </Badge>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-header {
          padding: 12px 6px;
          font-weight: 600;
          color: #374151;
          background-color: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }
        .rbc-today {
          background-color: #dbeafe;
        }
        .rbc-off-range-bg {
          background-color: #f9fafb;
        }
        .rbc-event {
          padding: 4px 8px;
          font-size: 0.875rem;
        }
        .rbc-event:hover {
          opacity: 1 !important;
          transform: scale(1.02);
          transition: all 0.2s;
        }
        .rbc-toolbar button {
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .rbc-toolbar button:hover {
          background-color: #f3f4f6;
          border-color: #f56c14;
        }
        .rbc-toolbar button.rbc-active {
          background-color: #f56c14;
          color: white;
          border-color: #f56c14;
        }
        .rbc-toolbar button.rbc-active:hover {
          background-color: #ea580c;
          color: white;
        }
      `}</style>
    </>
  );
}

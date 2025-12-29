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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconMapPin, IconClock, IconUser } from "@tabler/icons-react";

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
  resource: ICalendarEvent;
}

interface CalendarViewProps {
  events: ICalendarEvent[];
  isLoading?: boolean;
}

export function CalendarView({ events, isLoading }: CalendarViewProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return events.map((event) => ({
      id: event.id,
      title: event.summary,
      start: new Date(event.start),
      end: new Date(event.end),
      resource: event,
    }));
  }, [events]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event.resource);
    setIsDialogOpen(true);
  };

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "#3B82F6",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Card className="p-6 bg-white shadow-lg">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">
              {selectedEvent?.summary}
            </DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-4">
                {/* Time */}
                <div className="flex items-start gap-3">
                  <IconClock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-700">Time</p>
                    <p className="text-sm text-gray-600">
                      {selectedEvent &&
                        format(new Date(selectedEvent.start), "PPpp")}
                    </p>
                    <p className="text-sm text-gray-600">
                      to{" "}
                      {selectedEvent &&
                        format(new Date(selectedEvent.end), "PPpp")}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {selectedEvent?.location && (
                  <div className="flex items-start gap-3">
                    <IconMapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-700">Location</p>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedEvent?.description && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Description</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Organizer */}
                {selectedEvent?.organizer && (
                  <div className="flex items-start gap-3">
                    <IconUser className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-700">Organizer</p>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.organizer.displayName ||
                          selectedEvent.organizer.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedEvent?.status === "confirmed"
                        ? "default"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {selectedEvent?.status}
                  </Badge>
                </div>

                {/* Link to Google Calendar */}
                {selectedEvent?.htmlLink && (
                  <div className="pt-4 border-t">
                    <a
                      href={selectedEvent.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                    >
                      View in Google Calendar →
                    </a>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
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
          border-color: #9ca3af;
        }
        .rbc-toolbar button.rbc-active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .rbc-toolbar button.rbc-active:hover {
          background-color: #2563eb;
        }
      `}</style>
    </>
  );
}

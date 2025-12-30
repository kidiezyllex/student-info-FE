"use client";

import React from "react";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { useGetCalendarEvents } from "@/hooks/useCalendar";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
export default function CalendarPage() {
  const calendars = [
    {
      id: "c_6d1538434f0949f4572a2e27a19bc4433076bc33fab658dbc801e55e469993b0@group.calendar.google.com",
      name: "CSE2023",
      color: "rgb(173, 20, 87)",
    },
    {
      id: "en.vietnamese#holiday@group.v.calendar.google.com",
      name: "Holidays in Vietnam",
      color: "rgb(11, 128, 67)",
    },
    {
      id: "16773@student.vgu.edu.vn",
      name: "Duy Nguyen Quang",
      color: "rgb(3, 155, 229)",
    },
  ];

  const {
    data: data1,
    isLoading: isLoading1,
    error: error1,
  } = useGetCalendarEvents({
    calendarId: calendars[0].id,
    maxResults: 50,
  });

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useGetCalendarEvents({
    calendarId: calendars[1].id,
    maxResults: 50,
  });

  const {
    data: data3,
    isLoading: isLoading3,
    error: error3,
  } = useGetCalendarEvents({
    calendarId: calendars[2].id,
    maxResults: 50,
  });

  const allEvents = React.useMemo(() => {
    const events1 =
      data1?.data.events.map((e) => ({ ...e, color: calendars[0].color })) ||
      [];
    const events2 =
      data2?.data.events.map((e) => ({ ...e, color: calendars[1].color })) ||
      [];
    const events3 =
      data3?.data.events.map((e) => ({ ...e, color: calendars[2].color })) ||
      [];
    return [...events1, ...events2, ...events3];
  }, [data1, data2, data3]);

  const isLoading = isLoading1 || isLoading2 || isLoading3;
  const error = error1 || error2 || error3;

  return (
    <div className="flex-1 space-y-4 bg-mainBackgroundV1 p-4 rounded-lg border border-lightBorderV1">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/student">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Calendar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap gap-2">
          {calendars.map((cal) => (
            <div
              key={cal.id}
              className="flex items-center gap-2 bg-white px-3 rounded-full shadow-sm border"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cal.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {cal.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Calendar View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CalendarView
          events={allEvents}
          isLoading={isLoading}
          calendars={calendars}
        />
      </motion.div>
    </div>
  );
}

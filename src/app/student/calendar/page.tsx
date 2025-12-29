"use client";

import React, { useState } from "react";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { useGetCalendarEvents } from "@/hooks/useCalendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconCalendarEvent, IconSearch } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function CalendarPage() {
  // Default calendar ID from the API example
  const defaultCalendarId =
    "c_6d1538434f0949f4572a2e27a19bc4433076bc33fab658dbc801e55e469993b0@group.calendar.google.com";

  const [calendarId, setCalendarId] = useState(defaultCalendarId);
  const [searchCalendarId, setSearchCalendarId] = useState(defaultCalendarId);
  const [maxResults, setMaxResults] = useState(20);

  const { data, isLoading, error } = useGetCalendarEvents({
    calendarId: searchCalendarId,
    maxResults,
  });

  const handleSearch = () => {
    setSearchCalendarId(calendarId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <IconCalendarEvent className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Class Calendar
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            View your class schedule and upcoming events
          </p>
        </motion.div>

        {/* Calendar Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-2 border-blue-100">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <IconSearch className="w-5 h-5 text-blue-600" />
                Calendar Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label
                    htmlFor="calendarId"
                    className="text-sm font-medium text-gray-700"
                  >
                    Calendar ID
                  </Label>
                  <Input
                    id="calendarId"
                    type="text"
                    value={calendarId}
                    onChange={(e) => setCalendarId(e.target.value)}
                    placeholder="Enter Google Calendar ID"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="maxResults"
                    className="text-sm font-medium text-gray-700"
                  >
                    Max Events
                  </Label>
                  <Input
                    id="maxResults"
                    type="number"
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
              >
                <IconSearch className="w-4 h-4 mr-2" />
                Load Calendar
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Calendar Info */}
        {data && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {data.data.calendarName}
                  </h3>
                  <p className="text-sm text-blue-100">
                    Showing {data.data.events.length} of {data.data.totalEvents}{" "}
                    events
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{data.data.totalEvents}</p>
                  <p className="text-sm text-blue-100">Total Events</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-red-50 border-2 border-red-200">
              <div className="text-center space-y-2">
                <p className="text-red-600 font-semibold">
                  Error loading calendar
                </p>
                <p className="text-red-500 text-sm">{error.message}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CalendarView
            events={data?.data.events || []}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
}

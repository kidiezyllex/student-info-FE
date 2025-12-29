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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 bg-red-50 border-2 border-red-200">
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

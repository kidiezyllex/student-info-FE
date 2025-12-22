"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IconTrendingUp, IconCalendar, IconGift, IconBell } from "@tabler/icons-react";
import { ITopic } from "@/interface/response/topic";

type StatsSectionProps = {
  topics: ITopic[];
};

export function StatsSection({ topics }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border border-lightBorderV1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Topics</p>
              <p className="text-2xl font-semibold text-gray-800">{topics.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <IconTrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-lightBorderV1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-semibold text-gray-800">
                {topics.filter(t => t.type === "event" && t.startDate && new Date(t.startDate) > new Date()).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <IconCalendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-lightBorderV1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scholarships</p>
              <p className="text-2xl font-semibold text-gray-800">
                {topics.filter(t => t.type === "scholarship").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <IconGift className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-lightBorderV1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notifications</p>
              <p className="text-2xl font-semibold text-gray-800">
                {topics.filter(t => t.type === "notification").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <IconBell className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


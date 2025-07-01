"use client";

import { useEffect, useState } from "react";
import { useGetNotifications } from "@/hooks/useNotification";
import { useGetUpcomingEvents } from "@/hooks/useEvent";
import { useGetActiveScholarships } from "@/hooks/useScholarship";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconRobot, IconGift, IconCalendar, IconBell, IconArrowRight } from "@tabler/icons-react";
import { useUser } from "@/context/useUserContext";

export default function StudentDashboard() {
  const { profile } = useUser();
  const { data: notificationsData, isLoading: isLoadingNotifications } = useGetNotifications();
  const { data: eventsData, isLoading: isLoadingEvents } = useGetUpcomingEvents();
  const { data: scholarshipsData, isLoading: isLoadingScholarships } = useGetActiveScholarships();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'student':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-100 text-nowrap flex items-center gap-1">
            Student
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-100 text-nowrap flex items-center gap-1">
            {role}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Student Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border border-lightBorderV1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-mainTextV1">
                  {getTimeGreeting()}, {profile?.data?.name || 'Student'}!
                </CardTitle>
                <CardDescription className="text-secondaryTextV1 mt-2">
                  Welcome to your student dashboard. Stay updated with scholarships, events, and notifications.
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                {profile?.data?.role && getRoleBadge(profile.data.role)}
                <p className="text-sm text-secondaryTextV1">{profile?.data?.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-mainTextV1 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-lightBorderV1 hover:border-mainTextHoverV1 transition-colors cursor-pointer">
            <Link href="/student/chat">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <IconRobot className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg text-mainTextV1">AI Chat</CardTitle>
                <CardDescription className="text-secondaryTextV1">
                  Get instant help and answers from our AI assistant
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="border border-lightBorderV1 hover:border-mainTextHoverV1 transition-colors cursor-pointer">
            <Link href="/student/scholarships">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <IconGift className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg text-mainTextV1">Scholarships</CardTitle>
                <CardDescription className="text-secondaryTextV1">
                  Browse available scholarships and opportunities
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="border border-lightBorderV1 hover:border-mainTextHoverV1 transition-colors cursor-pointer">
            <Link href="/student/events">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <IconCalendar className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-mainTextV1">Events</CardTitle>
                <CardDescription className="text-secondaryTextV1">
                  Discover upcoming events and activities
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="border border-lightBorderV1 hover:border-mainTextHoverV1 transition-colors cursor-pointer">
            <Link href="/student/notifications">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <IconBell className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg text-mainTextV1">Notifications</CardTitle>
                <CardDescription className="text-secondaryTextV1">
                  View your latest notifications and updates
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </motion.div>

      {/* Recent Updates Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-mainTextV1 mb-4">Recent Updates</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notifications */}
          <Card className="border border-lightBorderV1">
            <CardHeader>
              <CardTitle className="text-lg text-mainTextV1 flex items-center gap-2">
                <IconBell className="w-5 h-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingNotifications ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : notificationsData?.data?.length ? (
                <div className="space-y-3">
                  {notificationsData.data.slice(0, 3).map((notification: any) => (
                    <div key={notification._id} className="border-b border-lightBorderV1 last:border-0 pb-2 last:pb-0">
                      <p className="text-sm font-medium text-mainTextV1 line-clamp-2">
                        {notification.title}
                      </p>
                      <p className="text-xs text-secondaryTextV1 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  <Link href="/student/notifications">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View All <IconArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-secondaryTextV1">No notifications available</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border border-lightBorderV1">
            <CardHeader>
              <CardTitle className="text-lg text-mainTextV1 flex items-center gap-2">
                <IconCalendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEvents ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : eventsData?.data?.length ? (
                <div className="space-y-3">
                  {eventsData.data.slice(0, 3).map((event: any) => (
                    <div key={event._id} className="border-b border-lightBorderV1 last:border-0 pb-2 last:pb-0">
                      <p className="text-sm font-medium text-mainTextV1 line-clamp-2">
                        {event.title}
                      </p>
                      <p className="text-xs text-secondaryTextV1 mt-1">
                        {new Date(event.startDate).toLocaleDateString()} - {event.location}
                      </p>
                    </div>
                  ))}
                  <Link href="/student/events">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View All <IconArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-secondaryTextV1">No upcoming events</p>
              )}
            </CardContent>
          </Card>

          {/* Active Scholarships */}
          <Card className="border border-lightBorderV1">
            <CardHeader>
              <CardTitle className="text-lg text-mainTextV1 flex items-center gap-2">
                <IconGift className="w-5 h-5" />
                Active Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingScholarships ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : scholarshipsData?.data?.length ? (
                <div className="space-y-3">
                  {scholarshipsData.data.slice(0, 3).map((scholarship: any) => (
                    <div key={scholarship._id} className="border-b border-lightBorderV1 last:border-0 pb-2 last:pb-0">
                      <p className="text-sm font-medium text-mainTextV1 line-clamp-2">
                        {scholarship.title}
                      </p>
                      <p className="text-xs text-secondaryTextV1 mt-1">
                        Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  <Link href="/student/scholarships">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View All <IconArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-secondaryTextV1">No active scholarships</p>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
} 
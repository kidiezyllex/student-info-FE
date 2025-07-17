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
import { IconRobot, IconGift, IconCalendar, IconBell, IconArrowRight, IconTrendingUp, IconUsers } from "@tabler/icons-react";
import { useUser } from "@/context/useUserContext";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const QuickActionCard = ({ href, icon: Icon, title, description, color, delay = 0 }: {
    href: string;
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    delay?: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="w-full"
        >
            <Link href={href}>
                <Card className="group relative overflow-hidden h-full bg-gradient-to-br from-white to-gray-50/30 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                    {/* Background decorations */}
                    <div
                        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8"
                        style={{ backgroundColor: color }}
                    />
                    <div
                        className="absolute bottom-0 left-0 w-16 h-16 rounded-full opacity-5 -ml-4 -mb-4"
                        style={{ backgroundColor: color }}
                    />

                    <CardHeader className="flex flex-col items-center justify-center gap-4">
                        {/* Icon container with enhanced styling */}
                        <div
                            className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative"
                            style={{
                                background: `linear-gradient(135deg, ${color}15 0%, ${color}25 50%, ${color}35 100%)`,
                                border: `2px solid ${color}20`
                            }}
                        >
                            {/* Inner glow effect */}
                            <div
                                className="absolute inset-2 rounded-2xl opacity-30"
                                style={{
                                    background: `linear-gradient(135deg, ${color}20 0%, transparent 100%)`,
                                }}
                            />
                            <Icon size={36} style={{ color }} className="drop-shadow-lg relative z-10" />
                        </div>

                        {/* Title with enhanced typography */}
                        <CardTitle className="text-xl font-bold text-mainTextV1 group-hover:text-opacity-90 transition-all duration-300">
                            {title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-secondaryTextV1 text-base">
                            {description}
                        </p>
                    </CardContent>

                    {/* Enhanced hover effect overlay */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-8 transition-opacity duration-500"
                        style={{ backgroundImage: `linear-gradient(135deg, ${color} 0%, transparent 70%)` }}
                    />

                    {/* Bottom accent line */}
                    <div
                        className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                        style={{ backgroundColor: color }}
                    />
                </Card>
            </Link>
        </motion.div>
    );
};

const StatCard = ({ icon: Icon, title, count, color }: {
    icon: React.ElementType;
    title: string;
    count: number;
    color: string;
}) => {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-md rounded-lg p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div
                className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10 -mr-4 -mt-4"
                style={{ backgroundColor: color }}
            />

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-secondaryTextV1 text-sm font-medium uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <p
                        className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                        style={{
                            backgroundImage: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`
                        }}
                    >
                        {count}
                    </p>
                </div>
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                    style={{
                        background: `linear-gradient(135deg, ${color}20 0%, ${color}30 100%)`,
                        border: `1px solid ${color}30`
                    }}
                >
                    <Icon size={24} style={{ color }} className="drop-shadow-md" />
                </div>
            </div>
        </div>
    );
};

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

    const quickActions = [
        {
            href: "/student/chat",
            icon: IconRobot,
            title: "AI Chat",
            description: "Get instant help and answers from our AI assistant",
            color: "#8B5CF6"
        },
        {
            href: "/student/scholarships",
            icon: IconGift,
            title: "Scholarships",
            description: "Browse available scholarships and opportunities",
            color: "#10B981"
        },
        {
            href: "/student/events",
            icon: IconCalendar,
            title: "Events",
            description: "Discover upcoming events and activities",
            color: "#3B82F6"
        },
        {
            href: "/student/notifications",
            icon: IconBell,
            title: "Notifications",
            description: "View your latest notifications and updates",
            color: "#F59E0B"
        }
    ];

    return (
        <div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/student">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <motion.div
                className="space-y-8"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Quick Stats */}
                <motion.div variants={item}>
                    <h2 className="text-xl font-semibold text-mainTextV1 mb-4">Quick Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            icon={IconBell}
                            title="Notifications"
                            count={notificationsData?.data?.length || 0}
                            color="#F59E0B"
                        />
                        <StatCard
                            icon={IconCalendar}
                            title="Upcoming Events"
                            count={eventsData?.data?.length || 0}
                            color="#3B82F6"
                        />
                        <StatCard
                            icon={IconGift}
                            title="Active Scholarships"
                            count={scholarshipsData?.data?.length || 0}
                            color="#10B981"
                        />
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={item}>
                    <h2 className="text-xl font-semibold text-mainTextV1 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action, index) => (
                            <QuickActionCard
                                key={action.title}
                                href={action.href}
                                icon={action.icon}
                                title={action.title}
                                description={action.description}
                                color={action.color}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Recent Updates Grid */}
                <motion.div variants={item}>
                    <h2 className="text-xl font-semibold text-mainTextV1 mb-4">Recent Updates</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Notifications */}
                        <Card className="bg-gradient-to-br from-white to-orange-50/30 border-0 shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-mainTextV1 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                                        <IconBell className="w-5 h-5 text-orange-600" />
                                    </div>
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
                                            <div key={notification._id} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-orange-100/50">
                                                <p className="text-sm font-medium text-mainTextV1 line-clamp-2 mb-1">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-secondaryTextV1">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                        <Link href="/student/notifications">
                                            <Button 
                                            className="mt-2 w-full"
                                            size="sm">
                                                View All <IconArrowRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-sm text-secondaryTextV1 text-center py-4">No notifications available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Upcoming Events */}
                        <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-mainTextV1 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                        <IconCalendar className="w-5 h-5 text-blue-600" />
                                    </div>
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
                                            <div key={event._id} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-blue-100/50">
                                                <p className="text-sm font-medium text-mainTextV1 line-clamp-2 mb-1">
                                                    {event.title}
                                                </p>
                                                <p className="text-xs text-secondaryTextV1">
                                                    {new Date(event.startDate).toLocaleDateString()} - {event.location}
                                                </p>
                                            </div>
                                        ))}
                                        <Link href="/student/events">
                                            <Button 
                                            className="mt-2 w-full"
                                            size="sm">
                                                View All <IconArrowRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-sm text-secondaryTextV1 text-center py-4">No upcoming events</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Active Scholarships */}
                        <Card className="bg-gradient-to-br from-white to-green-50/30 border-0 shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-mainTextV1 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                        <IconGift className="w-5 h-5 text-green-600" />
                                    </div>
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
                                            <div key={scholarship._id} className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-green-100/50">
                                                <p className="text-sm font-medium text-mainTextV1 line-clamp-2 mb-1">
                                                    {scholarship.title}
                                                </p>
                                                <p className="text-xs text-secondaryTextV1">
                                                    Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                        <Link href="/student/scholarships">
                                            <Button 
                                             className="mt-2 w-full"
                                            size="sm">
                                                View All <IconArrowRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-sm text-secondaryTextV1 text-center py-4">No active scholarships</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
} 
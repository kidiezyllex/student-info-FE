"use client";

import { useEffect, useState } from "react";
import { useGetClerkUserProfile } from "@/hooks/useUser";
import { useUser as useClerkUser } from "@clerk/nextjs";
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
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconRobot, IconGift, IconCalendar, IconBell, IconArrowRight, IconTrendingUp, IconUsers } from "@tabler/icons-react";

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
                <Card className="group relative overflow-hidden h-full bg-white hover:bg-gray-50/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-lightBorderV1 hover:border-gray-300">
                    {/* Subtle background accent */}
                    <div
                        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-30 -mr-6 -mt-6 transition-all duration-500 group-hover:opacity-8"
                        style={{ backgroundColor: color }}
                    />
                    
                    {/* Minimal corner accent */}
                    <div
                        className="absolute top-0 left-0 w-0 h-0 border-t-[16px] border-l-[16px] border-transparent opacity-0 transition-all duration-500"
                        style={{ 
                            borderTopColor: color,
                            borderLeftColor: color
                        }}
                    />

                    <CardHeader className="flex flex-col items-center justify-center gap-4 pb-4">
                        {/* Clean icon container */}
                        <div
                            className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 relative"
                            style={{
                                background: `linear-gradient(135deg, ${color}08 0%, ${color}15 100%)`,
                                border: `1px solid ${color}20`
                            }}
                        >
                            <Icon 
                                size={32} 
                                style={{ color }} 
                                className="transition-all duration-300 group-hover:scale-110" 
                            />
                        </div>

                        <CardTitle className="text-base font-semibold text-mainTextV1 group-hover:text-opacity-80 transition-all duration-300 text-center">
                            {title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <p className="text-secondaryTextV1 text-sm text-center leading-relaxed group-hover:text-opacity-70 transition-all duration-300">
                            {description}
                        </p>
                    </CardContent>

                    {/* Subtle bottom accent */}
                    <div
                        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
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
        <div className="bg-gradient-to-br from-white to-gray-50/50 border border-lightBorderV1 rounded-lg p-4 relative overflow-hidden">
            <div
                className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-30 -mr-4 -mt-4"
                style={{ backgroundColor: color }}
            />

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-secondaryTextV1 text-sm font-semibold uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <p
                        className="text-2xl font-semibold bg-gradient-to-r bg-clip-text text-transparent"
                        style={{
                            backgroundImage: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`
                        }}
                    >
                        {count}
                    </p>
                </div>
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-lightBorderV1"
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

export default function StudentPage() {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useClerkUser();
  
  const { data: userProfile, isLoading: isProfileLoading, error: profileError } = useGetClerkUserProfile({
    enabled: isClerkLoaded && isSignedIn && !!clerkUser
  });

  if (!isClerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Clerk...</p>
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示提示
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access the student dashboard.</p>
        </div>
      </div>
    );
  }

  // 如果正在加载用户资料，显示加载状态
  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading profile: {profileError.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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

        {/* 简化的统计卡片 */}
        <motion.div variants={item}>
          <h2 className="text-xl font-semibold text-mainTextV1 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={IconBell}
              title="Notifications"
              count={0}
              color="#F59E0B"
            />
            <StatCard
              icon={IconCalendar}
              title="Upcoming Events"
              count={0}
              color="#3B82F6"
            />
            <StatCard
              icon={IconGift}
              title="Active Scholarships"
              count={0}
              color="#10B981"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 
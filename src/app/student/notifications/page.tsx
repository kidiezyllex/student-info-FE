"use client";

import { useEffect, useState } from "react";
import { useGetNotifications } from "@/hooks/useNotification";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { IconSearch, IconBell, IconFilter, IconEye, IconCalendar, IconX } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INotification } from "@/interface/response/notification";

type NotificationFilter = "all" | "important";

export default function StudentNotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>("all");
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState<INotification[]>([]);

  const { data: notificationsData, isLoading, refetch } = useGetNotifications();

  useEffect(() => {
    if (notificationsData?.data) {
      let filtered = notificationsData.data;
      
      if (searchQuery.trim()) {
        filtered = filtered.filter(notification =>
          notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (notificationFilter === "important") {
        filtered = filtered.filter(notification => notification.isImportant);
      }
      
      setFilteredNotifications(filtered);
    } else {
      setFilteredNotifications([]);
    }
  }, [notificationsData, searchQuery, notificationFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilterChange = (value: NotificationFilter) => {
    setNotificationFilter(value);
  };

  const handleViewDetails = (notification: INotification) => {
    setSelectedNotification(notification);
    setIsDetailsDialogOpen(true);
  };

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'announcement':
        return (
          <Badge variant="orange">
            Announcement
          </Badge>
        );
      case 'reminder':
        return (
          <Badge variant="purple">
            Reminder
          </Badge>
        );
      case 'alert':
        return (
          <Badge variant="yellow">
            Alert
          </Badge>
        );
      default:
        return (
          <Badge variant="gray">
            {type}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-8 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/student">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Notifications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full md:w-96">
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-10 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-secondaryTextV1"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 w-5 h-5" />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 hover:text-red-500 transition-colors"
                    type="button"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <IconFilter className="w-5 h-5 text-mainTextV1" />
                <Select value={notificationFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All notifications</SelectItem>
                    <SelectItem value="important">Important only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <Card key={index} className="border border-lightBorderV1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`border transition-colors cursor-pointer hover:border-mainTextHoverV1 ${
                    notification.isImportant ? 'border-red-200 bg-red-50' : 'border-lightBorderV1'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {notification.isImportant && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                            <CardTitle className="text-lg text-mainTextV1 line-clamp-1">
                              {notification.title}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeBadge(notification.type)}
                            {notification.isImportant && (
                              <Badge variant="red">
                                Important
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-secondaryTextV1">
                            {getTimeAgo(notification.createdAt)} • {formatDate(notification.createdAt)}
                          </CardDescription>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(notification)}
                            className="text-secondaryTextV1 hover:text-mainTextV1"
                          >
                            <IconEye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent 
                      className="pt-0 cursor-pointer"
                      onClick={() => handleViewDetails(notification)}
                    >
                      <p className="text-sm text-secondaryTextV1 line-clamp-3">
                        {notification.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border border-lightBorderV1">
              <CardContent className="p-8 text-center">
                <IconBell className="w-12 h-12 text-secondaryTextV1 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-mainTextV1 mb-2">
                  No notifications found
                </h3>
                <p className="text-secondaryTextV1 text-sm">
                  {searchQuery || notificationFilter !== "all" ? 
                    "Try adjusting your search terms or filters." : 
                    "You don't have any notifications yet."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent size="medium" className="max-h-[90vh] h-[90vh] overflow-y-auto bg-white flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl text-mainTextV1">
              {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription className="text-secondaryTextV1">
              {selectedNotification && formatDate(selectedNotification.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {getTypeBadge(selectedNotification.type)}
                {selectedNotification.isImportant && (
                  <Badge variant="red">
                    Important
                  </Badge>
                )}
                {selectedNotification.department && (
                  <Badge variant="gray">
                    {selectedNotification.department.name}
                  </Badge>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-mainTextV1 mb-3">Content</h4>
                <p className="text-secondaryTextV1 whitespace-pre-wrap leading-relaxed">
                  {selectedNotification.content}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-mainTextV1 mb-1">Created</h4>
                  <p className="text-sm text-secondaryTextV1">
                    {formatDate(selectedNotification.createdAt)}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-mainTextV1 mb-1">Type</h4>
                  <p className="text-sm text-secondaryTextV1">
                    {selectedNotification.type}
                  </p>
                </div>

                {selectedNotification.startDate && (
                  <div>
                    <h4 className="text-sm font-semibold text-mainTextV1 mb-1">Start Date</h4>
                    <p className="text-sm text-secondaryTextV1">
                      {formatDate(selectedNotification.startDate)}
                    </p>
                  </div>
                )}

                {selectedNotification.endDate && (
                  <div>
                    <h4 className="text-sm font-semibold text-mainTextV1 mb-1">End Date</h4>
                    <p className="text-sm text-secondaryTextV1">
                      {formatDate(selectedNotification.endDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
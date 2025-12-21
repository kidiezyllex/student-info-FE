"use client";

import { useEffect, useState } from "react";
import { useGetNotifications, useDeleteNotification } from "@/hooks/useNotification";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationTable } from "@/components/NotificationPage/NotificationTable";
import { NotificationCreateDialog } from "@/components/NotificationPage/NotificationCreateDialog";
import { NotificationDetailsDialog } from "@/components/NotificationPage/NotificationDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch, IconPlus, IconX } from "@tabler/icons-react";
import { INotification } from "@/interface/response/notification";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function NotificationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [importanceFilter, setImportanceFilter] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [filteredNotifications, setFilteredNotifications] = useState<INotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const { data: notificationsData, isLoading, refetch } = useGetNotifications();
  const { mutateAsync: deleteNotificationMutation, isPending: isDeleting } = useDeleteNotification();

  useEffect(() => {
    if (notificationsData?.data) {
      let filtered = notificationsData.data;

      if (typeFilter) {
        filtered = filtered.filter(notification => notification.type === typeFilter);
      }

      if (importanceFilter) {
        const isImportant = importanceFilter === "important";
        filtered = filtered.filter(notification => notification.isImportant === isImportant);
      }

      if (searchQuery.trim()) {
        filtered = filtered.filter(notification =>
          notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (notification.department && notification.department.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      setFilteredNotifications(filtered);
      setCurrentPage(1);
    } else {
      setFilteredNotifications([]);
      setCurrentPage(1);
    }
  }, [notificationsData?.data, searchQuery, typeFilter, importanceFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };


  const handleImportanceFilterChange = (value: string) => {
    setImportanceFilter(value === "all" ? "" : value);
  };

  const handleEdit = (id: string) => {
    setSelectedNotificationId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedNotificationId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNotificationId) {
      return Promise.resolve();
    }

    try {
      const response = await deleteNotificationMutation(selectedNotificationId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Notification Management</BreadcrumbPage>
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
                  placeholder="Search notification..."
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
              <Select value={importanceFilter || "all"} onValueChange={handleImportanceFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priority</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              <IconPlus className="h-4 w-4" />
              Add notification
            </Button>
          </div>

          <Card className="p-0 overflow-hidden border border-lightBorderV1">
            {isLoading ? (
              <div className="p-4">
                <div className="flex flex-col gap-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <NotificationTable
                notifications={paginatedNotifications}
                isSearching={!!searchQuery || !!typeFilter || !!importanceFilter}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
          {filteredNotifications.length > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={notificationsData?.total || filteredNotifications.length}
              totalPages={notificationsData?.totalPages || Math.ceil(filteredNotifications.length / pageSize)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </motion.div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete Notification"
        successMessage="Notification deleted successfully!"
        errorMessage="Failed to delete notification."
        warningMessage="This will permanently remove the notification and all associated data."
      />

      <NotificationCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => refetch()}
      />

      {selectedNotificationId && (
        <NotificationDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedNotificationId(null);
          }}
          notificationId={selectedNotificationId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
} 
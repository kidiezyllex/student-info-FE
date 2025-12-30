"use client";

import { useEffect, useState } from "react";
import { useGetActivityLogs } from "@/hooks/useActivityLog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityLogsTable } from "@/components/ActivityLogsPage/ActivityLogsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch, IconX, IconRefresh } from "@tabler/icons-react";

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const params = {
    page: currentPage,
    limit: pageSize,
    action: actionFilter !== "all" ? actionFilter : undefined,
    resource: resourceFilter !== "all" ? resourceFilter : undefined,
  };

  const { data: logsData, isLoading, refetch } = useGetActivityLogs(params);

  const filteredLogs = logsData?.data
    ? logsData.data.filter((log) => {
        if (searchQuery.trim()) {
          return (
            log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return true;
      })
    : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, actionFilter, resourceFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleActionFilterChange = (value: string) => {
    setActionFilter(value);
  };

  const handleResourceFilterChange = (value: string) => {
    setResourceFilter(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    refetch();
  };

  const hasSearchFilter = searchQuery.trim();
  const displayLogs = hasSearchFilter ? filteredLogs : logsData?.data || [];

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Activity Logs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Search by user, action, resource, details..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-10 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-gray-800"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-red-500 transition-colors"
                  type="button"
                >
                  <IconX className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={actionFilter}
                onValueChange={handleActionFilterChange}
              >
                <SelectTrigger className="w-[180px] focus:border-mainTextHoverV1">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={resourceFilter}
                onValueChange={handleResourceFilterChange}
              >
                <SelectTrigger className="w-[200px] focus:border-mainTextHoverV1">
                  <SelectValue placeholder="Filter by resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Department">Department</SelectItem>
                  <SelectItem value="Topic">Topic</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Scholarship">Scholarship</SelectItem>
                  <SelectItem value="Notification">Notification</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-lightBorderV1 hover:bg-gray-50"
              >
                <IconRefresh className="h-4 w-4" />
                Refresh
              </Button>
            </div>
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
              <ActivityLogsTable
                logs={displayLogs}
                isSearching={!!searchQuery}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}
          </Card>
          {!hasSearchFilter && (logsData?.totalPages ?? 0) > 1 && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={logsData?.total || 0}
              totalPages={logsData?.totalPages || 0}
              onPageChange={handlePageChange}
            />
          )}
          {hasSearchFilter && filteredLogs.length > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredLogs.length}
              totalPages={Math.ceil(filteredLogs.length / pageSize)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

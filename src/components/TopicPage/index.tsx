"use client";

import { useEffect, useState } from "react";
import { useGetTopicsAdmin } from "@/hooks/useTopic";
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
import { TopicTable } from "@/components/TopicPage/TopicTable";
import { TopicCreateDialog } from "@/components/TopicPage/TopicCreateDialog";
import { TopicDetailsDialog } from "@/components/TopicPage/TopicDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch, IconX, IconPlus } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteTopic } from "@/hooks/useTopic";
import { DeleteDialog } from "@/components/ui/delete-dialog";

const topicTypes = [
  "all",
  "event",
  "scholarship",
  "notification",
  "job",
  "advertisement",
  "internship",
  "recruitment",
  "volunteer",
  "extracurricular",
];

export default function TopicPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const {
    data: topicsData,
    isLoading,
    refetch,
  } = useGetTopicsAdmin({
    page: currentPage,
    limit: pageSize,
    type: typeFilter === "all" ? undefined : (typeFilter as any),
    // TODO: Uncomment when backend is ready
    // status: statusFilter === "all" ? undefined : (statusFilter as "active" | "expired"),
  });
  const { mutateAsync: deleteTopicMutation, isPending: isDeleting } =
    useDeleteTopic();

  // Helper function to check if topic is expired
  const isTopicExpired = (topic: any) => {
    const deadline = topic.applicationDeadline || topic.endDate;
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  // Filter client-side by search and status
  const filteredTopics = topicsData?.data
    ? topicsData.data.filter((topic) => {
        // Search filter
        const matchesSearch =
          searchQuery.trim() === "" ||
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.department?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          topic.department?.code
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          topic.type.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "expired" && isTopicExpired(topic)) ||
          (statusFilter === "active" &&
            !isTopicExpired(topic) &&
            (topic.applicationDeadline || topic.endDate));

        return matchesSearch && matchesStatus;
      })
    : [];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: string) => {
    setSelectedTopicId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedTopicId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTopicId) {
      return Promise.resolve();
    }
    try {
      const response = await deleteTopicMutation(selectedTopicId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const hasSearchFilter = searchQuery.trim();
  const displayTopics = hasSearchFilter
    ? filteredTopics
    : topicsData?.data || [];

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Topic Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Search topic..."
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[220px] focus:border-mainTextHoverV1">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {topicTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all"
                        ? "All Types"
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] focus:border-mainTextHoverV1">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                <IconPlus className="h-4 w-4" />
                Add Topic
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
              <TopicTable
                topics={displayTopics}
                isSearching={!!searchQuery}
                currentPage={currentPage}
                pageSize={pageSize}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>

          {!hasSearchFilter &&
            topicsData?.totalPages &&
            topicsData.totalPages > 1 && (
              <Pagination
                page={currentPage}
                pageSize={pageSize}
                total={topicsData.total || 0}
                totalPages={topicsData.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          {hasSearchFilter && filteredTopics.length > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredTopics.length}
              totalPages={Math.ceil(filteredTopics.length / pageSize)}
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
        title="Delete Topic"
        description="Are you sure you want to delete this topic? This action cannot be undone."
        confirmText="Delete Topic"
        successMessage="Topic deleted successfully!"
        errorMessage="Failed to delete topic."
        warningMessage="This will permanently remove the topic and all associated data."
      />

      <TopicCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => refetch()}
      />

      {selectedTopicId && (
        <TopicDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedTopicId(null);
          }}
          topicId={selectedTopicId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

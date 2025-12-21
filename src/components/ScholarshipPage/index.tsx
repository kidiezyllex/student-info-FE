"use client";

import { useEffect, useState } from "react";
import { useGetAllScholarships, useGetActiveScholarships, useDeleteScholarship } from "@/hooks/useScholarship";
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
import { ScholarshipTable } from "@/components/ScholarshipPage/ScholarshipTable";
import { ScholarshipCreateDialog } from "@/components/ScholarshipPage/ScholarshipCreateDialog";
import { ScholarshipDetailsDialog } from "@/components/ScholarshipPage/ScholarshipDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch, IconPlus, IconFilter, IconX } from "@tabler/icons-react";
import { IScholarship } from "@/interface/response/scholarship";
import { DeleteDialog } from "@/components/ui/delete-dialog";

type ScholarshipFilter = "all" | "active";

export default function ScholarshipPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scholarshipFilter, setScholarshipFilter] = useState<ScholarshipFilter>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);
  const [filteredScholarships, setFilteredScholarships] = useState<IScholarship[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const { data: allScholarshipsData, isLoading: isLoadingAll, refetch: refetchAll } = useGetAllScholarships();
  const { data: activeScholarshipsData, isLoading: isLoadingActive, refetch: refetchActive } = useGetActiveScholarships();
  const { mutateAsync: deleteScholarshipMutation, isPending: isDeleting } = useDeleteScholarship();

  const isLoading = scholarshipFilter === "all" ? isLoadingAll : isLoadingActive;
  const scholarshipsData = scholarshipFilter === "all" ? allScholarshipsData : activeScholarshipsData;
  const refetch = scholarshipFilter === "all" ? refetchAll : refetchActive;

  useEffect(() => {
    if (scholarshipsData?.data) {
      let filtered = scholarshipsData.data;
      
      if (searchQuery.trim()) {
        filtered = filtered.filter(scholarship =>
          scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scholarship.eligibility.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (scholarship.department && scholarship.department.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      setFilteredScholarships(filtered);
      // Reset to first page when data changes
      setCurrentPage(1);
    } else {
      setFilteredScholarships([]);
      setCurrentPage(1);
    }
  }, [scholarshipsData, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilterChange = (value: ScholarshipFilter) => {
    setScholarshipFilter(value);
  };

  const handleEdit = (id: string) => {
    setSelectedScholarshipId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedScholarshipId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedScholarshipId) {
      return Promise.resolve();
    }

    try {
      const response = await deleteScholarshipMutation(selectedScholarshipId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSuccess = () => {
    refetchAll();
    refetchActive();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedScholarships = filteredScholarships.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Scholarship Management</BreadcrumbPage>
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
                  placeholder="Search scholarship..."
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
              <Select value={scholarshipFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All scholarships</SelectItem>
                    <SelectItem value="active">Active scholarships</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              <IconPlus className="h-4 w-4" />
              Add scholarship
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
              <ScholarshipTable
                scholarships={paginatedScholarships}
                isSearching={!!searchQuery}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
          {filteredScholarships.length > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredScholarships.length}
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
        title="Delete Scholarship"
        description="Are you sure you want to delete this scholarship? This action cannot be undone."
        confirmText="Delete Scholarship"
        successMessage="Scholarship deleted successfully!"
        errorMessage="Failed to delete scholarship."
        warningMessage="This will permanently remove the scholarship and all associated data."
      />
      
      <ScholarshipCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleSuccess}
      />
      
      {selectedScholarshipId && (
        <ScholarshipDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedScholarshipId(null);
          }}
          scholarshipId={selectedScholarshipId}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
} 
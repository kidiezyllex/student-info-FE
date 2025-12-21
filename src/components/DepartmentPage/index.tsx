"use client";

import { useEffect, useState } from "react";
import { useGetAllDepartments, useDeleteDepartment } from "@/hooks/useDepartment";
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
import { DepartmentTable } from "@/components/DepartmentPage/DepartmentTable";
import { DepartmentCreateDialog } from "@/components/DepartmentPage/DepartmentCreateDialog";
import { DepartmentDetailsDialog } from "@/components/DepartmentPage/DepartmentDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IconSearch, IconPlus, IconX } from "@tabler/icons-react";
import { IDepartment } from "@/interface/response/department";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function DepartmentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinatorFilter, setCoordinatorFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Get hasCoordinator parameter for API call
  // "all" -> undefined (no filter)
  // "with" -> true (departments with coordinator)
  // "without" -> false (departments without coordinator)
  const hasCoordinatorParam = coordinatorFilter === "all" 
    ? undefined 
    : coordinatorFilter === "with" 
    ? true 
    : false;
  
  const { data: departmentsData, isLoading, refetch } = useGetAllDepartments(currentPage, pageSize, hasCoordinatorParam);
  const { mutateAsync: deleteDepartmentMutation, isPending: isDeleting } = useDeleteDepartment();

  // Filter users based on search query (client-side filtering for search only)
  const filteredDepartments = departmentsData?.data ? departmentsData.data.filter(department =>
    searchQuery.trim() === "" ||
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    department.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (department.description && department.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  // Reset to first page when search query or coordinator filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, coordinatorFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleCoordinatorFilterChange = (value: string) => {
    setCoordinatorFilter(value);
  };

  const handleEdit = (id: string) => {
    setSelectedDepartmentId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedDepartmentId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDepartmentId) {
      return Promise.resolve();
    }
    try {
      const response = await deleteDepartmentMutation(selectedDepartmentId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const hasSearchFilter = searchQuery.trim();
  const displayDepartments = hasSearchFilter ? filteredDepartments : (departmentsData?.data || []);

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" suppressHydrationWarning>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Department Management</BreadcrumbPage>
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
                placeholder="Search department..."
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
              <Select value={coordinatorFilter} onValueChange={handleCoordinatorFilterChange}>
                <SelectTrigger className="w-[200px] focus:border-mainTextHoverV1">
                  <SelectValue placeholder="Filter by coordinator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="with">With Coordinator</SelectItem>
                  <SelectItem value="without">Without Coordinator</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                <IconPlus className="h-4 w-4" />
                Add department
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
              <DepartmentTable
                departments={displayDepartments}
                isSearching={!!searchQuery}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}
          </Card>
          {!hasSearchFilter && departmentsData?.totalPages && departmentsData.totalPages > 1 && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={departmentsData.total || 0}
              totalPages={departmentsData.totalPages}
              onPageChange={handlePageChange}
            />
          )}
          {hasSearchFilter && filteredDepartments.length > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredDepartments.length}
              totalPages={Math.ceil(filteredDepartments.length / pageSize)}
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
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
        confirmText="Delete Department"
        successMessage="Department deleted successfully!"
        errorMessage="Failed to delete department."
        warningMessage="This will permanently remove the department and all associated data."
      />
      
      <DepartmentCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => refetch()}
      />
      
      {selectedDepartmentId && (
        <DepartmentDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedDepartmentId(null);
          }}
          departmentId={selectedDepartmentId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { useGetAllUsers, useDeleteUser } from "@/hooks/useUser";
import { useUser } from "@/context/useUserContext";
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
import { UserTable } from "@/components/UserPage/UserTable";
import { UserCreateDialog } from "@/components/UserPage/UserCreateDialog";
import { UserDetailsDialog } from "@/components/UserPage/UserDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch, IconPlus, IconX } from "@tabler/icons-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function CoordinatorStudentPage() {
  const { profile } = useUser();
  const departmentId = profile?.data?.department?._id;

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Fetch only students from the coordinator's department
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetAllUsers(currentPage, pageSize, "student", departmentId);

  const { mutateAsync: deleteUserMutation, isPending: isDeleting } =
    useDeleteUser();

  const filteredUsers = usersData?.data
    ? usersData.data.filter((user) => {
        if (searchQuery.trim()) {
          return (
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.fullName &&
              user.fullName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (user.studentId &&
              user.studentId
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (user.phoneNumber &&
              user.phoneNumber
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
          );
        }

        return true;
      })
    : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) {
      return Promise.resolve();
    }

    try {
      const response = await deleteUserMutation(selectedUserId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const hasSearchFilter = searchQuery.trim();
  const displayUsers = hasSearchFilter ? filteredUsers : usersData?.data || [];

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/coordinator">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Student Management</BreadcrumbPage>
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
                placeholder="Search by name, email, student ID..."
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
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              >
                <IconPlus className="h-4 w-4" />
                Add Student
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
              <UserTable
                users={displayUsers}
                isSearching={!!searchQuery}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}
          </Card>
          {!hasSearchFilter &&
            usersData?.totalPages &&
            usersData.totalPages > 1 && (
              <Pagination
                page={currentPage}
                pageSize={pageSize}
                total={usersData.total || 0}
                totalPages={usersData.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          {hasSearchFilter && filteredUsers.length > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredUsers.length}
              totalPages={Math.ceil(filteredUsers.length / pageSize)}
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
        title="Delete Student"
        description="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete Student"
        successMessage="Student deleted successfully!"
        errorMessage="Failed to delete student."
        warningMessage="This will permanently remove the student and all associated data."
      />

      <UserCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => refetch()}
      />

      {selectedUserId && (
        <UserDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedUserId(null);
          }}
          userId={selectedUserId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

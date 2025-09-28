"use client";

import { useEffect, useState } from "react";
import { useGetAllUsers, useDeleteUser } from "@/hooks/useUser";
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
import { UserTable } from "@/components/UserPage/UserTable";
import { UserCreateDialog } from "@/components/UserPage/UserCreateDialog";
import { UserDetailsDialog } from "@/components/UserPage/UserDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IconSearch, IconPlus, IconX } from "@tabler/icons-react";
import { IUser } from "@/interface/response/user";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);

  const { data: usersData, isLoading, refetch } = useGetAllUsers();
  const { mutateAsync: deleteUserMutation, isPending: isDeleting } = useDeleteUser();

  // Filter users based on search query
  useEffect(() => {
    if (usersData?.data) {
      if (searchQuery.trim()) {
        const filtered = usersData.data.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.studentId && user.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.department && user.department.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.department && user.department.code.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(usersData.data);
      }
    }
  }, [usersData?.data, searchQuery]);

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

  return (
    <div className="space-y-8 bg-mainBackgroundV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>User Management</BreadcrumbPage>
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
                placeholder="Search by name, email, role, department..."
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
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
          >
            <IconPlus className="h-4 w-4" />
            Add User
          </Button>
          </div>

          <Card className="p-0 overflow-hidden border border-lightBorderV1">
            {isLoading ? (
              <div className="p-6">
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
                users={filteredUsers}
                isSearching={!!searchQuery}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
        </div>
      </motion.div>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete User"
        successMessage="User deleted successfully!"
        errorMessage="Failed to delete user."
        warningMessage="This will permanently remove the user and all associated data."
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
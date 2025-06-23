"use client";

import { useEffect, useState } from "react";
import { useGetHomeOwners, useSearchHomeOwners, useDeleteHomeOwner } from "@/hooks/useHomeOwner";
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
import { HomeOwnerTable } from "@/components/HomeOwnerPage/HomeOwnerTable";
import { HomeOwnerDeleteDialog } from "@/components/HomeOwnerPage/HomeOwnerDeleteDialog";
import { HomeOwnerCreateDialog } from "@/components/HomeOwnerPage/HomeOwnerCreateDialog";
import { HomeOwnerDetailsDialog } from "@/components/HomeOwnerPage/HomeOwnerDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { IHomeOwner } from "@/interface/response/homeOwner";

export default function HomeOwnerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IHomeOwner[]>([]);

  const { data: ownersData, isLoading, refetch } = useGetHomeOwners();
  const { data: searchData, isLoading: isSearchLoading } = useSearchHomeOwners({
    q: debouncedQuery
  });
  const { mutate: deleteOwnerMutation, isPending: isDeleting } = useDeleteHomeOwner();

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        setDebouncedQuery(searchQuery);
      } else {
        setDebouncedQuery("");
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  useEffect(() => {
    if (searchData?.data) {
      setSearchResults(searchData?.data as any);
    }
  }, [searchData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (id: string) => {
    setSelectedOwnerId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedOwnerId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedOwnerId) return;

    deleteOwnerMutation(
      { id: selectedOwnerId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa chủ nhà thành công");
            refetch();
            setIsDeleteDialogOpen(false);
            setSelectedOwnerId(null);
          } else {
            toast.error("Xóa chủ nhà thất bại");
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
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
            <BreadcrumbLink href="/homes">Quản lý người dùng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý chủ nhà</BreadcrumbPage>
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
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Tìm kiếm chủ nhà..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-secondaryTextV1"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 w-5 h-5" />
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Thêm chủ nhà
            </Button>
          </div>

          <Card className="p-0 overflow-hidden   border border-lightBorderV1">
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
              <HomeOwnerTable
                homeOwners={searchResults.length > 0 ? searchResults : (ownersData?.data || [])}
                isSearching={!!debouncedQuery}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
        </div>
      </motion.div>
      
      <HomeOwnerDeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
      
      <HomeOwnerCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => refetch()}
      />
      
      {selectedOwnerId && (
        <HomeOwnerDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedOwnerId(null);
          }}
          ownerId={selectedOwnerId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
} 
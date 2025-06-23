"use client";

import { useEffect, useState } from "react";
import { useGetGuests, useSearchGuests, useDeleteGuest } from "@/hooks/useGuest";
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
import { GuestTable } from "@/components/GuestPage/GuestTable";
import { GuestDeleteDialog } from "@/components/GuestPage/GuestDeleteDialog";
import { GuestCreateDialog } from "@/components/GuestPage/GuestCreateDialog";
import { GuestDetailsDialog } from "@/components/GuestPage/GuestDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { IGuestSearchResult } from "@/interface/response/guest";

export default function GuestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IGuestSearchResult[]>([]);

  const { data: guestsData, isLoading, refetch } = useGetGuests();
  const { data: searchData, isLoading: isSearchLoading } = useSearchGuests({
    q: debouncedQuery
  });
  const { mutateAsync: deleteGuestMutation, isPending: isDeleting } = useDeleteGuest();

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
      setSearchResults(searchData.data);
    }
  }, [searchData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (id: string) => {
    setSelectedGuestId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedGuestId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedGuestId) {
      return Promise.resolve();
    }

    try {
      const response = await deleteGuestMutation({ id: selectedGuestId });
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
            <BreadcrumbLink href="/homes">Quản lý người dùng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý khách hàng</BreadcrumbPage>
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
                placeholder="Tìm kiếm khách hàng..."
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
            Thêm khách hàng
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
              <GuestTable
                guests={searchResults.length > 0 ? searchResults : (guestsData?.data || [])}
                isSearching={!!debouncedQuery}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
        </div>
      </motion.div>
      <GuestDeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
      
      <GuestCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => refetch()}
      />
      
      {selectedGuestId && (
        <GuestDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedGuestId(null);
          }}
          guestId={selectedGuestId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
} 
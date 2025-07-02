"use client";

import { useEffect, useState } from "react";
import { useGetAllDatasetItems, useDeleteDatasetItem } from "@/hooks/useDataset";
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
import { DatasetTable } from "@/components/DatasetPage/DatasetTable";
import { DatasetDeleteDialog } from "@/components/DatasetPage/DatasetDeleteDialog";
import { DatasetCreateDialog } from "@/components/DatasetPage/DatasetCreateDialog";
import { DatasetDetailsDialog } from "@/components/DatasetPage/DatasetDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IconSearch, IconPlus, IconFilter } from "@tabler/icons-react";
import { IDatasetItem } from "@/interface/response/dataset";

export default function DatasetPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedDatasetItemId, setSelectedDatasetItemId] = useState<string | null>(null);
  const [filteredDatasetItems, setFilteredDatasetItems] = useState<IDatasetItem[]>([]);

  const { data: datasetData, isLoading, refetch } = useGetAllDatasetItems();
  const { mutateAsync: deleteDatasetItemMutation, isPending: isDeleting } = useDeleteDatasetItem();

  // Get unique categories for filter
  const categories = Array.from(new Set(datasetData?.data?.map(item => item.category) || []));

  // Filter dataset items based on search query and category
  useEffect(() => {
    if (datasetData?.data) {
      let filtered = datasetData.data;
      
      // Apply category filter
      if (categoryFilter) {
        filtered = filtered.filter(item => item.category === categoryFilter);
      }
      
      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(item =>
          item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.department && item.department.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      setFilteredDatasetItems(filtered);
    } else {
      setFilteredDatasetItems([]);
    }
  }, [datasetData?.data, searchQuery, categoryFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value === "all" ? "" : value);
  };

  const handleEdit = (id: string) => {
    setSelectedDatasetItemId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedDatasetItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDatasetItemId) {
      return Promise.resolve();
    }

    try {
      const response = await deleteDatasetItemMutation(selectedDatasetItemId);
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
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dataset Management</BreadcrumbPage>
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
                  placeholder="Search dataset..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-secondaryTextV1"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 w-5 h-5" />
              </div>
              
              <div className="flex items-center gap-2">
                <IconFilter className="w-5 h-5 text-mainTextV1" />
                <Select value={categoryFilter || "all"} onValueChange={handleCategoryFilterChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              <IconPlus className="h-4 w-4" />
              Add dataset item
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
              <DatasetTable
                datasetItems={filteredDatasetItems}
                isSearching={!!searchQuery || !!categoryFilter}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
        </div>
      </motion.div>
      
      <DatasetDeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
      
      <DatasetCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => refetch()}
      />
      
      {selectedDatasetItemId && (
        <DatasetDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedDatasetItemId(null);
          }}
          datasetItemId={selectedDatasetItemId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { useGetAllDatasetItems, useDeleteDatasetItem } from "@/hooks/useDataset";
import { useTrainAI, useGetTrainingHistory } from "@/hooks/useAI";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { DatasetTable } from "@/components/DatasetPage/DatasetTable";
import { DatasetCreateDialog } from "@/components/DatasetPage/DatasetCreateDialog";
import { DatasetDetailsDialog } from "@/components/DatasetPage/DatasetDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { IconSearch, IconPlus, IconFilter, IconBrain, IconHistory, IconX } from "@tabler/icons-react";
import { IDatasetItem } from "@/interface/response/dataset";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { formatDate } from "@/utils/format";

export default function DatasetPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedDatasetItemId, setSelectedDatasetItemId] = useState<string | null>(null);
  const [filteredDatasetItems, setFilteredDatasetItems] = useState<IDatasetItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [isTraining, setIsTraining] = useState(false);
  const [showTrainingHistory, setShowTrainingHistory] = useState(false);
  const { data: datasetData, isLoading, refetch } = useGetAllDatasetItems();
  const { mutateAsync: deleteDatasetItemMutation, isPending: isDeleting } = useDeleteDatasetItem();
  const { mutateAsync: trainAIMutation, isPending: isTrainingAI } = useTrainAI();
  const { data: trainingHistoryData, isLoading: isLoadingTrainingHistory, refetch: refetchTrainingHistory } = useGetTrainingHistory();
  const categories = Array.from(new Set(datasetData?.data?.map(item => item.category) || []));
  useEffect(() => {
    if (datasetData?.data) {
      let filtered = datasetData.data;

      if (categoryFilter) {
        filtered = filtered.filter(item => item.category === categoryFilter);
      }

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
    // Reset to first page when data changes
    setCurrentPage(1);
  }, [datasetData?.data, searchQuery, categoryFilter]);

  const handleTrainAI = async () => {
    setIsTraining(true);
    try {
      await trainAIMutation({});
      toast.success("AI training initiated successfully!");
      refetchTrainingHistory();
    } catch (error) {
      toast.error("Failed to initiate AI training.");
      console.error("AI training error:", error);
    } finally {
      setIsTraining(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDatasetItems = filteredDatasetItems.slice(startIndex, endIndex);

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
            <Button
              variant="outline"
              onClick={() => setShowTrainingHistory(!showTrainingHistory)}
            >
              <IconHistory className="h-4 w-4" />
              {showTrainingHistory ? "Hide History" : "Show History"}
            </Button>
            <Button
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
              onClick={handleTrainAI}
              disabled={isTrainingAI || isTraining}
            >
              <IconBrain className="h-4 w-4" />
              {isTrainingAI || isTraining ? "Training AI..." : "Train AI"}
            </Button>


            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              <IconPlus className="h-4 w-4" />
              Add New Dataset
            </Button>
          </div>

          {showTrainingHistory && (
            isLoadingTrainingHistory ? (
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-4 mt-4 w-full border border-lightBorderV1">
                <h3 className="text-lg font-semibold text-mainTextV1 mb-4">Training History</h3>
                {trainingHistoryData?.data && trainingHistoryData.data.length > 0 ? (
                  <div className="w-full overflow-auto max-h-[300px]">
                    <Table className="border border-lightBorderV1">
                      <TableHeader>
                        <TableRow className="bg-[#F56C1420] hover">
                          <TableHead className="font-semibold text-mainTextV1 text-nowrap">Status</TableHead>
                          <TableHead className="font-semibold text-mainTextV1 text-nowrap">Dataset Count</TableHead>
                          <TableHead className="font-semibold text-mainTextV1 text-nowrap">Categories</TableHead>
                          <TableHead className="font-semibold text-mainTextV1 text-nowrap">Department</TableHead>
                          <TableHead className="font-semibold text-mainTextV1 text-nowrap">Completed At</TableHead>
                          <TableHead className="font-semibold text-mainTextV1 text-nowrap">Created By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trainingHistoryData.data.map((item, index) => (
                          <TableRow key={index} className="transition-colors">
                            <TableCell className="text-secondaryTextV1">
                              <span className={`font-semibold capitalize ${item.status === "completed" ? "text-green-600" : item.status === "failed" ? "text-red-600" : "text-yellow-600"}`}>
                                {item.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-secondaryTextV1">
                              {item.datasetCount}
                            </TableCell>
                            <TableCell className="text-secondaryTextV1">
                              {item.categories && item.categories.length > 0 ? item.categories.join(", ") : "-"}
                            </TableCell>
                            <TableCell className="text-secondaryTextV1">
                              {item.department ? item.department.name : "-"}
                            </TableCell>
                            <TableCell className="text-secondaryTextV1">
                              {item.completedAt ? formatDate(item.completedAt) : "-"}
                            </TableCell>
                            <TableCell className="text-secondaryTextV1">
                              {item.createdBy ? item.createdBy.name : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-secondaryTextV1">No training history found.</p>
                )}
              </Card>
            )
          )}

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
                datasetItems={paginatedDatasetItems}
                isSearching={!!searchQuery || !!categoryFilter}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
          {filteredDatasetItems.length > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredDatasetItems.length}
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
        title="Delete Dataset Item"
        description="Are you sure you want to delete this dataset item? This action cannot be undone."
        confirmText="Delete Item"
        successMessage="Dataset item deleted successfully!"
        errorMessage="Failed to delete dataset item."
        warningMessage="This will permanently remove the dataset item and its associated data."
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
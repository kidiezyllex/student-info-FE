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
              onClick={handleTrainAI}
              disabled={isTrainingAI || isTraining}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <IconBrain className="h-4 w-4" />
              {isTrainingAI || isTraining ? "Training AI..." : "Train AI"}
            </Button>

            <Button
              onClick={() => setShowTrainingHistory(!showTrainingHistory)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <IconHistory className="h-4 w-4" />
              {showTrainingHistory ? "Hide History" : "Show History"}
            </Button>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-mainTextHoverV1 hover:bg-primary/90 text-white"
            >
              <IconPlus className="h-4 w-4" />
              Add dataset item
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
                <h3 className="text-lg font-semibold text-mainTextV1 mb-2">Training History</h3>
                {trainingHistoryData?.data && trainingHistoryData.data.length > 0 ? (
                  <ul className="space-y-4 max-h-52 overflow-y-auto pr-2">
                    {trainingHistoryData.data.map((item, index) => (
                      <li key={index} className="text-secondaryTextV1 bg-[#F9F9FC] p-3 border rounded-md border-lightBorderV1 bg-backgroundV1 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-mainTextV1">Status: <span className={`font-normal ${item.status === "completed" ? "text-green-500" : item.status === "failed" ? "text-red-500" : "text-yellow-500"}`}>{item.status}</span></p>
                          <p className="text-sm text-tertiaryTextV1">Started At: {formatDate(item.startedAt)}</p>
                        </div>
                        <p>Dataset Count: {item.datasetCount}</p>
                        {item.categories && item.categories.length > 0 && (
                          <p>Categories: {item.categories.join(", ")}</p>
                        )}
                        {item.department && (
                          <p>Department: {item.department.name}</p>
                        )}
                        {item.completedAt && <p className="text-sm text-tertiaryTextV1">Completed At: {formatDate(item.completedAt)}</p>}
                        {item.error && <p className="text-red-500">Error: {item.error}</p>}
                        {item.createdBy && <p className="text-sm text-tertiaryTextV1">Created By: {item.createdBy.name}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-secondaryTextV1">No training history found.</p>
                )}
              </Card>
            )
          )}

          <Card className="p-0 overflow-hidden border border-lightBorderV1 max-h-96 overflow-y-auto">
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
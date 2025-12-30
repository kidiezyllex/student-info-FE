"use client";

import { useState, useEffect } from "react";
import {
  useGetTopics,
  useGetTopicById,
  useSaveTopic,
  useUnsaveTopic,
} from "@/hooks/useTopic";
import { useGetUserProfile } from "@/hooks/useUser";
import { TopicType } from "@/interface/response/topic";
import { toast } from "react-toastify";
import { StatsSection } from "./StatsSection";
import { TopicFilters } from "./TopicFilters";
import { TopicCards } from "./TopicCards";
import { TopicDetailsDialog } from "./TopicDetailsDialog";
import { Pagination } from "@/components/ui/pagination";
import { topicTypes, typeColorMap, typeLabels } from "./constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconX, IconFilter } from "@tabler/icons-react";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function StudentHome() {
  // Topics
  const [selectedType, setSelectedType] = useState<TopicType | "all">("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [status, setStatus] = useState<"all" | "active" | "expired">("all");
  const [sortValue, setSortValue] = useState<"newest" | "oldest" | "deadline">(
    "newest"
  );
  const [deadlineFilter, setDeadlineFilter] = useState<"all" | "yes" | "no">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 9;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getSortParams = () => {
    switch (sortValue) {
      case "newest":
        return { sort: "createdAt", order: "desc" as const };
      case "oldest":
        return { sort: "createdAt", order: "asc" as const };
      case "deadline":
        return {
          sort: "applicationDeadline",
          order: "asc" as const,
        };
      default:
        return { sort: "createdAt", order: "desc" as const };
    }
  };

  const { sort, order } = getSortParams();

  const { data: topicsData, isLoading: isLoadingTopics } = useGetTopics({
    type: selectedType === "all" ? undefined : selectedType,
    page: currentPage,
    limit: limit,
    search: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    sort,
    order,
    hasDeadline:
      deadlineFilter === "all" ? undefined : deadlineFilter === "yes",
  });

  const { data: userProfile } = useGetUserProfile();

  // Reset page to 1 when filter type, search, status, sort or deadlineFilter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, debouncedSearch, status, sortValue, deadlineFilter]);
  const { data: selectedTopicData } = useGetTopicById(selectedTopicId || "");
  const { mutate: saveTopicMutation } = useSaveTopic();
  const { mutate: unsaveTopicMutation } = useUnsaveTopic();

  const handleSaveTopic = (topicId: string, isSaved: boolean) => {
    if (isSaved) {
      unsaveTopicMutation(topicId, {
        onSuccess: () => toast.success("Topic unsaved"),
      });
    } else {
      saveTopicMutation(topicId, {
        onSuccess: () => toast.success("Topic saved"),
      });
    }
  };

  const topics = topicsData?.data || [];
  const total = topicsData?.total || 0;
  const totalPages = topicsData?.totalPages || 0;
  const savedTopics = userProfile?.data?.savedTopics || [];

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-lightBorderV1 min-h-screen pb-24">
      <StatsSection topics={topics} />
      {/* Topic Cards */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {selectedType === "all"
            ? "All Topics"
            : typeLabels[selectedType as TopicType]}
        </h2>
        <TopicFilters
          selectedType={selectedType}
          onSelectType={setSelectedType}
          topicTypes={topicTypes}
          typeLabels={typeLabels}
        />

        {/* Search Input and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full lg:w-auto">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search topics by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IconX className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 bg-white">
                  <IconFilter className="w-4 h-4" />
                  Filter & Sort
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Refine your topics list
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Select
                        value={deadlineFilter}
                        onValueChange={(value: "all" | "yes" | "no") =>
                          setDeadlineFilter(value)
                        }
                      >
                        <SelectTrigger id="deadline">
                          <SelectValue placeholder="Deadline" />
                        </SelectTrigger>
                        <SelectContent className="z-[1001]">
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="yes">Has Deadline</SelectItem>
                          <SelectItem value="no">No Deadline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={status}
                        onValueChange={(value: "all" | "active" | "expired") =>
                          setStatus(value)
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="z-[1001]">
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                      <Label htmlFor="sort">Sort by</Label>
                      <Select
                        value={sortValue}
                        onValueChange={(
                          value: "newest" | "oldest" | "deadline"
                        ) => setSortValue(value)}
                      >
                        <SelectTrigger id="sort">
                          <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent className="z-[1001]">
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="oldest">Oldest</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TopicCards
          topics={topics}
          isLoading={isLoadingTopics}
          onSelectTopic={setSelectedTopicId}
          onToggleSave={handleSaveTopic}
          savedTopics={savedTopics}
        />
        {!isLoadingTopics && topics.length > 0 && (
          <Pagination
            page={currentPage}
            pageSize={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Topic Details Dialog */}
      <TopicDetailsDialog
        selectedTopicId={selectedTopicId}
        selectedTopicData={selectedTopicData as any}
        onClose={() => setSelectedTopicId(null)}
        onToggleSave={handleSaveTopic}
        typeColorMap={typeColorMap}
      />
    </div>
  );
}

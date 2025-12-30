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
import { Input } from "@/components/ui/input";
import { IconSearch, IconX } from "@tabler/icons-react";

export default function StudentHome() {
  // Topics
  const [selectedType, setSelectedType] = useState<TopicType | "all">("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
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

  const { data: topicsData, isLoading: isLoadingTopics } = useGetTopics({
    type: selectedType === "all" ? undefined : selectedType,
    page: currentPage,
    limit: limit,
    search: debouncedSearch || undefined,
  });

  const { data: userProfile } = useGetUserProfile();

  // Reset page to 1 when filter type or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, debouncedSearch]);
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

        {/* Search Input */}
        <div className="relative">
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

"use client";

import { useState, useEffect } from "react";
import { useGetTopics, useGetTopicById, useSaveTopic, useUnsaveTopic } from "@/hooks/useTopic";
import { TopicType } from "@/interface/response/topic";
import { toast } from "react-toastify";
import { StatsSection } from "./StatsSection";
import { TopicFilters } from "./TopicFilters";
import { TopicCards } from "./TopicCards";
import { TopicDetailsDialog } from "./TopicDetailsDialog";
import { Pagination } from "@/components/ui/pagination";
import { topicTypes, typeColorMap, typeLabels } from "./constants";

export default function StudentHome() {
  // Topics
  const [selectedType, setSelectedType] = useState<TopicType | "all">("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;
  
  const { data: topicsData, isLoading: isLoadingTopics } = useGetTopics({
    type: selectedType === "all" ? undefined : selectedType,
    page: currentPage,
    limit: limit,
  });

  // Reset page to 1 when filter type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);
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

  return (
    <div className="space-y-6 bg-white p-4 rounded-lg border border-lightBorderV1 min-h-screen pb-24">
      <StatsSection topics={topics} />
      {/* Topic Cards */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {selectedType === "all" ? "All Topics" : typeLabels[selectedType as TopicType]}
        </h2>
        <TopicFilters
            selectedType={selectedType}
            onSelectType={setSelectedType}
            topicTypes={topicTypes}
            typeLabels={typeLabels}
          />
        <TopicCards
          topics={topics}
          isLoading={isLoadingTopics}
          onSelectTopic={setSelectedTopicId}
          onToggleSave={handleSaveTopic}
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


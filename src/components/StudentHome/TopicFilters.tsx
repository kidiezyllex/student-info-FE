"use client";

import { Button } from "@/components/ui/button";
import { TopicType } from "@/interface/response/topic";

type TopicFiltersProps = {
  selectedType: TopicType | "all";
  onSelectType: (type: TopicType | "all") => void;
  topicTypes: TopicType[];
  typeLabels: Record<TopicType, string>;
};

export function TopicFilters({ selectedType, onSelectType, topicTypes, typeLabels }: TopicFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant={selectedType === "all" ? "default" : "outline"}
        onClick={() => onSelectType("all")}
        className={selectedType === "all" ? "bg-mainTextHoverV1 hover:bg-primary/90 text-white" : ""}
      >
        All Types
      </Button>
      {topicTypes.map((type) => (
        <Button
          key={type}
          variant={selectedType === type ? "default" : "outline"}
          onClick={() => onSelectType(type)}
          className={selectedType === type ? "bg-mainTextHoverV1 hover:bg-primary/90 text-white" : ""}
        >
          {typeLabels[type]}
        </Button>
      ))}
    </div>
  );
}


"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconBookmark, IconBookmarkFilled, IconCalendar } from "@tabler/icons-react";
import { ITopic, TopicType } from "@/interface/response/topic";
import Image from "next/image";

type TopicCardsProps = {
  topics: ITopic[];
  isLoading: boolean;
  selectedType: TopicType | "all";
  typeLabels: Record<TopicType, string>;
  typeColorMap: Record<TopicType, string>;
  onSelectTopic: (id: string) => void;
  onToggleSave: (id: string, isSaved: boolean) => void;
};

export function TopicCards({
  topics,
  isLoading,
  selectedType,
  typeLabels,
  typeColorMap,
  onSelectTopic,
  onToggleSave,
}: TopicCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border border-lightBorderV1">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <Card className="border border-lightBorderV1">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">No topics found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <div
          className="border border-lightBorderV1 hover:shadow-lg transition-shadow cursor-pointer flex flex-col relative h-56 overflow-hidden"
          onClick={() => onSelectTopic(topic._id)}
        >
          <Image src="/images/topic-card.png" alt="topic-card" fill className="w-full" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
              
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  style={{
                    backgroundColor: typeColorMap[topic.type] + "20",
                    color: typeColorMap[topic.type],
                    borderColor: typeColorMap[topic.type] + "40",
                  }}
                  className="capitalize"
                >
                  {topic.type}
                </Badge>
                {topic.department && (
                  <Badge variant="orange">{topic.department.code}</Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(topic._id, topic.metadata?.isSaved || false);
              }}
              className="ml-2"
            >
              {topic.metadata?.isSaved ? (
                <IconBookmarkFilled className="h-5 w-5 text-orange-500" />
              ) : (
                <IconBookmark className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-sm text-gray-600 line-clamp-3 mb-4">{topic.description}</p>
            {topic.startDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <IconCalendar className="h-4 w-4" />
                <span>{new Date(topic.startDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <p className="text-lg pl-2 pb-1 max-w-[80%] font-semibold text-gray-800 line-clamp-2 relative z-10">
                {topic.title}
          </p>
        </div>
      ))}
    </div>
  );
}


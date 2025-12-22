"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconBookmark, IconBookmarkFilled, IconCalendarMonthFilled } from "@tabler/icons-react";
import { ITopic, TopicType } from "@/interface/response/topic";
import Image from "next/image";

type TopicCardsProps = {
  topics: ITopic[];
  isLoading: boolean;
  onSelectTopic: (id: string) => void;
  onToggleSave: (id: string, isSaved: boolean) => void;
};

export function TopicCards({
  topics,
  isLoading,
  onSelectTopic,
  onToggleSave,
}: TopicCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border border-lightBorderV1 rounded-xl flex flex-col relative h-56 overflow-hidden bg-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
            <Skeleton className="h-9 w-9 absolute top-2 right-2 rounded-full z-10" />
            <Skeleton className="h-6 w-3/4 ml-3 mt-2 relative z-10" />
            <div className="flex items-center gap-2 relative z-10 pl-3 mt-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="w-full relative z-10 p-3 mt-auto">
              <div className="flex flex-col gap-1 bg-gray-200 rounded-md p-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
            <div className="flex items-center gap-2 absolute z-10 bottom-1.5 left-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
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
          className="border border-lightBorderV1 rounded-xl hover:shadow-lg transition-shadow cursor-pointer flex flex-col relative h-56 overflow-hidden"
          onClick={() => onSelectTopic(topic._id)}
        >
          {topic.startDate && (
            <div className="flex items-end gap-2 text-xs text-gray-800 absolute z-10 bottom-1.5 left-2">

              <Button
                variant={topic.metadata?.isSaved ? "default" : "outline"}
                size="sm"
                className="h-9 w-9"
              >
                <IconCalendarMonthFilled className="h-5 w-5 text-orange-500" />
              </Button>
              <span className="text-gray-800 text-sm font-semibold">{new Date(topic.startDate).toLocaleDateString()}</span>
            </div>
          )}
          <Image src="/images/topic-card.png" alt="topic-card" fill className="w-full" />
          <Button
            variant={topic.metadata?.isSaved ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(topic._id, topic.metadata?.isSaved || false);
            }}
            className="h-9 w-9 absolute top-2 right-2"
          >
            {topic.metadata?.isSaved ? (
              <IconBookmarkFilled className="h-5 w-5 text-orange-500" />
            ) : (
              <IconBookmark className="h-5 w-5" />
            )}
          </Button>

          <p className="text-lg pl-3 pt-2 max-w-[80%] font-semibold text-white line-clamp-1 relative z-10">
            {topic.title}
          </p>
          <div className="flex items-center gap-2 relative z-10 pl-3">
            <span className="text-sm underline text-white font-semibold">#{topic.type}</span>
            {topic.department && (
              <span className="text-sm text-white underline font-semibold">#{topic.department.code}</span>
            )}
          </div>
          <div className=" w-full  relative z-106 p-3">
            <div className="flex flex-col gap-1 bg-orange-200 rounded-md p-2">
              <p className="text-sm text-gray-900 line-clamp-3">{topic.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


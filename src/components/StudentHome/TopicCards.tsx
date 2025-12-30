"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconCalendar,
  IconAlertCircle,
  IconFlag,
  IconArrowRight,
  IconSchool,
  IconTrophy,
  IconUsers,
  IconCoin,
  IconCalendarEvent,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { ITopic } from "@/interface/response/topic";
import Image from "next/image";

type TopicCardsProps = {
  topics: ITopic[];
  isLoading: boolean;
  onSelectTopic: (id: string) => void;
  onToggleSave: (id: string, isSaved: boolean) => void;
  savedTopics: string[];
};

// Helper function to get type badge color
const getTypeBadgeColor = (type: string) => {
  const colors: Record<string, string> = {
    event: "bg-green-600",
    scholarship: "bg-orange-500",
    notification: "bg-red-600",
    job: "bg-blue-600",
    advertisement: "bg-pink-600",
    internship: "bg-purple-600",
    recruitment: "bg-indigo-600",
    volunteer: "bg-teal-600",
    extracurricular: "bg-cyan-600",
  };
  return colors[type.toLowerCase()] || "bg-gray-600";
};

// Helper function to get type icon
const getTypeIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    scholarship: <IconSchool className="w-3.5 h-3.5" />,
    contest: <IconTrophy className="w-3.5 h-3.5" />,
    workshop: <IconUsers className="w-3.5 h-3.5" />,
    grant: <IconCoin className="w-3.5 h-3.5" />,
    event: <IconCalendarEvent className="w-3.5 h-3.5" />,
    notification: <IconSpeakerphone className="w-3.5 h-3.5" />,
  };
  return icons[type.toLowerCase()] || <IconFlag className="w-3.5 h-3.5" />;
};

// Helper function to get random picsum image
const getPicsumImage = (index: number) => {
  const imageIds = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const id = imageIds[index % imageIds.length];
  return `https://picsum.photos/seed/${id}/600/400`;
};

// Helper to get hashtags from topic
const getHashtags = (topic: ITopic) => {
  const tags = [];
  if (topic.department?.code) tags.push(topic.department.code);
  return tags;
};

export function TopicCards({
  topics,
  isLoading,
  onSelectTopic,
  onToggleSave,
  savedTopics,
}: TopicCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-[28px] overflow-hidden bg-transparent shadow-md h-[300px]"
          >
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <Card className="border border-gray-200 rounded-2xl">
        <CardContent className="p-12 text-center">
          <p className="text-gray-500 text-lg">No topics found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic, index) => {
        const hashtags = getHashtags(topic);
        const hasDeadline = topic.applicationDeadline || topic.endDate;
        const deadlineDate = topic.applicationDeadline || topic.endDate;
        const isUrgent =
          deadlineDate &&
          new Date(deadlineDate) <
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const isSaved = savedTopics.includes(topic._id);

        return (
          <div
            key={topic._id}
            className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-[330px] overflow-hidden"
            onClick={() => onSelectTopic(topic._id)}
          >
            {/* Full Height Background Image */}
            <Image
              src={getPicsumImage(index)}
              alt={topic.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

            {/* Type Badge - Top Left */}
            <Badge
              className={`absolute top-4 left-4 z-10 ${getTypeBadgeColor(
                topic.type
              )} text-white font-medium text-sm capitalize px-3 py-1 rounded-full shadow-lg border-0 flex items-center gap-1.5`}
            >
              {getTypeIcon(topic.type)}
              {topic.type}
            </Badge>

            {/* Bookmark Button - Top Right */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(topic._id, isSaved);
              }}
              className={`absolute top-4 right-4 z-10 h-9 w-9 rounded-full ${
                isSaved
                  ? "bg-[#FFEDD5] text-orange-500"
                  : "bg-white/50 text-white"
              } hover:bg-white/60 shadow-md p-0`}
            >
              {isSaved ? (
                <IconBookmarkFilled className="h-6 w-6" />
              ) : (
                <IconBookmark className="h-6 w-6" />
              )}
            </Button>

            {/* Content Overlay - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 flex flex-col gap-3">
              {/* Title and Hashtags */}
              <div>
                <h3 className="text-white font-semibold text-xl line-clamp-2 my-2">
                  {topic.title}
                </h3>
                {/* Hashtags */}
                {hashtags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-white text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Box */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 space-y-1">
                <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">
                  {topic.description}
                </p>

                {/* Deadline Section */}
                {hasDeadline && (
                  <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 group-hover:border-orange-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isUrgent ? "bg-red-100" : "bg-orange-100"
                        }`}
                      >
                        {isUrgent ? (
                          <IconAlertCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <IconCalendar className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">
                          {topic.applicationDeadline ? "DEADLINE" : "END DATE"}
                        </p>
                        <p
                          className={`text-sm font-bold ${
                            isUrgent ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          {deadlineDate &&
                            new Date(deadlineDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                        </p>
                      </div>
                    </div>
                    <IconArrowRight className="h-5 w-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}

                {/* Start Date Section */}
                {topic.startDate && !hasDeadline && (
                  <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-2xl p-3 border border-gray-200 group-hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <IconFlag className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">
                          STARTS
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {new Date(topic.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <IconArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

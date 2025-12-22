"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { ITopic, TopicType } from "@/interface/response/topic";

type TopicDetailsDialogProps = {
  selectedTopicId: string | null;
  selectedTopicData?: { data: ITopic };
  onClose: () => void;
  onToggleSave: (id: string, isSaved: boolean) => void;
  typeColorMap: Record<TopicType, string>;
};

export function TopicDetailsDialog({
  selectedTopicId,
  selectedTopicData,
  onClose,
  onToggleSave,
  typeColorMap,
}: TopicDetailsDialogProps) {
  return (
    <Dialog open={!!selectedTopicId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {selectedTopicData?.data ? (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-semibold text-gray-800">
                    {selectedTopicData.data.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      style={{
                        backgroundColor: typeColorMap[selectedTopicData.data.type] + "20",
                        color: typeColorMap[selectedTopicData.data.type],
                        borderColor: typeColorMap[selectedTopicData.data.type] + "40",
                      }}
                      className="capitalize"
                    >
                      {selectedTopicData.data.type}
                    </Badge>
                    {selectedTopicData.data.department && (
                      <Badge variant="orange">{selectedTopicData.data.department.name}</Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleSave(selectedTopicData.data._id, selectedTopicData.data.metadata?.isSaved || false)}
                >
                  {selectedTopicData.data.metadata?.isSaved ? (
                    <IconBookmarkFilled className="h-5 w-5 text-orange-500" />
                  ) : (
                    <IconBookmark className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{selectedTopicData.data.description}</p>
              </div>
              {selectedTopicData.data.startDate && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Start Date</h4>
                  <p className="text-gray-600">{new Date(selectedTopicData.data.startDate).toLocaleString()}</p>
                </div>
              )}
              {selectedTopicData.data.endDate && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">End Date</h4>
                  <p className="text-gray-600">{new Date(selectedTopicData.data.endDate).toLocaleString()}</p>
                </div>
              )}
              {selectedTopicData.data.location && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
                  <p className="text-gray-600">{selectedTopicData.data.location}</p>
                </div>
              )}
              {selectedTopicData.data.organizer && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Organizer</h4>
                  <p className="text-gray-600">{selectedTopicData.data.organizer}</p>
                </div>
              )}
              {selectedTopicData.data.applicationDeadline && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Application Deadline</h4>
                  <p className="text-gray-600">{new Date(selectedTopicData.data.applicationDeadline).toLocaleString()}</p>
                </div>
              )}
              {selectedTopicData.data.company && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Company</h4>
                  <p className="text-gray-600">{selectedTopicData.data.company}</p>
                </div>
              )}
              {selectedTopicData.data.position && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Position</h4>
                  <p className="text-gray-600">{selectedTopicData.data.position}</p>
                </div>
              )}
              {selectedTopicData.data.salary && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Salary</h4>
                  <p className="text-gray-600">{selectedTopicData.data.salary}</p>
                </div>
              )}
              {selectedTopicData.data.contactInfo && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                  <p className="text-gray-600">{selectedTopicData.data.contactInfo}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


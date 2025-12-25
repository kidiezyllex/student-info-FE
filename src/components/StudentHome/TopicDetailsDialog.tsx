"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const renderTableRow = (label: string, value: React.ReactNode) => (
    <TableRow className="transition-colors">
      <TableCell className="font-semibold text-gray-800 w-1/3">{label}</TableCell>
      <TableCell className="text-gray-800">{value}</TableCell>
    </TableRow>
  );

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
              </div>
            </DialogHeader>

            <div className="w-full overflow-auto mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F56C1420]">
                    <TableHead className="font-semibold text-gray-800 w-1/3">Field</TableHead>
                    <TableHead className="font-semibold text-gray-800">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableRow("Description", <p className="text-gray-600">{selectedTopicData.data.description}</p>)}

                  {selectedTopicData.data.startDate &&
                    renderTableRow("Start Date", new Date(selectedTopicData.data.startDate).toLocaleString())}

                  {selectedTopicData.data.endDate &&
                    renderTableRow("End Date", new Date(selectedTopicData.data.endDate).toLocaleString())}

                  {selectedTopicData.data.location &&
                    renderTableRow("Location", selectedTopicData.data.location)}

                  {selectedTopicData.data.organizer &&
                    renderTableRow("Organizer", selectedTopicData.data.organizer)}

                  {selectedTopicData.data.applicationDeadline &&
                    renderTableRow("Application Deadline", new Date(selectedTopicData.data.applicationDeadline).toLocaleString())}

                  {selectedTopicData.data.company &&
                    renderTableRow("Company", selectedTopicData.data.company)}

                  {selectedTopicData.data.position &&
                    renderTableRow("Position", selectedTopicData.data.position)}

                  {selectedTopicData.data.salary &&
                    renderTableRow("Salary", selectedTopicData.data.salary)}

                  {selectedTopicData.data.contactInfo &&
                    renderTableRow("Contact Information", selectedTopicData.data.contactInfo)}
                </TableBody>
              </Table>
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


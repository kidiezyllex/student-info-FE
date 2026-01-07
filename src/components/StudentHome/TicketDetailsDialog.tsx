"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ISupportTicket } from "@/interface/response/support-ticket";
import { useGetSupportTicketById } from "@/hooks/useSupportTicket";
import {
  IconMessageChatbot,
  IconUser,
  IconCheckbox,
  IconClock,
  IconBuilding,
} from "@tabler/icons-react";

type TicketDetailsDialogProps = {
  ticketId: string | null;
  onClose: () => void;
  statusConfig: any;
  priorityConfig: any;
  categoryConfig: any;
};

export function TicketDetailsDialog({
  ticketId,
  onClose,
  statusConfig,
  priorityConfig,
  categoryConfig,
}: TicketDetailsDialogProps) {
  const { data: ticketData, isLoading } = useGetSupportTicketById(
    ticketId || ""
  );
  const ticket = ticketData?.data;

  const renderTableRow = (label: string, value: React.ReactNode) => (
    <TableRow className="transition-colors">
      <TableCell className="font-semibold text-gray-800 w-1/3">
        {label}
      </TableCell>
      <TableCell className="text-gray-800">{value}</TableCell>
    </TableRow>
  );

  return (
    <Dialog open={!!ticketId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : ticket ? (
          <>
            <DialogHeader>
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-2xl font-semibold text-gray-800">
                  {ticket.subject}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    style={{
                      backgroundColor: statusConfig[ticket.status].color + "20",
                      color: statusConfig[ticket.status].color,
                      borderColor: statusConfig[ticket.status].color + "40",
                    }}
                    className="capitalize"
                  >
                    {statusConfig[ticket.status].label}
                  </Badge>
                  <Badge
                    style={{
                      backgroundColor:
                        priorityConfig[ticket.priority].color + "20",
                      color: priorityConfig[ticket.priority].color,
                    }}
                    className="capitalize"
                  >
                    {priorityConfig[ticket.priority].label} Priority
                  </Badge>
                  <Badge variant="orange">
                    {categoryConfig[ticket.category].label}
                  </Badge>
                </div>
              </div>
            </DialogHeader>
            <div className="w-full overflow-auto space-y-6">
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-[#F56C1420]">
                    <TableHead className="font-semibold text-gray-800 w-1/3">
                      Field
                    </TableHead>
                    <TableHead className="font-semibold text-gray-800">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableRow(
                    "Department",
                    <div className="flex items-center gap-2">
                      <IconBuilding className="w-4 h-4 text-orange-500" />
                      <span>
                        {ticket.department.name} ({ticket.department.code})
                      </span>
                    </div>
                  )}
                  {renderTableRow(
                    "Created At",
                    <div className="flex items-center gap-2">
                      <IconClock className="w-4 h-4 text-gray-400" />
                      {new Date(ticket.createdAt).toLocaleString()}
                    </div>
                  )}
                  {ticket.assignedTo &&
                    renderTableRow(
                      "Assigned To",
                      <div className="flex items-center gap-2">
                        <IconUser className="w-4 h-4 text-blue-500" />
                        <span>{ticket.assignedTo.name}</span>
                      </div>
                    )}
                  {renderTableRow(
                    "Description",
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  )}
                  {ticket.contactInfo?.email &&
                    renderTableRow("Email Contact", ticket.contactInfo.email)}
                  {ticket.contactInfo?.phoneNumber &&
                    renderTableRow(
                      "Phone Contact",
                      ticket.contactInfo.phoneNumber
                    )}
                </TableBody>
              </Table>

              {/* AI Conversation Section */}
              {ticket.aiConversation && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 px-1">
                    <IconMessageChatbot className="w-4 h-4 text-blue-600" />
                    AI Pre-Screening
                  </h4>
                  <div className="grid gap-2">
                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-sm">
                      <p className="font-bold text-blue-900 mb-1">
                        Your Query:
                      </p>
                      <p className="text-blue-800 italic">
                        "{ticket.aiConversation.userQuery}"
                      </p>
                    </div>
                    <div className="p-3 bg-green-50/50 rounded-lg border border-green-100 text-sm">
                      <p className="font-bold text-green-900 mb-1">
                        AI Response:
                      </p>
                      <p className="text-green-800">
                        {ticket.aiConversation.aiResponse}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolution Section if solved */}
              {ticket.resolution && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
                  <h4 className="text-sm font-bold text-green-900 flex items-center gap-2">
                    <IconCheckbox className="w-4 h-4 text-green-600" />
                    Resolution
                  </h4>
                  <div className="text-sm text-green-800">
                    <p className="mb-2">
                      Resolved by{" "}
                      <strong>{ticket.resolution.resolvedBy.name}</strong> on{" "}
                      {new Date(ticket.resolution.resolvedAt).toLocaleString()}
                    </p>
                    <div className="p-3 bg-white/80 rounded border border-green-100 text-gray-700">
                      {ticket.resolution.resolutionNote}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Ticket not found or error loading data.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

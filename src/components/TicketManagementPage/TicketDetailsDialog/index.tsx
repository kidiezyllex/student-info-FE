"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ISupportTicket } from "@/interface/response/support-ticket";
import { useGetSupportTicketById } from "@/hooks/useSupportTicket";
import {
  IconMessageChatbot,
  IconUser,
  IconCheckbox,
  IconClock,
  IconBuilding,
  IconNotes,
} from "@tabler/icons-react";

type TicketDetailsDialogProps = {
  open: boolean;
  ticketId: string | null;
  onClose: () => void;
  statusConfig: any;
  priorityConfig: any;
  categoryConfig: any;
  isCoordinator?: boolean;
  onStatusChange?: (ticketId: string, status: string) => void;
  onAddNote?: (ticket: ISupportTicket) => void;
};

export function TicketDetailsDialog({
  open,
  ticketId,
  onClose,
  statusConfig,
  priorityConfig,
  categoryConfig,
  isCoordinator = false,
  onStatusChange,
  onAddNote,
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
    <Dialog open={open} onOpenChange={onClose}>
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
                  <Badge variant={statusConfig[ticket.status].variant}>
                    {statusConfig[ticket.status].label}
                  </Badge>
                  <Badge variant={priorityConfig[ticket.priority].variant}>
                    {priorityConfig[ticket.priority].label} Priority
                  </Badge>
                  <Badge variant={categoryConfig[ticket.category].variant}>
                    {categoryConfig[ticket.category].label}
                  </Badge>
                </div>
              </div>
            </DialogHeader>
            <div className="w-full overflow-auto space-y-6 mt-4">
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
                  {isCoordinator && (
                    <TableRow>
                      <TableCell className="font-semibold text-gray-800">
                        Student
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {ticket.student.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ticket.student.email}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {isCoordinator && (
                    <TableRow>
                      <TableCell className="font-semibold text-gray-800">
                        Update Status
                      </TableCell>
                      <TableCell>
                        <Select
                          value={ticket.status}
                          onValueChange={(value) =>
                            onStatusChange?.(ticket._id, value)
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )}
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

              {/* Admin Notes Section */}
              {ticket.adminNotes && ticket.adminNotes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 px-1">
                    <IconNotes className="w-4 h-4 text-orange-600" />
                    Admin Notes
                  </h4>
                  <div className="space-y-2">
                    {ticket.adminNotes.map((note, index) => (
                      <div
                        key={index}
                        className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 text-sm"
                      >
                        <p className="text-gray-800">{note.note}</p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                        &quot;{ticket.aiConversation.userQuery}&quot;
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
            <DialogFooter className="mt-6">
              {isCoordinator && (
                <Button variant="outline" onClick={() => onAddNote?.(ticket)}>
                  <IconNotes className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              )}
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
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

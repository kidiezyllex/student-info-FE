"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  useGetSupportTickets,
  useUpdateTicketStatus,
  useAddTicketNote,
  useResolveTicket,
  useGetTicketStats,
} from "@/hooks/useSupportTicket";
import { IconEye, IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { ISupportTicket } from "@/interface/response/support-ticket";
import { TicketDetailsDialog } from "./TicketDetailsDialog";

const statusConfig = {
  open: { label: "Open", variant: "blue" as const },
  in_progress: { label: "In Progress", variant: "amber" as const },
  resolved: { label: "Resolved", variant: "green" as const },
  closed: { label: "Closed", variant: "gray" as const },
};

const priorityConfig = {
  low: { label: "Low", variant: "green" as const },
  medium: { label: "Medium", variant: "amber" as const },
  high: { label: "High", variant: "orange" as const },
  urgent: { label: "Urgent", variant: "red" as const },
};

const categoryConfig = {
  academic: { label: "Academic", variant: "blue" as const },
  technical: { label: "Technical", variant: "violet" as const },
  administrative: { label: "Administrative", variant: "amber" as const },
  other: { label: "Other", variant: "slate" as const },
};

export default function TicketManagementPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(
    null
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteText, setNoteText] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  const { data: ticketsData, isLoading } = useGetSupportTickets({
    status:
      statusFilter !== "all"
        ? (statusFilter as "open" | "in_progress" | "resolved" | "closed")
        : undefined,
    priority:
      priorityFilter !== "all"
        ? (priorityFilter as "low" | "medium" | "high" | "urgent")
        : undefined,
  });

  const { data: statsData } = useGetTicketStats();
  const { mutateAsync: updateStatus } = useUpdateTicketStatus();
  const { mutateAsync: addNote } = useAddTicketNote();
  const { mutateAsync: resolveTicket } = useResolveTicket();

  const tickets = Array.isArray(ticketsData?.data)
    ? ticketsData.data
    : ticketsData?.data?.docs || [];

  const filteredTickets = tickets.filter((ticket: ISupportTicket) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleViewDetails = (ticket: ISupportTicket) => {
    setSelectedTicket(ticket);
    setShowDetailsDialog(true);
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await updateStatus({
        id: ticketId,
        data: {
          status: newStatus as "open" | "in_progress" | "resolved" | "closed",
        },
      });
      toast.success("Ticket status updated successfully!");
    } catch (error) {
      toast.error("Failed to update ticket status");
    }
  };

  const handleAddNote = async () => {
    if (!selectedTicket || !noteText.trim()) return;

    try {
      await addNote({ id: selectedTicket._id, data: { note: noteText } });
      toast.success("Note added successfully!");
      setNoteText("");
      setShowNoteDialog(false);
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleResolveTicket = async () => {
    if (!selectedTicket || !resolutionNote.trim()) return;

    try {
      await resolveTicket({
        id: selectedTicket._id,
        data: { resolutionNote },
      });
      toast.success("Ticket resolved successfully!");
      setResolutionNote("");
      setShowResolveDialog(false);
      setShowDetailsDialog(false);
    } catch (error) {
      toast.error("Failed to resolve ticket");
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/coordinator">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Support Ticket Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Search ticket subject, description or student..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-10 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-gray-800"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-red-500 transition-colors"
                  type="button"
                >
                  <IconX className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] focus:border-mainTextHoverV1">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px] focus:border-mainTextHoverV1">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tickets Table */}
          <Card className="p-0 overflow-hidden border border-lightBorderV1">
            <CardContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : filteredTickets.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  No tickets found
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-800">
                        Subject
                      </TableHead>
                      <TableHead className="font-semibold text-gray-800">
                        Student
                      </TableHead>
                      <TableHead className="font-semibold text-gray-800">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-800">
                        Priority
                      </TableHead>
                      <TableHead className="font-semibold text-gray-800">
                        Category
                      </TableHead>
                      <TableHead className="font-semibold text-gray-800">
                        Created
                      </TableHead>
                      <TableHead className="font-semibold text-gray-800">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket._id}>
                        <TableCell className="font-medium">
                          {ticket.subject}
                        </TableCell>
                        <TableCell>{ticket.student.name}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[ticket.status].variant}>
                            {statusConfig[ticket.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={priorityConfig[ticket.priority].variant}
                          >
                            {priorityConfig[ticket.priority].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={categoryConfig[ticket.category].variant}
                          >
                            {categoryConfig[ticket.category].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleViewDetails(ticket)}
                            >
                              <IconEye className="w-4 h-4" />
                            </Button>
                            {ticket.status !== "resolved" && (
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setShowResolveDialog(true);
                                }}
                              >
                                <IconCheck className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Details Dialog */}
      <TicketDetailsDialog
        open={showDetailsDialog}
        ticketId={selectedTicket?._id || null}
        onClose={() => setShowDetailsDialog(false)}
        statusConfig={statusConfig}
        priorityConfig={priorityConfig}
        categoryConfig={categoryConfig}
        isCoordinator={true}
        onStatusChange={handleStatusChange}
        onAddNote={(ticket) => {
          setSelectedTicket(ticket);
          setShowNoteDialog(true);
        }}
      />

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Admin Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Note</Label>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note here..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
            <DialogDescription>
              Provide a resolution note for this ticket
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Resolution Note *</Label>
              <Textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Describe how the issue was resolved..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResolveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResolveTicket}
              disabled={!resolutionNote.trim()}
            >
              Resolve Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

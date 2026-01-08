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
import DashboardHeader from "../Common/DashboardHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  useGetSupportTickets,
  useUpdateTicketStatus,
  useAddTicketNote,
  useResolveTicket,
  useGetTicketStats,
} from "@/hooks/useSupportTicket";
import {
  IconTicket,
  IconEye,
  IconCheck,
  IconNotes,
  IconFilter,
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import { ISupportTicket } from "@/interface/response/support-ticket";

const statusConfig = {
  open: { label: "Open", color: "#3B82F6" },
  in_progress: { label: "In Progress", color: "#F59E0B" },
  resolved: { label: "Resolved", color: "#10B981" },
  closed: { label: "Closed", color: "#6B7280" },
};

const priorityConfig = {
  low: { label: "Low", color: "#10B981" },
  medium: { label: "Medium", color: "#F59E0B" },
  high: { label: "High", color: "#EF4444" },
  urgent: { label: "Urgent", color: "#DC2626" },
};

const categoryConfig = {
  academic: { label: "Academic", color: "#3B82F6" },
  technical: { label: "Technical", color: "#8B5CF6" },
  administrative: { label: "Administrative", color: "#F59E0B" },
  other: { label: "Other", color: "#6B7280" },
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

  const stats = [
    {
      title: "Total Tickets",
      value: statsData?.data?.total || 0,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Open",
      value:
        statsData?.data?.byStatus?.find((s) => s._id === "open")?.count || 0,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "In Progress",
      value:
        statsData?.data?.byStatus?.find((s) => s._id === "in_progress")
          ?.count || 0,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Resolved",
      value:
        statsData?.data?.byStatus?.find((s) => s._id === "resolved")?.count ||
        0,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/coordinator">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Support Tickets</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DashboardHeader
        title="Support Ticket Management"
        description="Manage and resolve student support requests"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-lightBorderV1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <IconTicket className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-lightBorderV1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconFilter className="w-5 h-5" />
            <CardTitle>Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
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
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="border-lightBorderV1">
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : tickets.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No tickets found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-medium">
                      {ticket.subject}
                    </TableCell>
                    <TableCell>{ticket.student.name}</TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor:
                            statusConfig[ticket.status].color + "20",
                          color: statusConfig[ticket.status].color,
                        }}
                      >
                        {statusConfig[ticket.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor:
                            priorityConfig[ticket.priority].color + "20",
                          color: priorityConfig[ticket.priority].color,
                        }}
                      >
                        {priorityConfig[ticket.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categoryConfig[ticket.category].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(ticket)}
                        >
                          <IconEye className="w-4 h-4" />
                        </Button>
                        {ticket.status !== "resolved" && (
                          <Button
                            size="sm"
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

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.subject}</DialogTitle>
            <DialogDescription>
              Ticket ID: {selectedTicket?._id}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student</Label>
                  <p className="text-sm">{selectedTicket.student.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedTicket.student.email}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value) =>
                      handleStatusChange(selectedTicket._id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge
                    style={{
                      backgroundColor:
                        priorityConfig[selectedTicket.priority].color + "20",
                      color: priorityConfig[selectedTicket.priority].color,
                    }}
                  >
                    {priorityConfig[selectedTicket.priority].label}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              {selectedTicket.aiConversation && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label>AI Conversation</Label>
                  <div className="mt-2 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-600">
                        User Query:
                      </p>
                      <p className="text-sm">
                        {selectedTicket.aiConversation.userQuery}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">
                        AI Response:
                      </p>
                      <p className="text-sm">
                        {selectedTicket.aiConversation.aiResponse}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTicket.adminNotes &&
                selectedTicket.adminNotes.length > 0 && (
                  <div>
                    <Label>Admin Notes</Label>
                    <div className="mt-2 space-y-2">
                      {selectedTicket.adminNotes.map((note, index) => (
                        <div key={index} className="bg-blue-50 p-3 rounded">
                          <p className="text-sm">{note.note}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedTicket.resolution && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <Label>Resolution</Label>
                  <p className="text-sm mt-2">
                    {selectedTicket.resolution.resolutionNote}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Resolved by {selectedTicket.resolution.resolvedBy.name} on{" "}
                    {new Date(
                      selectedTicket.resolution.resolvedAt
                    ).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTicket(selectedTicket);
                setShowNoteDialog(true);
              }}
            >
              <IconNotes className="w-4 h-4 mr-2" />
              Add Note
            </Button>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
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
        <DialogContent>
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

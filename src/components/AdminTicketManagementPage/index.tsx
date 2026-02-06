"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import { DeleteDialog } from "@/components/ui/delete-dialog";
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
  useDeleteTicket,
} from "@/hooks/useSupportTicket";
import {
  IconEye,
  IconCheck,
  IconSearch,
  IconX,
  IconTrash,
  IconRobot,
  IconTrendingUp,
  IconClock,
  IconAlertCircle,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { ISupportTicket } from "@/interface/response/support-ticket";
import { TicketDetailsDialog } from "@/components/TicketManagementPage/TicketDetailsDialog";

const statusConfig = {
  open: { label: "Open", variant: "blue" as const, color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "In Progress", variant: "amber" as const, color: "bg-amber-100 text-amber-800" },
  resolved: { label: "Resolved", variant: "green" as const, color: "bg-green-100 text-green-800" },
  closed: { label: "Closed", variant: "gray" as const, color: "bg-gray-100 text-gray-800" },
};

const priorityConfig = {
  low: { label: "Low", variant: "green" as const, color: "bg-green-100 text-green-800" },
  medium: { label: "Medium", variant: "amber" as const, color: "bg-amber-100 text-amber-800" },
  high: { label: "High", variant: "orange" as const, color: "bg-orange-100 text-orange-800" },
  urgent: { label: "Urgent", variant: "red" as const, color: "bg-red-100 text-red-800" },
};

const categoryConfig = {
  academic: { label: "Academic", variant: "blue" as const },
  technical: { label: "Technical", variant: "violet" as const },
  administrative: { label: "Administrative", variant: "amber" as const },
  other: { label: "Other", variant: "slate" as const },
};

export default function AdminTicketManagementPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
    category:
      categoryFilter !== "all"
        ? (categoryFilter as "academic" | "technical" | "administrative" | "other")
        : undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useGetTicketStats();
  const { mutateAsync: updateStatus } = useUpdateTicketStatus();
  const { mutateAsync: addNote } = useAddTicketNote();
  const { mutateAsync: resolveTicket } = useResolveTicket();
  const { mutateAsync: deleteTicket, isPending: isDeleting } = useDeleteTicket();

  const tickets = Array.isArray(ticketsData?.data)
    ? ticketsData.data
    : ticketsData?.data?.docs || [];

  const filteredTickets = tickets.filter((ticket: ISupportTicket) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.department.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = statsData?.data;

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

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;
    await deleteTicket(selectedTicket._id);
    setShowDeleteDialog(false);
    setSelectedTicket(null);
  };

  const getStatusCount = (status: string) => {
    if (!stats?.byStatus) return 0;
    const statusItem = stats.byStatus.find((s: any) => s._id === status);
    return statusItem?.count || 0;
  };

  const getPriorityCount = (priority: string) => {
    if (!stats?.byPriority) return 0;
    const priorityItem = stats.byPriority.find((p: any) => p._id === priority);
    return priorityItem?.count || 0;
  };

  return (
    <div className="space-y-6 bg-mainBackgroundV1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Ticket Management</h1>
          <p className="text-gray-600 mt-1">Command Center - Manage all support tickets across departments</p>
        </div>
      </div>

      {/* Stats Dashboard - Freshdesk Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.total || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <IconAlertCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : getStatusCount("open")}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <IconClock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : getStatusCount("resolved")}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <IconCircleCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent Priority</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : getPriorityCount("urgent")}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <IconTrendingUp className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights Section */}
      {stats && stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <IconRobot className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Resolution Rate</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.total > 0
                          ? Math.round((getStatusCount("resolved") / stats.total) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {getStatusCount("in_progress")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Response Time</p>
                      <p className="text-2xl font-bold text-green-600">&lt; 2 mins</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border border-lightBorderV1">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Input
                  placeholder="Search tickets by subject, description, student, or department..."
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

              <div className="flex items-center gap-3 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] focus:border-mainTextHoverV1">
                    <SelectValue placeholder="Status" />
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
                  <SelectTrigger className="w-[160px] focus:border-mainTextHoverV1">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px] focus:border-mainTextHoverV1">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tickets Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-0 overflow-hidden border border-lightBorderV1">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-xl font-semibold text-gray-900">
              All Tickets ({filteredTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="p-8">
                <LoadingSpinner />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <IconAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No tickets found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your filters"
                    : "No tickets have been created yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-800">Subject</TableHead>
                      <TableHead className="font-semibold text-gray-800">Student</TableHead>
                      <TableHead className="font-semibold text-gray-800">Department</TableHead>
                      <TableHead className="font-semibold text-gray-800">Status</TableHead>
                      <TableHead className="font-semibold text-gray-800">Priority</TableHead>
                      <TableHead className="font-semibold text-gray-800">Category</TableHead>
                      <TableHead className="font-semibold text-gray-800">Created</TableHead>
                      <TableHead className="font-semibold text-gray-800 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket._id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleViewDetails(ticket)}
                      >
                        <TableCell className="font-medium max-w-xs truncate">
                          {ticket.subject}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{ticket.student.name}</span>
                            <span className="text-xs text-gray-500">{ticket.student.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {ticket.department.code}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={statusConfig[ticket.status].color}
                            variant={statusConfig[ticket.status].variant}
                          >
                            {statusConfig[ticket.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={priorityConfig[ticket.priority].color}
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
                        <TableCell className="text-sm text-gray-600">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleViewDetails(ticket)}
                              className="h-8 w-8"
                            >
                              <IconEye className="w-4 h-4" />
                            </Button>
                            {ticket.status !== "resolved" && ticket.status !== "closed" && (
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setShowResolveDialog(true);
                                }}
                                className="h-8 w-8"
                              >
                                <IconCheck className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setShowDeleteDialog(true);
                              }}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <IconTrash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
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
            <DialogTitle>Add Internal Note</DialogTitle>
            <DialogDescription>
              Add a note that will be visible to other admins and coordinators
            </DialogDescription>
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
              Provide a resolution note for this ticket. This will mark the ticket as resolved.
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

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteTicket}
        title="Delete Ticket"
        description={`Are you sure you want to delete the ticket "${selectedTicket?.subject}"?`}
        confirmText="Delete Ticket"
        successMessage="Ticket deleted successfully!"
        errorMessage="Failed to delete ticket."
        warningMessage="This action cannot be undone. This will permanently delete the ticket and all associated data."
      />
    </div>
  );
}

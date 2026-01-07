"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useGetSupportTicketById } from "@/hooks/useSupportTicket";
import {
  IconArrowLeft,
  IconTicket,
  IconClock,
  IconUser,
  IconBuilding,
  IconAlertCircle,
  IconCircleCheck,
  IconProgressCheck,
  IconX,
  IconNotes,
  IconCheckbox,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const statusConfig = {
  open: {
    label: "Open",
    color: "#3B82F6",
    icon: IconAlertCircle,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  in_progress: {
    label: "In Progress",
    color: "#F59E0B",
    icon: IconProgressCheck,
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
  },
  resolved: {
    label: "Resolved",
    color: "#10B981",
    icon: IconCircleCheck,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  closed: {
    label: "Closed",
    color: "#6B7280",
    icon: IconX,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
};

const priorityConfig = {
  low: { label: "Low", color: "#10B981" },
  medium: { label: "Medium", color: "#F59E0B" },
  high: { label: "High", color: "#EF4444" },
  urgent: { label: "Urgent", color: "#DC2626" },
};

const categoryConfig = {
  academic: { label: "Academic", icon: "📚" },
  technical: { label: "Technical", icon: "💻" },
  administrative: { label: "Administrative", icon: "📋" },
  other: { label: "Other", icon: "📌" },
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params?.id as string;

  const { data, isLoading, error } = useGetSupportTicketById(ticketId);
  const ticket = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 text-center border border-red-200 rounded-xl">
          <IconAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Error Loading Ticket
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message || "Ticket not found"}
          </p>
          <button
            onClick={() => router.push("/student/tickets")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            Back to Tickets
          </button>
        </Card>
      </div>
    );
  }

  const status = statusConfig[ticket.status];
  const StatusIcon = status.icon;
  const priority = priorityConfig[ticket.priority];
  const category = categoryConfig[ticket.category];

  return (
    <div className="flex-1 space-y-4 bg-mainBackgroundV1 p-4 rounded-lg border border-lightBorderV1">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/student">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/student/tickets">
                My Tickets
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ticket Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Card className="p-6 border border-orange-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${status.color}20` }}
            >
              <StatusIcon className="w-8 h-8" style={{ color: status.color }} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {ticket.subject}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {/* Status */}
                <div
                  className={`px-3 py-1 rounded-full ${status.bgColor} ${status.textColor} font-medium text-sm`}
                >
                  {status.label}
                </div>

                {/* Priority */}
                <div
                  className="px-3 py-1 rounded-full font-medium text-sm"
                  style={{
                    backgroundColor: `${priority.color}20`,
                    color: priority.color,
                  }}
                >
                  {priority.label}
                </div>

                {/* Category */}
                <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium text-sm">
                  {category.icon} {category.label}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 border border-orange-200 rounded-xl">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <IconNotes className="w-5 h-5 text-orange-600" />
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </Card>
          </motion.div>

          {/* AI Conversation */}
          {ticket.aiConversation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 border border-orange-200 rounded-xl">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  AI Conversation
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Your Query:
                    </p>
                    <p className="text-gray-700">
                      {ticket.aiConversation.userQuery}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-green-900 mb-2">
                      AI Response:
                    </p>
                    <p className="text-gray-700">
                      {ticket.aiConversation.aiResponse}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Admin Notes */}
          {ticket.adminNotes && ticket.adminNotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6 border border-orange-200 rounded-xl">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <IconNotes className="w-5 h-5 text-orange-600" />
                  Admin Notes
                </h2>
                <div className="space-y-4">
                  {ticket.adminNotes.map((note, index) => (
                    <div
                      key={index}
                      className="bg-amber-50 p-4 rounded-lg border border-amber-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <IconUser className="w-4 h-4 text-amber-700" />
                        <span className="text-sm font-semibold text-amber-900">
                          {note.admin.name}
                        </span>
                        <span className="text-xs text-amber-600">
                          {new Date(note.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.note}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Resolution */}
          {ticket.resolution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6 border border-green-200 rounded-xl bg-green-50">
                <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                  <IconCheckbox className="w-5 h-5 text-green-600" />
                  Resolution
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <IconUser className="w-4 h-4" />
                    <span>
                      Resolved by{" "}
                      <strong>{ticket.resolution.resolvedBy.name}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <IconClock className="w-4 h-4" />
                    <span>
                      {new Date(
                        ticket.resolution.resolvedAt
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                    <p className="text-gray-700">
                      {ticket.resolution.resolutionNote}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 border border-orange-200 rounded-xl">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Ticket Information
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <IconBuilding className="w-4 h-4" />
                    <span className="font-medium">Department</span>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    {ticket.department.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {ticket.department.code}
                  </p>
                </div>

                {ticket.assignedTo && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <IconUser className="w-4 h-4" />
                      <span className="font-medium">Assigned To</span>
                    </div>
                    <p className="text-gray-800 font-semibold">
                      {ticket.assignedTo.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.assignedTo.email}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <IconClock className="w-4 h-4" />
                    <span className="font-medium">Created</span>
                  </div>
                  <p className="text-gray-800">
                    {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <IconClock className="w-4 h-4" />
                    <span className="font-medium">Last Updated</span>
                  </div>
                  <p className="text-gray-800">
                    {new Date(ticket.updatedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {ticket.closedAt && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <IconClock className="w-4 h-4" />
                      <span className="font-medium">Closed</span>
                    </div>
                    <p className="text-gray-800">
                      {new Date(ticket.closedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Contact Info */}
          {ticket.contactInfo && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 border border-orange-200 rounded-xl">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  {ticket.contactInfo.email && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="text-gray-800">
                        {ticket.contactInfo.email}
                      </p>
                    </div>
                  )}
                  {ticket.contactInfo.phoneNumber && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <p className="text-gray-800">
                        {ticket.contactInfo.phoneNumber}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

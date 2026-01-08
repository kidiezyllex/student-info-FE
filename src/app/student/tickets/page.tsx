"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useGetSupportTickets } from "@/hooks/useSupportTicket";
import { ISupportTicket } from "@/interface/response/support-ticket";
import {
  IconTicket,
  IconClock,
  IconAlertCircle,
  IconCircleCheck,
  IconProgressCheck,
  IconX,
  IconChevronRight,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
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
    variant: "blue" as const,
    color: "#3B82F6",
    icon: IconAlertCircle,
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  in_progress: {
    label: "In Progress",
    variant: "amber" as const,
    color: "#F59E0B",
    icon: IconProgressCheck,
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
  },
  resolved: {
    label: "Resolved",
    variant: "green" as const,
    color: "#10B981",
    icon: IconCircleCheck,
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  closed: {
    label: "Closed",
    variant: "gray" as const,
    color: "#6B7280",
    icon: IconX,
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
};

const priorityConfig = {
  low: { label: "Low", variant: "green" as const, color: "#10B981" },
  medium: { label: "Medium", variant: "amber" as const, color: "#F59E0B" },
  high: { label: "High", variant: "orange" as const, color: "#EF4444" },
  urgent: { label: "Urgent", variant: "red" as const, color: "#DC2626" },
};

const categoryConfig = {
  academic: { label: "Academic", variant: "blue" as const, icon: "📚" },
  technical: { label: "Technical", variant: "violet" as const, icon: "💻" },
  administrative: {
    label: "Administrative",
    variant: "amber" as const,
    icon: "📋",
  },
  other: { label: "Other", variant: "slate" as const, icon: "📌" },
};

import { TicketDetailsDialog } from "@/components/TicketManagementPage/TicketDetailsDialog";

const TicketCard = ({
  ticket,
  onClick,
}: {
  ticket: ISupportTicket;
  onClick: (id: string) => void;
}) => {
  const status = statusConfig[ticket.status];
  const StatusIcon = status.icon;
  const priority = priorityConfig[ticket.priority];
  const category = categoryConfig[ticket.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
      onClick={() => onClick(ticket._id)}
    >
      <Card className="group border-2 border-orange-200 hover:border-orange-400 relative overflow-hidden p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 bg-white hover:shadow-lg cursor-pointer h-full flex flex-col">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-5 -mr-16 -mt-16" />

        <div className="flex items-start justify-between gap-4 flex-1">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-50 border-orange-400 border">
                <StatusIcon className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {ticket.subject}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {ticket.description}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {/* Status */}
              <div
                className={`px-3 py-1 rounded-full ${status.bgColor} ${status.textColor} font-medium`}
              >
                {status.label}
              </div>

              {/* Priority */}
              <div
                className="px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: `${priority.color}20`,
                  color: priority.color,
                }}
              >
                {priority.label}
              </div>

              {/* Category */}
              <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                {category.icon} {category.label}
              </div>

              {/* Department */}
              <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                {ticket.department.name}
              </div>
            </div>
          </div>

          {/* Arrow icon */}
          <div className="flex-shrink-0">
            <IconChevronRight className="w-6 h-6 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Footer - Pushed to bottom */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-300">
          <div className="flex items-center gap-1">
            <IconClock className="w-4 h-4" />
            <span>
              {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">•</span>
              <span>Assigned to {ticket.assignedTo.name}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default function TicketsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data, isLoading, error } = useGetSupportTickets({
    status: statusFilter as any,
  });

  // Handle both array and paginated response formats
  const tickets = Array.isArray(data?.data)
    ? data.data
    : data?.data?.docs || [];
  const totalTickets = Array.isArray(data?.data)
    ? data.data.length
    : data?.data?.totalDocs || 0;

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
              <BreadcrumbPage>My Tickets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card className="p-4 border border-orange-200 rounded-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">
              Filter by status:
            </span>
            <button
              onClick={() => setStatusFilter(undefined)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === undefined
                  ? "bg-orange-600 text-white border-2 border-transparent"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
              }`}
            >
              All ({totalTickets})
            </button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === key
                    ? `${config.bgColor} ${config.textColor} border-2 border-transparent`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                }`}
                style={
                  statusFilter === key
                    ? { borderColor: config.color }
                    : undefined
                }
              >
                {config.label}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <Card className="p-8 text-center border border-red-200 rounded-xl">
          <IconAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Error Loading Tickets
          </h3>
          <p className="text-gray-600">{error.message}</p>
        </Card>
      ) : tickets.length === 0 ? (
        <Card className="p-12 text-center border border-orange-200 rounded-xl">
          <IconTicket className="w-16 h-16 text-orange-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Tickets Found
          </h3>
          <p className="text-gray-600 mb-6">
            {statusFilter
              ? `You don't have any ${statusConfig[
                  statusFilter as keyof typeof statusConfig
                ].label.toLowerCase()} tickets.`
              : "You haven't created any support tickets yet."}
          </p>
          <Link
            href="/student/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Create New Ticket
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket: ISupportTicket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onClick={(id) => setSelectedTicketId(id)}
            />
          ))}
        </div>
      )}

      {/* Ticket Details Dialog */}
      <TicketDetailsDialog
        open={!!selectedTicketId}
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        statusConfig={statusConfig}
        priorityConfig={priorityConfig}
        categoryConfig={categoryConfig}
      />
    </div>
  );
}

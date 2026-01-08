"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITopic } from "@/interface/response/topic";
import { formatDate } from "@/utils/dateFormat";

interface TopicTableProps {
  topic: ITopic;
}

export const TopicTable = ({ topic }: TopicTableProps) => {
  const renderRow = (
    label: string,
    value: React.ReactNode,
    condition: boolean = true
  ) => {
    if (!condition) return null;
    return (
      <TableRow className="transition-colors">
        <TableCell className="font-semibold text-gray-800 align-top w-1/3">
          {label}
        </TableCell>
        <TableCell className="text-gray-800">{value}</TableCell>
      </TableRow>
    );
  };

  const getTopicTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      event: "blue",
      scholarship: "green",
      notification: "orange",
      job: "purple",
      advertisement: "yellow",
      internship: "main",
      recruitment: "cyan",
      volunteer: "pink",
      extracurricular: "neutral",
    };
    return <Badge className="capitalize">{type}</Badge>;
  };

  return (
    <div className="w-full overflow-auto">
      <Table className="border border-lightBorderV1">
        <TableHeader>
          <TableRow className="bg-[#F56C1420] hover">
            <TableHead className="font-semibold text-gray-800 text-nowrap w-1/3">
              Field
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderRow("Title", topic.title)}
          {renderRow("Type", getTopicTypeBadge(topic.type))}
          {renderRow(
            "Department",
            topic.department
              ? `${topic.department.name} (${topic.department.code})`
              : "General / All Departments"
          )}
          {renderRow("Description", topic.description, !!topic.description)}

          {/* Type Specific Fields */}
          {renderRow(
            "Start Date",
            topic.startDate ? formatDate(topic.startDate) : "",
            !!topic.startDate
          )}
          {renderRow(
            "End Date",
            topic.endDate ? formatDate(topic.endDate) : "",
            !!topic.endDate
          )}
          {renderRow(
            "Application Deadline",
            topic.applicationDeadline
              ? formatDate(topic.applicationDeadline)
              : "",
            !!topic.applicationDeadline
          )}
          {renderRow("Location", topic.location, !!topic.location)}
          {renderRow("Organizer", topic.organizer, !!topic.organizer)}
          {renderRow("Requirements", topic.requirements, !!topic.requirements)}
          {renderRow("Value", topic.value, !!topic.value)}
          {renderRow("Provider", topic.provider, !!topic.provider)}
          {renderRow("Eligibility", topic.eligibility, !!topic.eligibility)}
          {renderRow(
            "Application Process",
            topic.applicationProcess,
            !!topic.applicationProcess
          )}
          {renderRow(
            "Important",
            topic.isImportant ? "Yes" : "No",
            topic.type === "notification"
          )}
          {renderRow("Company", topic.company, !!topic.company)}
          {renderRow("Position", topic.position, !!topic.position)}
          {renderRow("Salary", topic.salary, !!topic.salary)}
          {renderRow("Contact Info", topic.contactInfo, !!topic.contactInfo)}

          {/* Metadata */}
          {renderRow("Created At", formatDate(topic.createdAt))}
          {renderRow("Updated At", formatDate(topic.updatedAt))}
          {renderRow(
            "Created By",
            `${topic.createdBy.name} (${topic.createdBy.role})`
          )}
        </TableBody>
      </Table>
    </div>
  );
};

"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IScholarship } from "@/interface/response/scholarship";
import { Activity } from "lucide-react";

interface ScholarshipTableProps {
  scholarship: IScholarship;
}

export const ScholarshipTable = ({ scholarship }: ScholarshipTableProps) => {
  const getStatusBadge = (scholarship: IScholarship) => {
    const now = new Date();
    const deadline = new Date(scholarship.applicationDeadline);

    if (deadline < now) {
      return <Badge variant="red">Expired</Badge>;
    }

    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (daysLeft <= 7) {
      return <Badge variant="orange">Ending Soon</Badge>;
    }

    return <Badge variant="green"><Activity className="h-3 w-3" />Active</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full overflow-auto">
      <Table className="border border-lightBorderV1">
        <TableHeader>
          <TableRow className="bg-[#F56C1420] hover">
            <TableHead className="font-semibold text-mainTextV1 text-nowrap w-1/3">Field</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-mainTextV1">Status</TableCell>
            <TableCell className="text-secondaryTextV1">
              {getStatusBadge(scholarship)}
            </TableCell>
          </TableRow>

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-mainTextV1">Provider</TableCell>
            <TableCell className="text-secondaryTextV1">
              {scholarship.provider}
            </TableCell>
          </TableRow>

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-mainTextV1">Scholarship Value</TableCell>
            <TableCell className="text-secondaryTextV1">
              <span className="text-xl font-semibold text-green-600">
                {scholarship.value}
              </span>
            </TableCell>
          </TableRow>

          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-mainTextV1 align-top">Description</TableCell>
            <TableCell className="text-secondaryTextV1 whitespace-pre-wrap">
              {scholarship.description}
            </TableCell>
          </TableRow>
          
          <TableRow className="transition-colors">
            <TableCell className="font-semibold text-mainTextV1">Application Deadline</TableCell>
            <TableCell className="text-secondaryTextV1">
              {formatDate(scholarship.applicationDeadline)}
            </TableCell>
          </TableRow>

          {scholarship.department && (
            <TableRow className="transition-colors">
              <TableCell className="font-semibold text-mainTextV1">Department</TableCell>
              <TableCell className="text-secondaryTextV1">
                {scholarship.department.name}
              </TableCell>
            </TableRow>
          )}


          {scholarship.eligibility && (
            <TableRow className="transition-colors">
              <TableCell className="font-semibold text-mainTextV1 align-top">Eligibility</TableCell>
              <TableCell className="text-secondaryTextV1 whitespace-pre-wrap">
                {scholarship.eligibility}
              </TableCell>
            </TableRow>
          )}

          {scholarship.requirements && (
            <TableRow className="transition-colors">
              <TableCell className="font-semibold text-mainTextV1 align-top">Requirements</TableCell>
              <TableCell className="text-secondaryTextV1 whitespace-pre-wrap">
                {scholarship.requirements}
              </TableCell>
            </TableRow>
          )}

          {scholarship.applicationProcess && (
            <TableRow className="transition-colors">
              <TableCell className="font-semibold text-mainTextV1 align-top">Application Process</TableCell>
              <TableCell className="text-secondaryTextV1 whitespace-pre-wrap">
                {scholarship.applicationProcess}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

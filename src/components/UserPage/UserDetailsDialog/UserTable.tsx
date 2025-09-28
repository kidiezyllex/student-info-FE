"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IUser } from "@/interface/response/user";
import { Activity } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";

interface UserTableProps {
  user: IUser;
}

export const UserTable = ({ user }: UserTableProps) => {
  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Badge variant="cyan">Admin</Badge>;
      case 'student':
        return <Badge variant="indigo">Student</Badge>;
      case 'coordinator':
        return <Badge variant="blue">Coordinator</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active ? <Badge variant="green"><Activity className="h-3 w-3" />Active</Badge> : <Badge variant="red">Inactive</Badge>;
  };

  return (
    <Card className="border border-lightBorderV1">
      <CardHeader>
        Basic Information
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Header */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 border border-slate-300 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName || user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={`/images/${user.gender ? user.gender : "male"}-${user.role}.webp`}
                alt={"default-avatar"}
                className="w-full h-full object-cover flex-shrink-0"
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-mainTextV1">
              Fullname: {user.fullName || user.name}
            </h3>
            <p className="text-secondaryTextV1">Username: {user.name}</p>
            <div className="flex items-center gap-2 mt-2">
              {getRoleBadge(user.role)}
              {getStatusBadge(user.active)}
            </div>
          </div>
        </div>

        {/* Table for detailed information */}
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
                <TableCell className="font-semibold text-mainTextV1">Student ID</TableCell>
                <TableCell className="text-secondaryTextV1">
                  {user.studentId ? (
                    <Badge variant="slate">{user.studentId}</Badge>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </TableCell>
              </TableRow>

              <TableRow className="transition-colors">
                <TableCell className="font-semibold text-mainTextV1">Department</TableCell>
                <TableCell className="text-secondaryTextV1">
                  {user.department ? (
                    <div className="flex items-center gap-1">
                      <Badge variant="slate">{user.department.code}</Badge>
                      <span>{user.department.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </TableCell>
              </TableRow>

              <TableRow className="transition-colors">
                <TableCell className="font-semibold text-mainTextV1">Email</TableCell>
                <TableCell className="text-secondaryTextV1">
                  {user.email}
                </TableCell>
              </TableRow>

              <TableRow className="transition-colors">
                <TableCell className="font-semibold text-mainTextV1">Phone Number</TableCell>
                <TableCell className="text-secondaryTextV1">
                  {user.phoneNumber ? (
                    user.phoneNumber
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </TableCell>
              </TableRow>

              <TableRow className="transition-colors">
                <TableCell className="font-semibold text-mainTextV1">Created At</TableCell>
                <TableCell className="text-secondaryTextV1">
                  {formatDate(user.createdAt)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

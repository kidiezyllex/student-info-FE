import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IActivityLog } from "@/interface/response/activity-log";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface ActivityLogsTableProps {
  logs: IActivityLog[];
  isSearching?: boolean;
  currentPage: number;
  pageSize: number;
}

const getActionBadgeColor = (action: string) => {
  switch (action.toUpperCase()) {
    case "CREATE":
      return "bg-green-100 text-green-800 border-green-300";
    case "UPDATE":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "DELETE":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "coordinator":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "student":
      return "bg-blue-100 text-blue-800 border-blue-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export function ActivityLogsTable({
  logs,
  isSearching,
  currentPage,
  pageSize,
}: ActivityLogsTableProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 text-lg">
          {isSearching
            ? "No activity logs found matching your search"
            : "No activity logs available"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12 text-center font-semibold text-gray-700">
              #
            </TableHead>
            <TableHead className="font-semibold text-gray-700">User</TableHead>
            <TableHead className="font-semibold text-gray-700">Role</TableHead>
            <TableHead className="font-semibold text-gray-700">
              Action
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Resource
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Details
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              IP Address
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Timestamp
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <motion.tr
              key={log._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <TableCell className="text-center text-gray-600">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {log.user.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {log.user.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`${getRoleBadgeColor(log.user.role)} capitalize`}
                >
                  {log.user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`${getActionBadgeColor(log.action)} font-semibold`}
                >
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {log.resource}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {log.resourceId}
                  </span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <p
                  className="text-sm text-gray-700 truncate"
                  title={log.details}
                >
                  {log.details}
                </p>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600 font-mono">
                  {log.ipAddress}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm:ss")}
                </span>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

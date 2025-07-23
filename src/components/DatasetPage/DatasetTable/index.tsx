"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IDatasetItem } from "@/interface/response/dataset";
import { motion } from "framer-motion";
import { IconEdit, IconTrash, IconKey, IconTag } from "@tabler/icons-react";

interface DatasetTableProps {
  datasetItems: IDatasetItem[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const getCategoryBadge = (category: string) => {
  const categoryColors: Record<string, any> = {
    'event': 'orange',
    'scholarship': 'green',
    'notification': 'purple',
    'default': 'gray'
  };

  const colorClass = categoryColors[category.toLowerCase()] || categoryColors.default;

  return (
    <Badge variant={colorClass}>
      <IconTag className="w-3 h-3" />
      {category}
    </Badge>
  );
};

export const DatasetTable = ({ datasetItems, isSearching, onEdit, onDelete }: DatasetTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F56C1420] hover:bg-gray-50">
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Key</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Value</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Category</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Department</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Created At</TableHead>
            <TableHead className="font-semibold text-mainTextV1 text-nowrap">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasetItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-secondaryTextV1">
                {isSearching ? "No matching dataset items found" : "No dataset items yet"}
              </TableCell>
            </TableRow>
          ) : (
            datasetItems.map((item) => (
              <TableRow
                key={item._id}
                className="hover:bg-gray-50 transition-colors"
                onMouseEnter={() => setHoveredRow(item._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="flex items-center gap-2">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                    <IconKey className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-mainTextV1">{item.key}</p>
                    <p className="text-sm text-secondaryTextV1">ID: {item._id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="text-secondaryTextV1 line-clamp-2 break-words">{item.value}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getCategoryBadge(item.category)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {item.department ? (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-mainTextV1">{item.department.name}</p>
                        <p className="text-xs text-secondaryTextV1">ID: {item.department._id}</p>
                      </div>
                    ) : (
                      <span className="text-secondaryTextV1">No department</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-secondaryTextV1">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(item._id)}
                        className="text-mainTextV1 hover:text-mainTextHoverV1 hover:bg-transparent"
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(item._id)}
                        className="text-mainTextV1 hover:text-mainDangerV1 hover:bg-transparent"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}; 
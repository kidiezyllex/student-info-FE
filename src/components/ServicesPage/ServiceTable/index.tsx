"use client";

import { motion } from 'framer-motion';
import { IconEye, IconEdit, IconTrash, IconSettings, IconCalendar, IconTag } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { IService } from '@/interface/response/service';
import React from 'react';

interface ServiceTableProps {
  services: IService[];
  isLoading: boolean;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ServiceTable = ({ 
  services, 
  isLoading, 
  page = 1, 
  pageSize = 9, 
  total = 0, 
  onPageChange,
  onView, 
  onEdit, 
  onDelete 
}: ServiceTableProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, index) => (
          <Card key={index} className="border border-lightBorderV1 overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card className="border border-lightBorderV1 bg-gradient-to-br from-gray-50 to-gray-100">
        <CardContent className="p-16 text-center">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <IconSettings className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-mainTextV1 mb-3">Không có dịch vụ nào</h3>
          <p className="text-secondaryTextV1 text-base">Chưa có dịch vụ nào được tạo. Hãy thêm dịch vụ đầu tiên để bắt đầu.</p>
        </CardContent>
      </Card>
    );
  }

  // Lấy danh sách item cho trang hiện tại
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pagedServices = services.slice(startIdx, endIdx);

  return (
    <React.Fragment>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pagedServices.map((service, index) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group"
          >
            <Card className="relative border bg-gradient-to-br from-white via-gray-50 to-blue-50/30 transition-all duration-300 overflow-hidden backdrop-blur-sm border-lightBorderV1">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              
              <CardContent className="relative p-6 space-y-4">
                {/* Header with icon and title */}
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <IconSettings className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-mainTextV1 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-secondaryTextV1">
                      <IconTag className="h-4 w-4" />
                      <span className="font-medium text-blue-600">{service.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {service.description && (
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-secondaryTextV1 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                )}

                {/* Footer with date and actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex gap-2 justify-end w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(service._id)}
                    >
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(service._id)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {total > pageSize && onPageChange && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default ServiceTable; 
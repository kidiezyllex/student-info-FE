"use client";

import { useGetDuePaymentsStatistics } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Home, User } from "tabler-icons-react";
import { formatCurrency } from "@/utils/currencyFormat";
import { formatDate } from "@/utils/dateFormat";

export default function DuePayments() {
  const { data, isLoading, error } = useGetDuePaymentsStatistics();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-lightBorderV1 rounded-lg p-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-4 w-36" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Lỗi khi tải dữ liệu thanh toán sắp đến hạn: {error.message}
        </div>
      </Card>
    );
  }

  const duePaymentsData = data?.data?.statistics;
  
  if (!duePaymentsData) {
    return null;
  }

  const { duePaymentsCount, duePayments } = duePaymentsData;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={20} className="text-orange-500" />
          <h3 className="text-xl font-semibold text-mainTextV1">Thanh toán sắp đến hạn</h3>
        </div>
        <p className="text-secondaryTextV1">
          Có <span className="font-semibold text-orange-500">{duePaymentsCount}</span> thanh toán sắp đến hạn
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 max-h-[400px] overflow-y-auto"
      >
        {duePayments.length === 0 ? (
          <div className="text-center py-8 text-secondaryTextV1">
            <AlertTriangle size={48} className="mx-auto mb-4 text-green-500" />
            <p>Không có thanh toán nào sắp đến hạn</p>
          </div>
        ) : (
          duePayments.map((payment) => (
            <motion.div
              key={payment._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-lightBorderV1 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Home size={16} className="text-blue-500" />
                  <span className="font-medium text-mainTextV1">
                    {payment.homeId.name}
                  </span>
                </div>
                <Badge 
                  variant={payment.daysUntilDue <= 3 ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {payment.daysUntilDue} ngày
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-500" />
                  <span className="text-secondaryTextV1">Khách:</span>
                  <span className="font-medium">{payment.guestName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-500" />
                  <span className="text-secondaryTextV1">Hạn:</span>
                  <span className="font-medium">
                    {formatDate(payment.datePaymentExpec)}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-lightBorderV1">
                <div className="flex items-center justify-between">
                  <span className="text-secondaryTextV1">Số tiền:</span>
                  <span className="font-semibold text-lg text-primary">
                    {formatCurrency(payment.totalReceive)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </Card>
  );
} 
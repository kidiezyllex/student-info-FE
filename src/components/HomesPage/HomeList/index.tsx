"use client";

import { motion } from 'framer-motion';
import { IconHome, IconInfoCircle, IconBuilding, IconMapPin } from '@tabler/icons-react';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { IHome, IHomeSearchResult } from '@/interface/response/home';
import { Pagination } from '@/components/ui/pagination';
import React, { useState } from 'react';
import { HomeDetailsDialog } from '@/components/HomesPage/HomeDetailsDialog';

interface HomeListProps {
  homes?: (IHome | IHomeSearchResult)[];
  isLoading?: boolean;
  error?: any;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
}

const HomeList = ({ homes, isLoading = false, error = null, page = 1, pageSize = 10, total = 0, onPageChange, onRefresh }: HomeListProps) => {
  const [selectedHome, setSelectedHome] = useState<IHome | IHomeSearchResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleHomeClick = (home: IHome | IHomeSearchResult) => {
    setSelectedHome(home);
    setIsDialogOpen(true);
  };

  // Function to determine rental status badge
  const getRentalStatusBadge = (home: IHome | IHomeSearchResult) => {
    if (home.homeContract && home.homeContract.status === 1) {
      return (
        <Badge className="bg-violet-500 hover:bg-violet-600 text-white border-2 border-violet-400 text-nowrap">
          Đã cho thuê
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-400 text-nowrap">
        Chưa cho thuê
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-lightBorderV1">
            <div className="relative h-48 w-full bg-gray-100">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 bg-mainCardV1 rounded-lg border border-lightBorderV1 text-mainTextV1">
        <IconInfoCircle className="h-5 w-5 mr-2 text-mainDangerV1" />
        <p>Đã xảy ra lỗi khi tải danh sách căn hộ. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (!homes || homes.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 bg-mainCardV1 rounded-lg border border-lightBorderV1 text-mainTextV1">
        <IconInfoCircle className="h-5 w-5 mr-2 text-mainInfoV1" />
        <p>Chưa có căn hộ nào để hiển thị.</p>
      </div>
    );
  }

  // Lấy danh sách item cho trang hiện tại
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pagedHomes = homes.slice(startIdx, endIdx);

  return (
    <React.Fragment>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {pagedHomes.map((home: IHome | IHomeSearchResult, index: number) => (
          <motion.div key={home._id} variants={item}>
            <Card className="overflow-hidden border border-lightBorderV1 h-full flex flex-col transition-shadow duration-200">
              <div className="relative h-48 w-full bg-gray-100">
                <Image 
                  draggable={false}
                  src={home.images[0] || `/images/sample-img${index+1}.png`}
                  alt={home.building || home.address}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {getRentalStatusBadge(home)}
                </div>
              </div>
              
              {/* Updated Card Header with better styling */}
              <div className="bg-[#F9F9FC] border-b border-b-lightBorderV1 overflow-hidden  px-4 py-[10px] text-base font-semibold text-primary flex flex-col items-start gap-1">
                <div className="flex items-center gap-1 w-full">
                  <IconBuilding className="h-4 w-4 text-mainTextHoverV1 flex-shrink-0" />
                  <h3 className="tracking-tight text-lg font-semibold text-mainTextV1 line-clamp-1 flex-1">
                    {home.building} - {home.apartmentNv}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-mainTextV1 text-sm">
                  <IconMapPin className="h-4 w-4 text-mainTextHoverV1 flex-shrink-0" />
                  <p className="line-clamp-1">
                    {home.address}, {home.ward}, {home.district}
                  </p>
                </div>
              </div>
              
              <CardContent className="flex-1 pt-2 flex flex-col gap-2">
                <div className="space-y-2 text-secondaryTextV1">
                  <div>
                    <span className="font-semibold">Chủ nhà: </span>
                    {home.homeOwnerId?.fullname} ({home.homeOwnerId?.phone})
                  </div>
                  {home.note && (
                    <div>
                      <span className="font-semibold">Ghi chú: </span>
                      {home.note}
                    </div>
                  )}
                </div>
              <div className='flex-1 flex flex-col items-end justify-end'>
              <Button 
                  className="w-full bg-mainTextHoverV1 hover:bg-mainTextHoverV1/90"
                  onClick={() => handleHomeClick(home)}
                >
                  Xem chi tiết
                </Button>
              </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
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

      {selectedHome && (
        <HomeDetailsDialog
          homeId={selectedHome._id}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => {
            setIsDialogOpen(false);
            setSelectedHome(null);
            onRefresh?.();
          }}
        />
      )}
    </React.Fragment>
  );
};

export default HomeList; 
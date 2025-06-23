"use client";
import { HomeDetailInfo } from '@/components/HomesPage/HomeDetailInfo';
import { useGetHomeDetail } from '@/hooks/useHome';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function AdminHomeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const homeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: homeData, isLoading, error } = useGetHomeDetail({
    id: homeId || ''
  });

  if (!homeId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">ID căn hộ không hợp lệ</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 flex justify-center">
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !homeData?.data?.home) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Không thể tải thông tin căn hộ</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <IconArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết căn hộ {homeData.data.home.apartmentNv}</CardTitle>
          </CardHeader>
          <CardContent>
            <HomeDetailInfo home={homeData.data.home} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
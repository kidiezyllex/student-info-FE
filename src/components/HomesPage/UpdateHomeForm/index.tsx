"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useGetHomeDetail, useUpdateHome } from '@/hooks/useHome';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  IconHome,
  IconLoader2,
  IconInfoCircle
} from '@tabler/icons-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useGetHomeOwners } from '@/hooks/useHomeOwner';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  address: z.string().min(1, 'Địa chỉ không được để trống'),
  homeOwnerId: z.string().min(1, 'Chủ sở hữu không được để trống'),
  district: z.string().min(1, 'Quận/Huyện không được để trống'),
  ward: z.string().min(1, 'Phường/Xã không được để trống'),
  building: z.string().min(1, 'Tòa nhà không được để trống'),
  apartmentNv: z.string().min(1, 'Số căn hộ không được để trống'),
  active: z.boolean(),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateHomeFormProps {
  homeId: string;
}

const UpdateHomeForm = ({ homeId }: UpdateHomeFormProps) => {
  const router = useRouter();
  const { data: homeData, isLoading: isLoadingHome, error: homeError } = useGetHomeDetail({ id: homeId });
  const { mutate, isPending } = useUpdateHome();
  const { data: allHomeOwners } = useGetHomeOwners();

  const home = homeData?.data;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      homeOwnerId: '',
      district: '',
      ward: '',
      building: '',
      apartmentNv: '',
      active: true,
      note: '',
    },
  });

  useEffect(() => {
    if (home) {
      form.reset({
        address: (home as any).address,
        homeOwnerId: (home as any).homeOwnerId?._id || '',
        district: (home as any).district,
        ward: (home as any).ward,
        building: (home as any).building,
        apartmentNv: (home as any).apartmentNv,
        active: (home as any).active,
        note: (home as any).note || '',
      }); 
    }
  }, [home, form]);

  const onSubmit = (values: FormValues) => {
    const updates: Record<string, any> = {};
    if (values.address !== (home as any).address) updates.address = values.address;
    if (values.homeOwnerId !== (home as any).homeOwnerId?._id) updates.homeOwnerId = values.homeOwnerId;
    if (values.district !== (home as any).district) updates.district = values.district;
    if (values.ward !== (home as any).ward) updates.ward = values.ward;
    if (values.building !== (home as any).building) updates.building = values.building;
    if (values.apartmentNv !== (home as any).apartmentNv) updates.apartmentNv = values.apartmentNv;
    if (values.active !== (home as any).active) updates.active = values.active;
    if (values.note !== (home as any).note) updates.note = values.note;
    
    if (Object.keys(updates).length === 0) {
      toast.info('Chưa có thông tin nào được thay đổi.');
      return;
    }

    mutate({
      params: { id: homeId },
      body: updates
    }, {
      onSuccess: () => {
        toast.success('Cập nhật căn hộ thành công!');
        router.push(`/admin/homes/${homeId}`);
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message || 'Không thể cập nhật căn hộ'}`);
      },
    });
  };

  if (isLoadingHome) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        
        <Card className="border border-lightBorderV1">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32 ml-auto" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (homeError || !home) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-mainCardV1 rounded-lg border border-lightBorderV1">
        <IconInfoCircle className="h-12 w-12 text-mainDangerV1 mb-4" />
        <h2 className="text-xl font-semibold text-mainTextV1 mb-2">Không thể tải thông tin căn hộ</h2>
        <p className="text-secondaryTextV1 mb-6">{homeError?.message || 'Đã xảy ra lỗi khi tải thông tin căn hộ'}</p>
        <Button 
          className="bg-mainTextHoverV1 hover:bg-mainTextHoverV1/90"
          onClick={() => router.push('/homes')}
        >
          Quay lại danh sách căn hộ
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/homes">Quản lý căn hộ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cập nhật căn hộ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border border-lightBorderV1 bg-mainBackgroundV1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="bg-mainBackgroundV1 p-4 rounded-sm mb-6 border border-lightBorderV1">
                  <p className="text-mainTextV1 flex items-center">
                    <IconInfoCircle className="h-5 w-5 mr-2 text-mainInfoV1" />
                    Bạn chỉ có thể cập nhật những thông tin dưới đây. Các thông tin khác không thể thay đổi.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-mainTextV1">Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ căn hộ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Quận/Huyện</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập quận/huyện" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Phường/Xã</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập phường/xã" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="building"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Tòa nhà</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên tòa nhà" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apartmentNv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mainTextV1">Số căn hộ</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập số căn hộ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="homeOwnerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-mainTextV1">Chọn chủ nhà</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn chủ nhà" />
                          </SelectTrigger>
                          <SelectContent>
                            {(allHomeOwners?.data as any)?.map((owner: any) => (
                              <SelectItem key={owner._id} value={owner._id}>
                                {owner.fullname} {owner.phone ? `- ${owner.phone}` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none" >
                        <FormLabel className="text-mainTextV1">Trạng thái hoạt động</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Chọn nếu căn hộ đang hoạt động và có thể cho thuê
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-mainTextV1">Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập ghi chú về căn hộ (nếu có)" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-4 border-t border-lightBorderV1 pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : 'Cập nhật'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default UpdateHomeForm; 
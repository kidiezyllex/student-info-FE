"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconSettings, 
  IconPlus, 
  IconFilter, 
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconX
} from '@tabler/icons-react';
import { useGetServices, useSearchServices, useDeleteService } from '@/hooks/useService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toast } from 'react-toastify';
import ServiceTable from './ServiceTable';
import ServiceCreateDialog from './ServiceCreateDialog';
import ServiceDetailsDialog from './ServiceDetailsDialog';
import ServiceDeleteDialog from './ServiceDeleteDialog';

const ServicesPage = () => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { data: allServices, isLoading: isLoadingAllServices, error: errorAllServices, refetch: refetchAllServices } = useGetServices();
  const { data: serviceSearchResults, isLoading: isSearching, error: searchError, refetch: refetchSearchResults } = useSearchServices({ q: debouncedQuery });
  const { mutate: deleteServiceMutation, isPending: isDeleting } = useDeleteService();

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };
  
  const resetFilters = () => {
    setSortBy('newest');
    setSortDirection('desc');
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewDetail = (id: string) => {
    setSelectedServiceId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedServiceId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedServiceId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedServiceId) return;

    deleteServiceMutation(
      { id: selectedServiceId },
      {
        onSuccess: (data) => {
          if (data.statusCode === 200) {
            toast.success("Xóa dịch vụ thành công");
            refetchAllServices();
            if (debouncedQuery) {
              refetchSearchResults();
            }
            setIsDeleteDialogOpen(false);
            setSelectedServiceId(null);
            // Reset to page 1 if current page becomes empty after deletion
            const totalAfterDelete = (services?.length || 1) - 1;
            const maxPage = Math.ceil(totalAfterDelete / pageSize);
            if (page > maxPage && maxPage > 0) {
              setPage(maxPage);
            }
          } else {
            toast.error("Xóa dịch vụ thất bại");
          }
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        }
      }
    );
  };

  const services = debouncedQuery
    ? (Array.isArray(serviceSearchResults?.data) ? serviceSearchResults.data : undefined)
    : (Array.isArray(allServices?.data) ? allServices.data : undefined);

  const filteredAndSortedServices = () => {
    if (!services) return [];
    
    let result = [...services];
    
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = new Date(a.createdAt || '').getTime();
        const dateB = new Date(b.createdAt || '').getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
    
    return result;
  };

  const total = services ? services.length : 0;
  const isLoadingData = isLoadingAllServices || isSearching;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  return (
    <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý dịch vụ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center">
              <IconSettings className="h-5 w-5 text-mainTextV1 mr-2" />
              <h1 className="text-xl font-semibold text-mainTextV1">Danh sách dịch vụ</h1>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={toggleFilters}
              >
                <IconFilter className="h-4 w-4" />
                Bộ lọc
              </Button>
              
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <IconPlus className="h-4 w-4" />
                Thêm dịch vụ
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-24 pl-10 h-12 w-full"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 h-5 w-5" />
                
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={clearSearch}
                    className="absolute right-28 top-1/2 transform -translate-y-1/2 text-mainTextV1 hover:text-mainTextHoverV1"
                  >
                    <IconX className="h-5 w-5" />
                  </button>
                )}
                
                <Button 
                  type="submit"
                  className="absolute right-0 top-0 h-12 rounded-tl-none rounded-bl-none"
                >
                  Tìm kiếm
                </Button>
              </div>
            </form>
          </div>
          
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isFiltersVisible ? 'auto' : 0,
              opacity: isFiltersVisible ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {isFiltersVisible && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-mainBackgroundV1 rounded-lg mb-6 border border-lightBorderV1">
                <div>
                  <label className="text-sm text-mainTextV1 mb-2 block">Sắp xếp theo</label>
                  <Select 
                    value={sortBy} 
                    onValueChange={(value) => {
                      setSortBy(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="name">Tên dịch vụ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-mainTextV1 mb-2 block">Thứ tự</label>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      setPage(1);
                    }}
                    className="w-full justify-start"
                  >
                    {sortDirection === 'asc' ? (
                      <IconSortAscending className="h-4 w-4" />
                    ) : (
                      <IconSortDescending className="h-4 w-4" />
                    )}
                    {sortDirection === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                  </Button>
                </div>
                
                <div className="md:col-span-2">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full"
                  >
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
          
          <ServiceTable
            services={filteredAndSortedServices()}
            isLoading={isLoadingData}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
            onView={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </motion.div>

      <ServiceCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          refetchAllServices();
          if (debouncedQuery) {
            refetchSearchResults();
          }
        }}
      />

      <ServiceDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedServiceId(null);
        }}
        serviceId={selectedServiceId}
        onSuccess={() => {
          refetchAllServices();
          if (debouncedQuery) {
            refetchSearchResults();
          }
        }}
      />

      <ServiceDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedServiceId(null);
        }}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ServicesPage; 
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconHome, 
  IconPlus, 
  IconFilter, 
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconX
} from '@tabler/icons-react';
import { useGetHomes, useSearchHomes } from '@/hooks/useHome';
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
import HomeList from './HomeList';
import { HomeCreateDialog } from './HomeCreateDialog';
import { IHome, IHomeSearchResult } from '@/interface/response/home';

const HomesPage = () => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [rentalStatus, setRentalStatus] = useState<string>('all');
  const [sortDirection, setSortDirection] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };
  const { data: homeSearchResults, isLoading, error, refetch: refetchSearchResults } = useSearchHomes({ q: debouncedQuery });
  const { data: allHomes, isLoading: isLoadingAllHomes, error: errorAllHomes, refetch: refetchAllHomes } = useGetHomes();
  
  const resetFilters = () => {
    setRentalStatus('all');
    setSortDirection('newest');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const handleCreateSuccess = () => {
    refetchAllHomes?.();
    if (debouncedQuery) {
      refetchSearchResults?.();
    }
  };

  // Filter and sort homes
  const filterAndSortHomes = (homesData: (IHome | IHomeSearchResult)[]) => {
    let filteredHomes = [...homesData];

    // Filter by rental status
    if (rentalStatus !== 'all') {
      filteredHomes = filteredHomes.filter(home => {
        const isRented = home.homeContract && home.homeContract.status === 1;
        return rentalStatus === 'rented' ? isRented : !isRented;
      });
    }

    // Sort by creation date
    filteredHomes.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      
      return sortDirection === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filteredHomes;
  };

  const rawHomes = debouncedQuery
    ? (Array.isArray(homeSearchResults?.data) ? homeSearchResults.data : undefined)
    : (Array.isArray(allHomes?.data) ? allHomes.data : undefined);
  
  const homes = rawHomes ? filterAndSortHomes(rawHomes) : undefined;
  const total = homes ? homes.length : 0;

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, allHomes, homeSearchResults, rentalStatus, sortDirection]);

  return (
    <div className="space-y-8 bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý căn hộ</BreadcrumbPage>
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
              <IconHome className="h-5 w-5 text-mainTextV1 mr-2" />
              <h1 className="text-xl font-semibold text-mainTextV1">Danh sách các căn hộ hiện có</h1>
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
                Thêm căn hộ
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Tìm kiếm căn hộ..."
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
                  <label className="text-sm text-mainTextV1 mb-2 block">Trạng thái thuê</label>
                  <Select 
                    value={rentalStatus} 
                    onValueChange={setRentalStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="rented">Đã cho thuê</SelectItem>
                      <SelectItem value="available">Chưa cho thuê</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-mainTextV1 mb-2 block">Được thêm vào</label>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center"
                    onClick={() => setSortDirection(sortDirection === 'newest' ? 'oldest' : 'newest')}
                  >
                    {sortDirection === 'newest' ? (
                      <>
                        <span>Mới nhất</span>
                        <IconSortDescending className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Cũ nhất</span>
                        <IconSortAscending className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="md:col-span-2 flex justify-end mt-4">
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={resetFilters}
                  >
                    <IconX className="h-4 w-4" />
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
          
          <HomeList 
            homes={homes}
            isLoading={debouncedQuery ? isLoading : isLoadingAllHomes}
            error={debouncedQuery ? error : errorAllHomes}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onRefresh={() => {
              refetchAllHomes?.();
              if (debouncedQuery) {
                refetchSearchResults?.();
              }
            }}
          />
        </div>
      </motion.div>

      <HomeCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default HomesPage; 
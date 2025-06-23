import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHomes,
  getAvailableHomes,
  getAvailableHomesForRent,
  searchHomes,
  searchHomesByAmenities,
  getHomesByOwner,
  getHomeDetail,
  createHome,
  updateHome,
  deleteHome
} from '@/api/home';
import {
  IHomeListResponse,
  IHomeAvailableListResponse,
  IHomeSearchResponse,
  IHomeListByOwnerResponse,
  IHomeDetailResponse,
  IHomeCreateResponse,
  IHomeUpdateResponse,
  IHomeDeleteResponse
} from '@/interface/response/home';
import {
  IGetHomeDetailParams,
  ISearchHomeParams,
  ISearchHomeByAmenitiesParams,
  IGetHomeByOwnerParams,
  ICreateHomeBody,
  IUpdateHomeParams,
  IUpdateHomeBody,
  IDeleteHomeParams
} from '@/interface/request/home';

export const useGetHomes = () => {
  return useQuery<IHomeListResponse, Error>({
    queryKey: ['homes'],
    queryFn: getHomes,
  });
};

export const useGetAvailableHomes = () => {
  return useQuery<IHomeAvailableListResponse, Error>({
    queryKey: ['homes', 'available'],
    queryFn: getAvailableHomes,
  });
};

export const useGetAvailableHomesForRent = () => {
  return useQuery<IHomeAvailableListResponse, Error>({
    queryKey: ['homes', 'available-for-rent'],
    queryFn: getAvailableHomesForRent,
  });
};

export const useSearchHomes = (params: ISearchHomeParams) => {
  return useQuery<IHomeSearchResponse, Error>({
    queryKey: ['homes', 'search', params.q],
    queryFn: () => searchHomes(params),
    enabled: !!params.q,
  });
};

export const useSearchHomesByAmenities = (params: ISearchHomeByAmenitiesParams) => {
  return useQuery<IHomeSearchResponse, Error>({
    queryKey: ['homes', 'search-amenities', params.amenities],
    queryFn: () => searchHomesByAmenities(params),
    enabled: !!params.amenities,
  });
};

export const useGetHomesByOwner = (params: IGetHomeByOwnerParams) => {
  return useQuery<IHomeListByOwnerResponse, Error>({
    queryKey: ['homes', 'homeowner', params.homeOwnerId],
    queryFn: () => getHomesByOwner(params),
    enabled: !!params.homeOwnerId,
  });
};

export const useGetHomeDetail = (params: IGetHomeDetailParams) => {
  return useQuery<IHomeDetailResponse, Error>({
    queryKey: ['homes', 'detail', params.id],
    queryFn: () => getHomeDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateHome = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IHomeCreateResponse, Error, ICreateHomeBody>({
    mutationFn: createHome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homes'] });
      queryClient.invalidateQueries({ queryKey: ['homes', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['homes', 'available-for-rent'] });
    },
  });
};

export const useUpdateHome = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IHomeUpdateResponse, Error, { params: IUpdateHomeParams, body: IUpdateHomeBody }>({
    mutationFn: ({ params, body }) => updateHome(params, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['homes'] });
      queryClient.invalidateQueries({ queryKey: ['homes', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['homes', 'available-for-rent'] });
      queryClient.invalidateQueries({ queryKey: ['homes', 'detail', variables.params.id] });
    },
  });
};

export const useDeleteHome = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IHomeDeleteResponse, Error, IDeleteHomeParams>({
    mutationFn: deleteHome,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['homes'] });
      queryClient.invalidateQueries({ queryKey: ['homes', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['homes', 'available-for-rent'] });
      queryClient.invalidateQueries({ queryKey: ['homes', 'detail', variables.id] });
    },
  });
}; 
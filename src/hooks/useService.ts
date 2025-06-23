import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getServices,
  searchServices,
  getServiceDetail,
  createService,
  updateService,
  deleteService
} from '@/api/service';
import {
  IServiceListResponse,
  IServiceSearchResponse,
  IServiceDetailResponse,
  IServiceCreateResponse,
  IServiceUpdateResponse,
  IServiceDeleteResponse
} from '@/interface/response/service';
import {
  IGetServiceDetailParams,
  ISearchServiceParams,
  ICreateServiceBody,
  IUpdateServiceParams,
  IUpdateServiceBody,
  IDeleteServiceParams
} from '@/interface/request/service';

export const useGetServices = () => {
  return useQuery<IServiceListResponse, Error>({
    queryKey: ['services'],
    queryFn: getServices,
  });
};

export const useSearchServices = (params: ISearchServiceParams) => {
  return useQuery<IServiceSearchResponse, Error>({
    queryKey: ['services', 'search', params.q],
    queryFn: () => searchServices(params),
    enabled: !!params.q,
  });
};

export const useGetServiceDetail = (params: IGetServiceDetailParams) => {
  return useQuery<IServiceDetailResponse, Error>({
    queryKey: ['services', 'detail', params.id],
    queryFn: () => getServiceDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IServiceCreateResponse, Error, ICreateServiceBody>({
    mutationFn: createService,
    onSuccess: () => {
      // Invalidate and refetch service list
      queryClient.invalidateQueries({ queryKey: ['services'] });
      
      // Invalidate search results if any
      queryClient.invalidateQueries({ 
        queryKey: ['services', 'search'] 
      });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IServiceUpdateResponse, Error, { params: IUpdateServiceParams, body: IUpdateServiceBody }>({
    mutationFn: ({ params, body }) => updateService(params, body),
    onSuccess: (data, variables) => {
      // Invalidate and refetch service list
      queryClient.invalidateQueries({ queryKey: ['services'] });
      
      // Invalidate and refetch service detail for the updated service
      queryClient.invalidateQueries({ 
        queryKey: ['services', 'detail', variables.params.id] 
      });
      
      // Invalidate search results if any
      queryClient.invalidateQueries({ 
        queryKey: ['services', 'search'] 
      });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IServiceDeleteResponse, Error, IDeleteServiceParams>({
    mutationFn: deleteService,
    onSuccess: (data, variables) => {
      // Invalidate and refetch service list
      queryClient.invalidateQueries({ queryKey: ['services'] });
      
      // Invalidate and refetch service detail for the deleted service
      queryClient.invalidateQueries({ 
        queryKey: ['services', 'detail', variables.id] 
      });
      
      // Invalidate search results if any
      queryClient.invalidateQueries({ 
        queryKey: ['services', 'search'] 
      });
    },
  });
}; 
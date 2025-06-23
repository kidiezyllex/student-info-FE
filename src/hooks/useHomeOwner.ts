import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHomeOwners,
  searchHomeOwners,
  getHomeOwnerDetail,
  createHomeOwner,
  updateHomeOwner,
  deleteHomeOwner
} from '@/api/homeOwner';
import {
  IHomeOwnerListResponse,
  IHomeOwnerSearchResponse,
  IHomeOwnerDetailResponse,
  IHomeOwnerCreateResponse,
  IHomeOwnerUpdateResponse,
  IHomeOwnerDeleteResponse
} from '@/interface/response/homeOwner';
import {
  IGetHomeOwnerDetailParams,
  ISearchHomeOwnerParams,
  ICreateHomeOwnerBody,
  IUpdateHomeOwnerParams,
  IUpdateHomeOwnerBody,
  IDeleteHomeOwnerParams
} from '@/interface/request/homeOwner';

export const useGetHomeOwners = () => {
  return useQuery<IHomeOwnerListResponse, Error>({
    queryKey: ['home-owners'],
    queryFn: getHomeOwners,
  });
};

export const useSearchHomeOwners = (params: ISearchHomeOwnerParams) => {
  return useQuery<IHomeOwnerSearchResponse, Error>({
    queryKey: ['home-owners', 'search', params.q],
    queryFn: () => searchHomeOwners(params),
    enabled: !!params.q,
  });
};

export const useGetHomeOwnerDetail = (params: IGetHomeOwnerDetailParams) => {
  return useQuery<IHomeOwnerDetailResponse, Error>({
    queryKey: ['home-owners', 'detail', params.id],
    queryFn: () => getHomeOwnerDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateHomeOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IHomeOwnerCreateResponse, Error, ICreateHomeOwnerBody>({
    mutationFn: createHomeOwner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-owners'] });
    },
  });
};

export const useUpdateHomeOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IHomeOwnerUpdateResponse, Error, { params: IUpdateHomeOwnerParams, body: IUpdateHomeOwnerBody }>({
    mutationFn: ({ params, body }) => updateHomeOwner(params, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['home-owners'] });
      queryClient.invalidateQueries({ queryKey: ['home-owners', 'detail', variables.params.id] });
    },
  });
};

export const useDeleteHomeOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IHomeOwnerDeleteResponse, Error, IDeleteHomeOwnerParams>({
    mutationFn: deleteHomeOwner,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['home-owners'] });
      queryClient.invalidateQueries({ queryKey: ['home-owners', 'detail', variables.id] });
    },
  });
}; 
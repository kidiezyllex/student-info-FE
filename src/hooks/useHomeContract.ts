import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHomeContracts,
  searchHomeContracts,
  getHomeContractsByHome,
  getHomeContractsByGuest,
  getHomeContractDetail,
  createHomeContract,
  updateHomeContract,
  deleteHomeContract
} from '@/api/homeContract';
import {
  IHomeContractListResponse,
  IHomeContractSearchResponse,
  IHomeContractDetailResponse,
  IHomeContractCreateResponse,
  IHomeContractUpdateResponse,
  IHomeContractDeleteResponse
} from '@/interface/response/homeContract';
import {
  IGetHomeContractByHomeParams,
  IGetHomeContractByGuestParams,
  IGetHomeContractDetailParams,
  ISearchHomeContractParams,
  ICreateHomeContractBody,
  IUpdateHomeContractParams,
  IUpdateHomeContractBody,
  IDeleteHomeContractParams
} from '@/interface/request/homeContract';

export const useGetHomeContracts = () => {
  return useQuery<IHomeContractListResponse, Error>({
    queryKey: ['home-contracts'],
    queryFn: getHomeContracts,
  });
};

export const useSearchHomeContracts = (params: ISearchHomeContractParams) => {
  return useQuery<IHomeContractSearchResponse, Error>({
    queryKey: ['home-contracts', 'search', params.q],
    queryFn: () => searchHomeContracts(params),
    enabled: !!params.q,
  });
};

export const useGetHomeContractsByHome = (params: IGetHomeContractByHomeParams) => {
  return useQuery<IHomeContractListResponse, Error>({
    queryKey: ['home-contracts', 'home', params.homeId],
    queryFn: () => getHomeContractsByHome(params),
    enabled: !!params.homeId,
  });
};

export const useGetHomeContractsByGuest = (params: IGetHomeContractByGuestParams) => {
  return useQuery<IHomeContractListResponse, Error>({
    queryKey: ['home-contracts', 'guest', params.guestId],
    queryFn: () => getHomeContractsByGuest(params),
    enabled: !!params.guestId,
  });
};

export const useGetHomeContractDetail = (params: IGetHomeContractDetailParams) => {
  return useQuery<IHomeContractDetailResponse, Error>({
    queryKey: ['home-contracts', 'detail', params.id],
    queryFn: () => getHomeContractDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateHomeContract = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IHomeContractCreateResponse, Error, ICreateHomeContractBody>({
    mutationFn: createHomeContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-contracts'] });
    },
  });
};

export const useUpdateHomeContract = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IHomeContractUpdateResponse, Error, { params: IUpdateHomeContractParams, body: IUpdateHomeContractBody }>({
    mutationFn: ({ params, body }) => updateHomeContract(params, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['home-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['home-contracts', 'detail', variables.params.id] });
    },
  });
};

export const useDeleteHomeContract = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IHomeContractDeleteResponse, Error, IDeleteHomeContractParams>({
    mutationFn: deleteHomeContract,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['home-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['home-contracts', 'detail', variables.id] });
    },
  });
}; 
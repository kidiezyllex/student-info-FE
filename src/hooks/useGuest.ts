import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGuests,
  searchGuests,
  getGuestDetail,
  createGuest,
  updateGuest,
  deleteGuest
} from '@/api/guest';
import {
  IGuestListResponse,
  IGuestSearchResponse,
  IGuestDetailResponse,
  IGuestCreateResponse,
  IGuestUpdateResponse,
  IGuestDeleteResponse
} from '@/interface/response/guest';
import {
  IGetGuestDetailParams,
  ISearchGuestParams,
  ICreateGuestBody,
  IUpdateGuestParams,
  IUpdateGuestBody,
  IDeleteGuestParams
} from '@/interface/request/guest';

export const useGetGuests = () => {
  return useQuery<IGuestListResponse, Error>({
    queryKey: ['guests'],
    queryFn: getGuests,
  });
};

export const useSearchGuests = (params: ISearchGuestParams) => {
  return useQuery<IGuestSearchResponse, Error>({
    queryKey: ['guests', 'search', params.q],
    queryFn: () => searchGuests(params),
    enabled: !!params.q,
  });
};

export const useGetGuestDetail = (params: IGetGuestDetailParams) => {
  return useQuery<IGuestDetailResponse, Error>({
    queryKey: ['guests', 'detail', params.id],
    queryFn: () => getGuestDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateGuest = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IGuestCreateResponse, Error, ICreateGuestBody>({
    mutationFn: createGuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
};

export const useUpdateGuest = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IGuestUpdateResponse, Error, { params: IUpdateGuestParams, body: IUpdateGuestBody }>({
    mutationFn: ({ params, body }) => updateGuest(params, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guests', 'detail', variables.params.id] });
    },
  });
};

export const useDeleteGuest = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IGuestDeleteResponse, Error, IDeleteGuestParams>({
    mutationFn: deleteGuest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guests', 'detail', variables.id] });
    },
  });
}; 
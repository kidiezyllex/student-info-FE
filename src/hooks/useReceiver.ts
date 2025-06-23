import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getReceivers,
  searchReceivers,
  getReceiverDetail,
  createReceiver,
  updateReceiver,
  deleteReceiver,
} from '@/api/receiver';
import {
  IReceiverListResponse,
  IReceiverSearchResponse,
  IReceiverDetailResponse,
  IReceiverCreateResponse,
  IReceiverUpdateResponse,
  IReceiverDeleteResponse,
  IReceiver,
  IReceiverSearchResult
} from '@/interface/response/receiver';
import {
  ISearchReceiversParams,
  IGetReceiverDetailParams,
  ICreateReceiverBody,
  IUpdateReceiverParams,
  IUpdateReceiverBody,
  IDeleteReceiverParams,
} from '@/interface/request/receiver';

export const useGetReceivers = () => {
  return useQuery<IReceiverListResponse, Error>({
    queryKey: ['receivers'],
    queryFn: getReceivers,
  });
};

export const useSearchReceivers = (params: ISearchReceiversParams) => {
  return useQuery<IReceiverSearchResponse, Error>({
    queryKey: ['receivers', 'search', params.q],
    queryFn: () => searchReceivers(params),
    enabled: !!params.q,
  });
};

export const useGetReceiverDetail = (params: IGetReceiverDetailParams) => {
  return useQuery<IReceiverDetailResponse, Error>({
    queryKey: ['receivers', 'detail', params.id],
    queryFn: () => getReceiverDetail(params),
    enabled: !!params.id,
  });
};

export const useCreateReceiver = () => {
  return useMutation<IReceiverCreateResponse, Error, ICreateReceiverBody>({
    mutationFn: createReceiver,
  });
};

export const useUpdateReceiver = () => {
  return useMutation<IReceiverUpdateResponse, Error, { params: IUpdateReceiverParams, body: IUpdateReceiverBody }>({
    mutationFn: ({ params, body }) => updateReceiver(params, body),
  });
};

export const useDeleteReceiver = () => {
  return useMutation<IReceiverDeleteResponse, Error, IDeleteReceiverParams>({
    mutationFn: deleteReceiver,
  });
}; 
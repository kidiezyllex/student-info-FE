import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllDatasetItems,
  getDatasetItemById,
  createDatasetItem,
  updateDatasetItem,
  deleteDatasetItem
} from '@/api/dataset';
import {
  IGetAllDatasetItemsResponse,
  IGetDatasetItemByIdResponse,
  ICreateDatasetItemResponse,
  IUpdateDatasetItemResponse,
  IDeleteDatasetItemResponse
} from '@/interface/response/dataset';
import { ICreateDatasetItemBody, IUpdateDatasetItemBody, IDatasetQueryParams } from '@/interface/request/dataset';

export const useGetAllDatasetItems = (page: number = 1, limit: number = 10, params?: Omit<IDatasetQueryParams, 'page' | 'limit'>) => {
  return useQuery<IGetAllDatasetItemsResponse, Error>({
    queryKey: ['dataset', page, limit, params],
    queryFn: () => getAllDatasetItems(page, limit, params),
  });
};

export const useGetDatasetItemById = (id: string) => {
  return useQuery<IGetDatasetItemByIdResponse, Error>({
    queryKey: ['dataset', id],
    queryFn: () => getDatasetItemById(id),
    enabled: !!id,
  });
};

export const useCreateDatasetItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateDatasetItemResponse, Error, ICreateDatasetItemBody>({
    mutationFn: createDatasetItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataset'] });
    },
  });
};

export const useUpdateDatasetItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateDatasetItemResponse, Error, { id: string; data: IUpdateDatasetItemBody }>({
    mutationFn: ({ id, data }) => updateDatasetItem(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dataset'] });
      queryClient.invalidateQueries({ queryKey: ['dataset', variables.id] });
    },
  });
};

export const useDeleteDatasetItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteDatasetItemResponse, Error, string>({
    mutationFn: deleteDatasetItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataset'] });
    },
  });
}; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActiveScholarships,
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship
} from '@/api/scholarship';
import {
  IGetActiveScholarshipsResponse,
  IGetAllScholarshipsResponse,
  IGetScholarshipByIdResponse,
  ICreateScholarshipResponse,
  IUpdateScholarshipResponse,
  IDeleteScholarshipResponse
} from '@/interface/response/scholarship';
import { ICreateScholarshipBody, IUpdateScholarshipBody, IScholarshipQueryParams } from '@/interface/request/scholarship';

export const useGetActiveScholarships = (params?: IScholarshipQueryParams) => {
  return useQuery<IGetActiveScholarshipsResponse, Error>({
    queryKey: ['scholarships', 'active', params],
    queryFn: () => getActiveScholarships(params),
  });
};

export const useGetAllScholarships = (params?: IScholarshipQueryParams) => {
  return useQuery<IGetAllScholarshipsResponse, Error>({
    queryKey: ['scholarships', 'all', params],
    queryFn: () => getAllScholarships(params),
  });
};

export const useGetScholarshipById = (id: string) => {
  return useQuery<IGetScholarshipByIdResponse, Error>({
    queryKey: ['scholarships', id],
    queryFn: () => getScholarshipById(id),
    enabled: !!id,
  });
};

export const useCreateScholarship = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateScholarshipResponse, Error, ICreateScholarshipBody>({
    mutationFn: createScholarship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
    },
  });
};

export const useUpdateScholarship = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateScholarshipResponse, Error, { id: string; data: IUpdateScholarshipBody }>({
    mutationFn: ({ id, data }) => updateScholarship(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
      queryClient.invalidateQueries({ queryKey: ['scholarships', variables.id] });
    },
  });
};

export const useDeleteScholarship = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteScholarshipResponse, Error, string>({
    mutationFn: deleteScholarship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
    },
  });
}; 

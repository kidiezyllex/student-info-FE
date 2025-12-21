import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '@/api/department';
import {
  IGetAllDepartmentsResponse,
  IGetDepartmentByIdResponse,
  ICreateDepartmentResponse,
  IUpdateDepartmentResponse,
  IDeleteDepartmentResponse
} from '@/interface/response/department';
import { ICreateDepartmentBody, IUpdateDepartmentBody } from '@/interface/request/department';

export const useGetAllDepartments = (page: number = 1, limit: number = 10, hasCoordinator?: boolean) => {
  return useQuery<IGetAllDepartmentsResponse, Error>({
    queryKey: ['departments', page, limit, hasCoordinator],
    queryFn: () => getAllDepartments(page, limit, hasCoordinator),
  });
};

export const useGetDepartmentById = (id: string) => {
  return useQuery<IGetDepartmentByIdResponse, Error>({
    queryKey: ['departments', id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateDepartmentResponse, Error, ICreateDepartmentBody>({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateDepartmentResponse, Error, { id: string; data: IUpdateDepartmentBody }>({
    mutationFn: ({ id, data }) => updateDepartment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments', variables.id] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteDepartmentResponse, Error, string>({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}; 
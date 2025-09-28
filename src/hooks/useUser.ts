import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProfile as getAuthProfile, 
  updateUserProfile as updateUserProfileLegacy,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getUsersByRole,
  getUsersByDepartment,
  updateUserProfileDetailed
} from '@/api/user';
import { getProfile } from '@/api/auth';
import { 
  IUserProfileResponse, 
  IUpdateUserProfileResponse,
  IGetAllUsersResponse,
  IGetUserByIdResponse,
  IGetUsersByRoleResponse,
  IGetUsersByDepartmentResponse,
  IUpdateUserResponse,
  IUpdateUserProfileDetailedResponse,
  IDeleteUserResponse,
  ICreateUserResponse
} from '@/interface/response/user';
import { IProfileResponse } from '@/interface/response/auth';
import { 
  IUpdateUserProfileBody, 
  IUpdateUserBody, 
  ICreateUserBody,
  IUpdateUserProfileDetailedBody 
} from '@/interface/request/user';

export const useGetUserProfile = (options?: { enabled?: boolean }) => {
  return useQuery<IProfileResponse, Error>({
    queryKey: ['user', 'profile'],
    queryFn: getProfile,
    ...options,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateUserProfileResponse, Error, IUpdateUserProfileBody>({
    mutationFn: updateUserProfileLegacy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery<IGetAllUsersResponse, Error>({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery<IGetUserByIdResponse, Error>({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateUserResponse, Error, { id: string; data: IUpdateUserBody }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteUserResponse, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateUserResponse, Error, ICreateUserBody>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useGetUsersByRole = (role: string) => {
  return useQuery<IGetUsersByRoleResponse, Error>({
    queryKey: ['users', 'role', role],
    queryFn: () => getUsersByRole(role),
    enabled: !!role,
  });
};

export const useGetUsersByDepartment = (departmentId: string) => {
  return useQuery<IGetUsersByDepartmentResponse, Error>({
    queryKey: ['users', 'department', departmentId],
    queryFn: () => getUsersByDepartment(departmentId),
    enabled: !!departmentId,
  });
};

export const useUpdateUserProfileDetailed = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateUserProfileDetailedResponse, Error, { id: string; data: IUpdateUserProfileDetailedBody }>({
    mutationFn: ({ id, data }) => updateUserProfileDetailed(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
}; 

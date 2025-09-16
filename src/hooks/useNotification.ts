import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getSavedNotifications,
  saveNotification,
  unsaveNotification
} from '@/api/notification';
import {
  IGetNotificationsResponse,
  IGetNotificationByIdResponse,
  ICreateNotificationResponse,
  IUpdateNotificationResponse,
  IDeleteNotificationResponse,
  IGetSavedNotificationsResponse,
  ISaveNotificationResponse,
  IUnsaveNotificationResponse
} from '@/interface/response/notification';
import { ICreateNotificationBody, IUpdateNotificationBody, INotificationQueryParams } from '@/interface/request/notification';

export const useGetNotifications = (params?: INotificationQueryParams) => {
  return useQuery<IGetNotificationsResponse, Error>({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
  });
};

export const useGetNotificationById = (id: string) => {
  return useQuery<IGetNotificationByIdResponse, Error>({
    queryKey: ['notifications', id],
    queryFn: () => getNotificationById(id),
    enabled: !!id,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateNotificationResponse, Error, ICreateNotificationBody>({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateNotificationResponse, Error, { id: string; data: IUpdateNotificationBody }>({
    mutationFn: ({ id, data }) => updateNotification(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', variables.id] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteNotificationResponse, Error, string>({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useGetSavedNotifications = () => {
  return useQuery<IGetSavedNotificationsResponse, Error>({
    queryKey: ['notifications', 'saved'],
    queryFn: getSavedNotifications,
  });
};

export const useSaveNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ISaveNotificationResponse, Error, string>({
    mutationFn: saveNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'saved'] });
    },
  });
};

export const useUnsaveNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUnsaveNotificationResponse, Error, string>({
    mutationFn: unsaveNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'saved'] });
    },
  });
}; 

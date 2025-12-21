import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  getConversationHistory,
  sendMessage,
  markMessageAsRead,
  markAllMessagesAsRead
} from '@/api/message';
import {
  IGetConversationsResponse,
  IGetConversationHistoryResponse,
  ISendMessageResponse,
  IMarkMessageAsReadResponse,
  IMarkAllMessagesAsReadResponse
} from '@/interface/response/message';
import { ISendMessageBody } from '@/interface/request/message';

export const useGetConversations = (page: number = 1, limit: number = 10) => {
  return useQuery<IGetConversationsResponse, Error>({
    queryKey: ['messages', 'conversations', page, limit],
    queryFn: () => getConversations(page, limit),
  });
};

export const useGetConversationHistory = (userId: string) => {
  return useQuery<IGetConversationHistoryResponse, Error>({
    queryKey: ['messages', 'conversation', userId],
    queryFn: () => getConversationHistory(userId),
    enabled: !!userId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ISendMessageResponse, Error, ISendMessageBody>({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'conversation', data.data.receiverId] });
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IMarkMessageAsReadResponse, Error, string>({
    mutationFn: markMessageAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useMarkAllMessagesAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IMarkAllMessagesAsReadResponse, Error, string>({
    mutationFn: markAllMessagesAsRead,
    onSuccess: (data, userId) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'conversation', userId] });
    },
  });
}; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  askAI,
  getChatHistory,
  getChatSession,
  rateAIResponse,
  deleteChatSession
} from '@/api/chat';
import {
  IAskAIResponse,
  IGetChatHistoryResponse,
  IGetChatSessionResponse,
  IRateAIResponse,
  IDeleteChatSessionResponse
} from '@/interface/response/chat';
import { IAskAIBody, IRateAIBody } from '@/interface/request/chat';

export const useAskAI = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IAskAIResponse, Error, IAskAIBody>({
    mutationFn: askAI,
    onSuccess: (data) => {
      // Invalidate chat history to include new session
      queryClient.invalidateQueries({ queryKey: ['chat', 'history'] });
      // Invalidate the specific session if it exists
      queryClient.invalidateQueries({ queryKey: ['chat', 'session', data.data.sessionId] });
    },
  });
};

export const useGetChatHistory = () => {
  return useQuery<IGetChatHistoryResponse, Error>({
    queryKey: ['chat', 'history'],
    queryFn: getChatHistory,
  });
};

export const useGetChatSession = (id: string) => {
  return useQuery<IGetChatSessionResponse, Error>({
    queryKey: ['chat', 'session', id],
    queryFn: () => getChatSession(id),
    enabled: !!id,
  });
};

export const useRateAIResponse = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IRateAIResponse, Error, IRateAIBody>({
    mutationFn: rateAIResponse,
    onSuccess: (data, variables) => {
      // Invalidate the specific session to reflect rating changes
      queryClient.invalidateQueries({ queryKey: ['chat', 'session', variables.sessionId] });
    },
  });
};

export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteChatSessionResponse, Error, string>({
    mutationFn: deleteChatSession,
    onSuccess: () => {
      // Invalidate chat history to remove deleted session
      queryClient.invalidateQueries({ queryKey: ['chat', 'history'] });
    },
  });
}; 
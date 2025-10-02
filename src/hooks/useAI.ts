import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  trainAI,
  getTrainingHistory
} from '@/api/ai';
import {
  ITrainAIResponse,
  IGetTrainingHistoryResponse
} from '@/interface/response/ai';
import { ITrainAIBody } from '@/interface/request/ai';

export const useTrainAI = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ITrainAIResponse, Error, ITrainAIBody>({
    mutationFn: trainAI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'training-history'] });
    },
  });
};

export const useGetTrainingHistory = () => {
  return useQuery<IGetTrainingHistoryResponse, Error>({
    queryKey: ['ai', 'training-history'],
    queryFn: getTrainingHistory,
  });
}; 
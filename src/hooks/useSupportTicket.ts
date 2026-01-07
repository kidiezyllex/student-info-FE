import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSupportTicket,
  getSupportTickets,
  getSupportTicketById,
  updateTicketStatus,
  addTicketNote,
  resolveTicket,
  assignTicket,
  deleteTicket,
  getTicketStats
} from '@/api/support-ticket';
import {
  ICreateSupportTicketResponse,
  IGetSupportTicketsResponse,
  IGetSupportTicketDetailResponse,
  IUpdateTicketStatusResponse,
  IAddTicketNoteResponse,
  IResolveTicketResponse,
  IAssignTicketResponse,
  IDeleteTicketResponse,
  ITicketStatsResponse
} from '@/interface/response/support-ticket';
import {
  ICreateSupportTicketBody,
  IUpdateTicketStatusBody,
  IAddTicketNoteBody,
  IResolveTicketBody,
  IAssignTicketBody,
  IGetSupportTicketsParams
} from '@/interface/request/support-ticket';

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<ICreateSupportTicketResponse, Error, ICreateSupportTicketBody>({
    mutationFn: createSupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
  });
};

export const useGetSupportTickets = (params?: IGetSupportTicketsParams) => {
  return useQuery<IGetSupportTicketsResponse, Error>({
    queryKey: ['support-tickets', params],
    queryFn: () => getSupportTickets(params),
  });
};

export const useGetSupportTicketById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery<IGetSupportTicketDetailResponse, Error>({
    queryKey: ['support-tickets', id],
    queryFn: () => getSupportTicketById(id),
    enabled: !!id && (options?.enabled !== false),
    ...options,
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<IUpdateTicketStatusResponse, Error, { id: string; data: IUpdateTicketStatusBody }>({
    mutationFn: ({ id, data }) => updateTicketStatus(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets', 'stats'] });
    },
  });
};

export const useAddTicketNote = () => {
  const queryClient = useQueryClient();

  return useMutation<IAddTicketNoteResponse, Error, { id: string; data: IAddTicketNoteBody }>({
    mutationFn: ({ id, data }) => addTicketNote(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets', variables.id] });
    },
  });
};

export const useResolveTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<IResolveTicketResponse, Error, { id: string; data: IResolveTicketBody }>({
    mutationFn: ({ id, data }) => resolveTicket(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets', 'stats'] });
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<IAssignTicketResponse, Error, { id: string; data: IAssignTicketBody }>({
    mutationFn: ({ id, data }) => assignTicket(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets', variables.id] });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<IDeleteTicketResponse, Error, string>({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets', 'stats'] });
    },
  });
};

export const useGetTicketStats = (options?: { enabled?: boolean }) => {
  return useQuery<ITicketStatsResponse, Error>({
    queryKey: ['support-tickets', 'stats'],
    queryFn: getTicketStats,
    ...options,
  });
};

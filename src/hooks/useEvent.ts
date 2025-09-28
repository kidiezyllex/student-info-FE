import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUpcomingEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '@/api/event';
import {
  IGetUpcomingEventsResponse,
  IGetAllEventsResponse,
  IGetEventByIdResponse,
  ICreateEventResponse,
  IUpdateEventResponse,
  IDeleteEventResponse
} from '@/interface/response/event';
import { ICreateEventBody, IUpdateEventBody, IEventQueryParams } from '@/interface/request/event';

export const useGetUpcomingEvents = (params?: IEventQueryParams) => {
  return useQuery<IGetUpcomingEventsResponse, Error>({
    queryKey: ['events', 'upcoming', params],
    queryFn: () => getUpcomingEvents(params),
  });
};

export const useGetAllEvents = (params?: IEventQueryParams) => {
  return useQuery<IGetAllEventsResponse, Error>({
    queryKey: ['events', 'all', params],
    queryFn: () => getAllEvents(params),
  });
};

export const useGetEventById = (id: string) => {
  return useQuery<IGetEventByIdResponse, Error>({
    queryKey: ['events', id],
    queryFn: () => getEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ICreateEventResponse, Error, ICreateEventBody>({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IUpdateEventResponse, Error, { id: string; data: IUpdateEventBody }>({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IDeleteEventResponse, Error, string>({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}; 

import { useQuery } from '@tanstack/react-query';
import { getCalendarEvents } from '@/api/calendar';
import { IGetCalendarEventsResponse } from '@/interface/response/calendar';
import { ICalendarQueryParams } from '@/interface/request/calendar';

export const useGetCalendarEvents = (params: ICalendarQueryParams) => {
  return useQuery<IGetCalendarEventsResponse, Error>({
    queryKey: ['calendar', 'events', params],
    queryFn: () => getCalendarEvents(params),
    enabled: !!params.calendarId,
  });
};

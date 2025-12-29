export interface ICalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  creator?: {
    email: string;
    displayName?: string;
  };
  organizer?: {
    email: string;
    displayName?: string;
    self?: boolean;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  htmlLink: string;
  status: string;
  created: string;
  updated: string;
}

export interface IGetCalendarEventsResponse {
  success: boolean;
  message: string;
  data: {
    calendarId: string;
    calendarName: string;
    totalEvents: number;
    events: ICalendarEvent[];
  };
}

import { sendGet } from "./axios";
import { IGetCalendarEventsResponse } from "@/interface/response/calendar";
import { ICalendarQueryParams } from "@/interface/request/calendar";

export const getCalendarEvents = async (params: ICalendarQueryParams): Promise<IGetCalendarEventsResponse> => {
  const res = await sendGet(`/calendar/events`, params);
  return res;
};

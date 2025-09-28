import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
  IGetUpcomingEventsResponse,
  IGetAllEventsResponse,
  IGetEventByIdResponse,
  ICreateEventResponse,
  IUpdateEventResponse,
  IDeleteEventResponse
} from "@/interface/response/event";
import { ICreateEventBody, IUpdateEventBody, IEventQueryParams } from "@/interface/request/event";

export const getUpcomingEvents = async (params?: IEventQueryParams): Promise<IGetUpcomingEventsResponse> => {
  const res = await sendGet(`/events`, params);
  return res;
};

export const getAllEvents = async (params?: IEventQueryParams): Promise<IGetAllEventsResponse> => {
  const res = await sendGet(`/events/all`, params);
  return res;
};

export const getEventById = async (id: string): Promise<IGetEventByIdResponse> => {
  const res = await sendGet(`/events/${id}`);
  return res;
};

export const createEvent = async (body: ICreateEventBody): Promise<ICreateEventResponse> => {
  const res = await sendPost(`/events`, body);
  return res;
};

export const updateEvent = async (id: string, body: IUpdateEventBody): Promise<IUpdateEventResponse> => {
  const res = await sendPut(`/events/${id}`, body);
  return res;
};

export const deleteEvent = async (id: string): Promise<IDeleteEventResponse> => {
  const res = await sendDelete(`/events/${id}`);
  return res;
}; 
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
  IGetNotificationsResponse,
  IGetNotificationByIdResponse,
  ICreateNotificationResponse,
  IUpdateNotificationResponse,
  IDeleteNotificationResponse,
  IGetSavedNotificationsResponse,
  ISaveNotificationResponse,
  IUnsaveNotificationResponse
} from "@/interface/response/notification";
import { ICreateNotificationBody, IUpdateNotificationBody, INotificationQueryParams } from "@/interface/request/notification";

export const getNotifications = async (page: number = 1, limit: number = 10, params?: Omit<INotificationQueryParams, 'page' | 'limit'>): Promise<IGetNotificationsResponse> => {
  const res = await sendGet(`/notifications`, { ...params, page, limit });
  return res;
};

export const getNotificationById = async (id: string): Promise<IGetNotificationByIdResponse> => {
  const res = await sendGet(`/notifications/${id}`);
  return res;
};

export const createNotification = async (body: ICreateNotificationBody): Promise<ICreateNotificationResponse> => {
  const res = await sendPost(`/notifications`, body);
  return res;
};

export const updateNotification = async (id: string, body: IUpdateNotificationBody): Promise<IUpdateNotificationResponse> => {
  const res = await sendPut(`/notifications/${id}`, body);
  return res;
};

export const deleteNotification = async (id: string): Promise<IDeleteNotificationResponse> => {
  const res = await sendDelete(`/notifications/${id}`);
  return res;
};

export const getSavedNotifications = async (page: number = 1, limit: number = 10): Promise<IGetSavedNotificationsResponse> => {
  const res = await sendGet(`/notifications/saved`, { page, limit });
  return res;
};

export const saveNotification = async (id: string): Promise<ISaveNotificationResponse> => {
  const res = await sendPut(`/notifications/${id}/save`);
  return res;
};

export const unsaveNotification = async (id: string): Promise<IUnsaveNotificationResponse> => {
  const res = await sendPut(`/notifications/${id}/unsave`);
  return res;
}; 
import { sendGet, sendPost, sendPut } from "./axios";
import {
  IGetConversationsResponse,
  IGetConversationHistoryResponse,
  ISendMessageResponse,
  IMarkMessageAsReadResponse,
  IMarkAllMessagesAsReadResponse
} from "@/interface/response/message";
import { ISendMessageBody } from "@/interface/request/message";

export const getConversations = async (page: number = 1, limit: number = 10): Promise<IGetConversationsResponse> => {
  const res = await sendGet(`/messages`, { page, limit });
  return res;
};

export const getConversationHistory = async (userId: string): Promise<IGetConversationHistoryResponse> => {
  const res = await sendGet(`/messages/${userId}`);
  return res;
};

export const sendMessage = async (body: ISendMessageBody): Promise<ISendMessageResponse> => {
  const res = await sendPost(`/messages`, body);
  return res;
};

export const markMessageAsRead = async (messageId: string): Promise<IMarkMessageAsReadResponse> => {
  const res = await sendPut(`/messages/${messageId}/read`);
  return res;
};

export const markAllMessagesAsRead = async (userId: string): Promise<IMarkAllMessagesAsReadResponse> => {
  const res = await sendPut(`/messages/${userId}/read-all`);
  return res;
}; 
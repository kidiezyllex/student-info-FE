import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
  IAskAIResponse,
  IGetChatHistoryResponse,
  IGetChatSessionResponse,
  IRateAIResponse,
  IDeleteChatSessionResponse
} from "@/interface/response/chat";
import { IAskAIBody, IRateAIBody } from "@/interface/request/chat";

export const askAI = async (body: IAskAIBody): Promise<IAskAIResponse> => {
  const res = await sendPost(`/chat/ask`, body);
  return res;
};

export const getChatHistory = async (): Promise<IGetChatHistoryResponse> => {
  const res = await sendGet(`/chat/history`);
  return res;
};

export const getChatSession = async (id: string): Promise<IGetChatSessionResponse> => {
  const res = await sendGet(`/chat/session/${id}`);
  return res;
};

export const rateAIResponse = async (body: IRateAIBody): Promise<IRateAIResponse> => {
  const res = await sendPut(`/chat/rate`, body);
  return res;
};

export const deleteChatSession = async (id: string): Promise<IDeleteChatSessionResponse> => {
  const res = await sendDelete(`/chat/session/${id}`);
  return res;
}; 
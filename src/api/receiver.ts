import { sendGet, sendPost, sendPatch, sendDelete } from "./axios";
import { IReceiverListResponse, IReceiverSearchResponse, IReceiverDetailResponse, IReceiverCreateResponse, IReceiverUpdateResponse, IReceiverDeleteResponse } from "@/interface/response/receiver";
import { ISearchReceiversParams, IGetReceiverDetailParams, ICreateReceiverBody, IUpdateReceiverParams, IUpdateReceiverBody, IDeleteReceiverParams } from "@/interface/request/receiver";

export const getReceivers = async (): Promise<IReceiverListResponse> => {
  const res = await sendGet(`/receivers`);
  return res;
};

export const searchReceivers = async (params: ISearchReceiversParams): Promise<IReceiverSearchResponse> => {
  const res = await sendGet(`/receivers/search?q=${params.q}`);
  return res;
};

export const getReceiverDetail = async (params: IGetReceiverDetailParams): Promise<IReceiverDetailResponse> => {
  const res = await sendGet(`/receivers/${params.id}`);
  return res;
};

export const createReceiver = async (body: ICreateReceiverBody): Promise<IReceiverCreateResponse> => {
  const res = await sendPost(`/receivers`, body);
  return res;
};

export const updateReceiver = async (params: IUpdateReceiverParams, body: IUpdateReceiverBody): Promise<IReceiverUpdateResponse> => {
  const res = await sendPatch(`/receivers/${params.id}`, body);
  return res;
};

export const deleteReceiver = async (params: IDeleteReceiverParams): Promise<IReceiverDeleteResponse> => {
  const res = await sendDelete(`/receivers/${params.id}`);
  return res;
}; 
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
  IGetAllDatasetItemsResponse,
  IGetDatasetItemByIdResponse,
  ICreateDatasetItemResponse,
  IUpdateDatasetItemResponse,
  IDeleteDatasetItemResponse
} from "@/interface/response/dataset";
import { ICreateDatasetItemBody, IUpdateDatasetItemBody, IDatasetQueryParams } from "@/interface/request/dataset";

export const getAllDatasetItems = async (params?: IDatasetQueryParams): Promise<IGetAllDatasetItemsResponse> => {
  const res = await sendGet(`/dataset`, params);
  return res;
};

export const getDatasetItemById = async (id: string): Promise<IGetDatasetItemByIdResponse> => {
  const res = await sendGet(`/dataset/${id}`);
  return res;
};

export const createDatasetItem = async (body: ICreateDatasetItemBody): Promise<ICreateDatasetItemResponse> => {
  const res = await sendPost(`/dataset`, body);
  return res;
};

export const updateDatasetItem = async (id: string, body: IUpdateDatasetItemBody): Promise<IUpdateDatasetItemResponse> => {
  const res = await sendPut(`/dataset/${id}`, body);
  return res;
};

export const deleteDatasetItem = async (id: string): Promise<IDeleteDatasetItemResponse> => {
  const res = await sendDelete(`/dataset/${id}`);
  return res;
}; 
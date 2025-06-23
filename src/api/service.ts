import { sendGet, sendPost, sendPatch, sendDelete } from './axios';
import {
  IServiceListResponse,
  IServiceSearchResponse,
  IServiceDetailResponse,
  IServiceCreateResponse,
  IServiceUpdateResponse,
  IServiceDeleteResponse
} from '@/interface/response/service';
import {
  IGetServiceDetailParams,
  ISearchServiceParams,
  ICreateServiceBody,
  IUpdateServiceParams,
  IUpdateServiceBody,
  IDeleteServiceParams
} from '@/interface/request/service';

export const getServices = async (): Promise<IServiceListResponse> => {
  const res = await sendGet('/services');
  return res;
};

export const searchServices = async (params: ISearchServiceParams): Promise<IServiceSearchResponse> => {
  const res = await sendGet(`/services/search?q=${params.q}`);
  return res;
};

export const getServiceDetail = async (params: IGetServiceDetailParams): Promise<IServiceDetailResponse> => {
  const res = await sendGet(`/services/${params.id}`);
  return res;
};

export const createService = async (body: ICreateServiceBody): Promise<IServiceCreateResponse> => {
  const res = await sendPost('/services', body);
  return res;
};

export const updateService = async (params: IUpdateServiceParams, body: IUpdateServiceBody): Promise<IServiceUpdateResponse> => {
  const res = await sendPatch(`/services/${params.id}`, body);
  return res;
};

export const deleteService = async (params: IDeleteServiceParams): Promise<IServiceDeleteResponse> => {
  const res = await sendDelete(`/services/${params.id}`);
  return res;
}; 
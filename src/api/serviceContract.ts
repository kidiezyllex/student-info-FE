import { sendGet, sendPost, sendPatch, sendDelete } from "./axios";
import {
  IServiceContractListResponse,
  IServiceContractDetailResponse,
  IServiceContractCreateResponse,
  IServiceContractUpdateResponse,
  IServiceContractDeleteResponse,
  IServiceContractSearchResponse
} from "@/interface/response/serviceContract";
import {
  IGetServiceContractByHomeParams,
  IGetServiceContractByGuestParams,
  IGetServiceContractByHomeContractParams,
  IGetServiceContractByServiceParams,
  IGetServiceContractDetailParams,
  ICreateServiceContractBody,
  IUpdateServiceContractParams,
  IUpdateServiceContractBody,
  IDeleteServiceContractParams,
  ISearchServiceContractParams
} from "@/interface/request/serviceContract";

export const getServiceContracts = async (): Promise<IServiceContractListResponse> => {
  const res = await sendGet(`/service-contracts`);
  return res;
};

export const searchServiceContracts = async (params: ISearchServiceContractParams): Promise<IServiceContractSearchResponse> => {
  const res = await sendGet(`/service-contracts/search?q=${params.q}`);
  return res;
};

export const getServiceContractsByHome = async (params: IGetServiceContractByHomeParams): Promise<IServiceContractListResponse> => {
  const res = await sendGet(`/service-contracts/home/${params.homeId}`);
  return res;
};

export const getServiceContractsByGuest = async (params: IGetServiceContractByGuestParams): Promise<IServiceContractListResponse> => {
  const res = await sendGet(`/service-contracts/guest/${params.guestId}`);
  return res;
};

export const getServiceContractsByHomeContract = async (params: IGetServiceContractByHomeContractParams): Promise<IServiceContractListResponse> => {
  const res = await sendGet(`/service-contracts/homecontract/${params.homeContractId}`);
  return res;
};

export const getServiceContractsByService = async (params: IGetServiceContractByServiceParams): Promise<IServiceContractListResponse> => {
  const res = await sendGet(`/service-contracts/service/${params.serviceId}`);
  return res;
};

export const getServiceContractDetail = async (params: IGetServiceContractDetailParams): Promise<IServiceContractDetailResponse> => {
  const res = await sendGet(`/service-contracts/${params.id}`);
  return res;
};

export const createServiceContract = async (body: ICreateServiceContractBody): Promise<IServiceContractCreateResponse> => {
  const res = await sendPost(`/service-contracts`, body);
  return res;
};

export const updateServiceContract = async (params: IUpdateServiceContractParams, body: IUpdateServiceContractBody): Promise<IServiceContractUpdateResponse> => {
  const res = await sendPatch(`/service-contracts/${params.id}`, body);
  return res;
};

export const deleteServiceContract = async (params: IDeleteServiceContractParams): Promise<IServiceContractDeleteResponse> => {
  const res = await sendDelete(`/service-contracts/${params.id}`);
  return res;
}; 
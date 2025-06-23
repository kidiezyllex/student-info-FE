import { sendGet, sendPost, sendPatch, sendDelete } from "./axios";
import {
  IHomeContractListResponse,
  IHomeContractSearchResponse,
  IHomeContractDetailResponse,
  IHomeContractCreateResponse,
  IHomeContractUpdateResponse,
  IHomeContractDeleteResponse
} from "@/interface/response/homeContract";
import {
  IGetHomeContractByHomeParams,
  IGetHomeContractByGuestParams,
  IGetHomeContractDetailParams,
  ISearchHomeContractParams,
  ICreateHomeContractBody,
  IUpdateHomeContractParams,
  IUpdateHomeContractBody,
  IDeleteHomeContractParams
} from "@/interface/request/homeContract";

export const getHomeContracts = async (): Promise<IHomeContractListResponse> => {
  const res = await sendGet(`/home-contracts`);
  return res;
};

export const searchHomeContracts = async (params: ISearchHomeContractParams): Promise<IHomeContractSearchResponse> => {
  const res = await sendGet(`/home-contracts/search?q=${params.q}`);
  return res;
};

export const getHomeContractsByHome = async (params: IGetHomeContractByHomeParams): Promise<IHomeContractListResponse> => {
  const res = await sendGet(`/home-contracts/home/${params.homeId}`);
  return res;
};

export const getHomeContractsByGuest = async (params: IGetHomeContractByGuestParams): Promise<IHomeContractListResponse> => {
  const res = await sendGet(`/home-contracts/guest/${params.guestId}`);
  return res;
};

export const getHomeContractDetail = async (params: IGetHomeContractDetailParams): Promise<IHomeContractDetailResponse> => {
  const res = await sendGet(`/home-contracts/${params.id}`);
  return res;
};

export const createHomeContract = async (body: ICreateHomeContractBody): Promise<IHomeContractCreateResponse> => {
  const res = await sendPost(`/home-contracts`, body);
  return res;
};

export const updateHomeContract = async (params: IUpdateHomeContractParams, body: IUpdateHomeContractBody): Promise<IHomeContractUpdateResponse> => {
  const res = await sendPatch(`/home-contracts/${params.id}`, body);
  return res;
};

export const deleteHomeContract = async (params: IDeleteHomeContractParams): Promise<IHomeContractDeleteResponse> => {
  const res = await sendDelete(`/home-contracts/${params.id}`);
  return res;
}; 
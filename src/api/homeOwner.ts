import { sendGet, sendPost, sendPatch, sendDelete } from "./axios";
import {
  IHomeOwnerListResponse,
  IHomeOwnerSearchResponse,
  IHomeOwnerDetailResponse,
  IHomeOwnerCreateResponse,
  IHomeOwnerUpdateResponse,
  IHomeOwnerDeleteResponse
} from "@/interface/response/homeOwner";
import {
  IGetHomeOwnerDetailParams,
  ISearchHomeOwnerParams,
  ICreateHomeOwnerBody,
  IUpdateHomeOwnerParams,
  IUpdateHomeOwnerBody,
  IDeleteHomeOwnerParams
} from "@/interface/request/homeOwner";

export const getHomeOwners = async (): Promise<IHomeOwnerListResponse> => {
  const res = await sendGet(`/home-owners`);
  return res;
};

export const searchHomeOwners = async (params: ISearchHomeOwnerParams): Promise<IHomeOwnerSearchResponse> => {
  const res = await sendGet(`/home-owners/search?q=${params.q}`);
  return res;
};

export const getHomeOwnerDetail = async (params: IGetHomeOwnerDetailParams): Promise<IHomeOwnerDetailResponse> => {
  const res = await sendGet(`/home-owners/${params.id}`);
  return res;
};

export const createHomeOwner = async (body: ICreateHomeOwnerBody): Promise<IHomeOwnerCreateResponse> => {
  const res = await sendPost(`/home-owners`, body);
  return res;
};

export const updateHomeOwner = async (params: IUpdateHomeOwnerParams, body: IUpdateHomeOwnerBody): Promise<IHomeOwnerUpdateResponse> => {
  const res = await sendPatch(`/home-owners/${params.id}`, body);
  return res;
};

export const deleteHomeOwner = async (params: IDeleteHomeOwnerParams): Promise<IHomeOwnerDeleteResponse> => {
  const res = await sendDelete(`/home-owners/${params.id}`);
  return res;
}; 
import { sendGet, sendPost, sendPatch, sendDelete } from "./axios";
import {
  IHomeListResponse,
  IHomeAvailableListResponse,
  IHomeSearchResponse,
  IHomeListByOwnerResponse,
  IHomeDetailResponse,
  IHomeCreateResponse,
  IHomeUpdateResponse,
  IHomeDeleteResponse
} from "@/interface/response/home";
import {
  IGetHomeDetailParams,
  ISearchHomeParams,
  ISearchHomeByAmenitiesParams,
  IGetHomeByOwnerParams,
  ICreateHomeBody,
  IUpdateHomeParams,
  IUpdateHomeBody,
  IDeleteHomeParams
} from "@/interface/request/home";

export const getHomes = async (): Promise<IHomeListResponse> => {
  const res = await sendGet(`/homes`);
  return res;
};

export const getAvailableHomes = async (): Promise<IHomeAvailableListResponse> => {
  const res = await sendGet(`/homes/available`);
  return res;
};

export const getAvailableHomesForRent = async (): Promise<IHomeAvailableListResponse> => {
  const res = await sendGet(`/homes/available-for-rent`);
  return res;
};

export const searchHomes = async (params: ISearchHomeParams): Promise<IHomeSearchResponse> => {
  const res = await sendGet(`/homes/search?q=${params.q}`);
  return res;
};

export const searchHomesByAmenities = async (params: ISearchHomeByAmenitiesParams): Promise<IHomeSearchResponse> => {
  const res = await sendGet(`/homes/search-by-amenities?amenities=${params.amenities}`);
  return res;
};

export const getHomesByOwner = async (params: IGetHomeByOwnerParams): Promise<IHomeListByOwnerResponse> => {
  const res = await sendGet(`/homes/homeowner/${params.homeOwnerId}`);
  return res;
};

export const getHomeDetail = async (params: IGetHomeDetailParams): Promise<IHomeDetailResponse> => {
  const res = await sendGet(`/homes/${params.id}`);
  return res;
};

export const createHome = async (body: ICreateHomeBody): Promise<IHomeCreateResponse> => {
  const res = await sendPost(`/homes`, body);
  return res;
};

export const updateHome = async (params: IUpdateHomeParams, body: IUpdateHomeBody): Promise<IHomeUpdateResponse> => {
  const res = await sendPatch(`/homes/${params.id}`, body);
  return res;
};

export const deleteHome = async (params: IDeleteHomeParams): Promise<IHomeDeleteResponse> => {
  const res = await sendDelete(`/homes/${params.id}`);
  return res;
}; 
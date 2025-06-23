import { sendGet, sendPost, sendPatch, sendDelete } from "./axios";
import {
  IGuestListResponse,
  IGuestSearchResponse,
  IGuestDetailResponse,
  IGuestCreateResponse,
  IGuestUpdateResponse,
  IGuestDeleteResponse
} from "@/interface/response/guest";
import {
  IGetGuestDetailParams,
  ISearchGuestParams,
  ICreateGuestBody,
  IUpdateGuestParams,
  IUpdateGuestBody,
  IDeleteGuestParams,
  IGetHomeContractsByGuestParams
} from "@/interface/request/guest";

export const getGuests = async (): Promise<IGuestListResponse> => {
  const res = await sendGet(`/guests`);
  return res;
};

export const searchGuests = async (params: ISearchGuestParams): Promise<IGuestSearchResponse> => {
  const res = await sendGet(`/guests/search?q=${params.q}`);
  return res;
};

export const getGuestDetail = async (params: IGetGuestDetailParams): Promise<IGuestDetailResponse> => {
  const res = await sendGet(`/guests/${params.id}`);
  return res;
};

export const createGuest = async (body: ICreateGuestBody): Promise<IGuestCreateResponse> => {
  const res = await sendPost(`/guests`, body);
  return res;
};

export const updateGuest = async (params: IUpdateGuestParams, body: IUpdateGuestBody): Promise<IGuestUpdateResponse> => {
  const res = await sendPatch(`/guests/${params.id}`, body);
  return res;
};

export const deleteGuest = async (params: IDeleteGuestParams): Promise<IGuestDeleteResponse> => {
  const res = await sendDelete(`/guests/${params.id}`);
  return res;
}; 
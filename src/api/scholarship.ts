import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
  IGetActiveScholarshipsResponse,
  IGetAllScholarshipsResponse,
  IGetScholarshipByIdResponse,
  ICreateScholarshipResponse,
  IUpdateScholarshipResponse,
  IDeleteScholarshipResponse
} from "@/interface/response/scholarship";
import { ICreateScholarshipBody, IUpdateScholarshipBody, IScholarshipQueryParams } from "@/interface/request/scholarship";

export const getActiveScholarships = async (page: number = 1, limit: number = 10, params?: Omit<IScholarshipQueryParams, 'page' | 'limit'>): Promise<IGetActiveScholarshipsResponse> => {
  const res = await sendGet(`/scholarships`, { ...params, page, limit });
  return res;
};

export const getAllScholarships = async (page: number = 1, limit: number = 10, params?: Omit<IScholarshipQueryParams, 'page' | 'limit'>): Promise<IGetAllScholarshipsResponse> => {
  const res = await sendGet(`/scholarships/all`, { ...params, page, limit });
  return res;
};

export const getScholarshipById = async (id: string): Promise<IGetScholarshipByIdResponse> => {
  const res = await sendGet(`/scholarships/${id}`);
  return res;
};

export const createScholarship = async (body: ICreateScholarshipBody): Promise<ICreateScholarshipResponse> => {
  const res = await sendPost(`/scholarships`, body);
  return res;
};

export const updateScholarship = async (id: string, body: IUpdateScholarshipBody): Promise<IUpdateScholarshipResponse> => {
  const res = await sendPut(`/scholarships/${id}`, body);
  return res;
};

export const deleteScholarship = async (id: string): Promise<IDeleteScholarshipResponse> => {
  const res = await sendDelete(`/scholarships/${id}`);
  return res;
}; 
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
  IGetAllDepartmentsResponse,
  IGetDepartmentByIdResponse,
  ICreateDepartmentResponse,
  IUpdateDepartmentResponse,
  IDeleteDepartmentResponse
} from "@/interface/response/department";
import { ICreateDepartmentBody, IUpdateDepartmentBody } from "@/interface/request/department";

export const getAllDepartments = async (): Promise<IGetAllDepartmentsResponse> => {
  const res = await sendGet(`/departments`);
  return res;
};

export const getDepartmentById = async (id: string): Promise<IGetDepartmentByIdResponse> => {
  const res = await sendGet(`/departments/${id}`);
  return res;
};

export const createDepartment = async (body: ICreateDepartmentBody): Promise<ICreateDepartmentResponse> => {
  const res = await sendPost(`/departments`, body);
  return res;
};

export const updateDepartment = async (id: string, body: IUpdateDepartmentBody): Promise<IUpdateDepartmentResponse> => {
  const res = await sendPut(`/departments/${id}`, body);
  return res;
};

export const deleteDepartment = async (id: string): Promise<IDeleteDepartmentResponse> => {
  const res = await sendDelete(`/departments/${id}`);
  return res;
}; 
import { sendGet, sendPut, sendDelete, sendPost } from "./axios";
import { 
  IUserProfileResponse, 
  IUpdateUserProfileResponse,
  IGetAllUsersResponse,
  IGetUserByIdResponse,
  IGetUsersByRoleResponse,
  IGetUsersByDepartmentResponse,
  IUpdateUserResponse,
  IUpdateUserProfileDetailedResponse,
  IDeleteUserResponse,
  ICreateUserResponse
} from "@/interface/response/user";
import { 
  IUpdateUserProfileBody, 
  IUpdateUserBody, 
  ICreateUserBody,
  IUpdateUserProfileDetailedBody 
} from "@/interface/request/user";

export const getProfile = async (): Promise<IUserProfileResponse> => {
  const res = await sendGet(`/user/profile`);
  return res;
};

export const updateUserProfile = async (body: IUpdateUserProfileBody): Promise<IUpdateUserProfileResponse> => {
  const res = await sendPut(`/user/update-profile`, body);
  return res;
};

export const getAllUsers = async (page: number = 1, limit: number = 10, role?: string, department?: string): Promise<IGetAllUsersResponse> => {
  const params: { page: number; limit: number; role?: string; department?: string } = { page, limit };
  if (role && role !== "all") {
    params.role = role;
  }
  if (department && department !== "all") {
    params.department = department;
  }
  const res = await sendGet(`/users`, params);
  return res;
};

export const getUserById = async (id: string): Promise<IGetUserByIdResponse> => {
  const res = await sendGet(`/users/${id}`);
  return res;
};

export const updateUser = async (id: string, body: IUpdateUserBody): Promise<IUpdateUserResponse> => {
  const res = await sendPut(`/users/${id}`, body);
  return res;
};

export const deleteUser = async (id: string): Promise<IDeleteUserResponse> => {
  const res = await sendDelete(`/users/${id}`);
  return res;
};

export const createUser = async (body: ICreateUserBody): Promise<ICreateUserResponse> => {
  const res = await sendPost(`/users`, body);
  return res;
};

// New API functions based on updated specification
export const getUsersByRole = async (role: string): Promise<IGetUsersByRoleResponse> => {
  const res = await sendGet(`/users/role/${role}`);
  return res;
};

export const getUsersByDepartment = async (departmentId: string): Promise<IGetUsersByDepartmentResponse> => {
  const res = await sendGet(`/users/department/${departmentId}`);
  return res;
};

export const updateUserProfileDetailed = async (id: string, body: IUpdateUserProfileDetailedBody): Promise<IUpdateUserProfileDetailedResponse> => {
  const res = await sendPut(`/users/${id}/profile`, body);
  return res;
}; 
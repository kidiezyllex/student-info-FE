import { sendPost, sendGet } from "./axios";
import { ILoginBody, IRegisterBody, ICompleteRegistrationBody } from "@/interface/request/auth";
import { ILoginResponse, IRegisterResponse, IProfileResponse } from "@/interface/response/auth";

export const login = async (body: ILoginBody): Promise<ILoginResponse> => {
  const res = await sendPost(`/auth/login`, body);
  return res;
};

export const register = async (body: IRegisterBody): Promise<IRegisterResponse> => {
  const res = await sendPost(`/auth/register`, body);
  return res;
};

export const getProfile = async (): Promise<IProfileResponse> => {
  const res = await sendGet(`/auth/profile`);
  return res;
};

export const completeRegistration = async (body: ICompleteRegistrationBody): Promise<IRegisterResponse> => {
  const res = await sendPost(`/auth/complete-registration`, body);
  return res;
};

import { API_ENDPOINTS } from '@/constants/api';
import { SendVerificationCodeRequest, VerifyCodeRequest } from '@/interface/request/email';
import { SendVerificationCodeResponse, VerifyCodeResponse } from '@/interface/response/email';
import axios from './axios';

export const sendVerificationCode = async (data: SendVerificationCodeRequest): Promise<SendVerificationCodeResponse> => {
  const response = await axios.post<SendVerificationCodeResponse>(API_ENDPOINTS.EMAIL.SEND_VERIFICATION, data);
  return response.data;
};

export const verifyCode = async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
  const response = await axios.post<VerifyCodeResponse>(API_ENDPOINTS.EMAIL.VERIFY_CODE, data);
  return response.data;
};

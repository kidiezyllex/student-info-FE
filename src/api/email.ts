import { API_ENDPOINTS } from '@/constants/api';
import {
  SendVerificationCodeRequest,
  VerifyCodeRequest,
  SendPasswordResetCodeRequest,
  ResetPasswordRequest,
} from '@/interface/request/email';
import {
  SendVerificationCodeResponse,
  VerifyCodeResponse,
  SendPasswordResetCodeResponse,
  ResetPasswordResponse,
} from '@/interface/response/email';
import { sendPost } from './axios';

export const sendVerificationCode = async (data: SendVerificationCodeRequest): Promise<SendVerificationCodeResponse> => {
  return await sendPost(API_ENDPOINTS.EMAIL.SEND_VERIFICATION, data);
};

export const verifyCode = async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
  return await sendPost(API_ENDPOINTS.EMAIL.VERIFY_CODE, data);
};

export const sendVerificationCodeToEmail = async (data: { email: string }): Promise<SendVerificationCodeResponse> => {
  return await sendPost(API_ENDPOINTS.VERIFICATION.SEND_CODE, data);
};

export const verifyCodeFromEmail = async (data: { email: string; code: string }): Promise<VerifyCodeResponse> => {
  return await sendPost(API_ENDPOINTS.VERIFICATION.VERIFY_CODE, data);
};

export const sendPasswordResetCode = async (data: SendPasswordResetCodeRequest): Promise<SendPasswordResetCodeResponse> => {
  return await sendPost(API_ENDPOINTS.VERIFICATION.SEND_PASSWORD_RESET, data);
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  return await sendPost(API_ENDPOINTS.VERIFICATION.RESET_PASSWORD, data);
};

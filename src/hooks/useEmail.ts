import { useMutation } from '@tanstack/react-query';
import { sendVerificationCode, verifyCode, sendVerificationCodeToEmail, verifyCodeFromEmail, sendPasswordResetCode, resetPassword } from '@/api/email';
import { SendVerificationCodeRequest, VerifyCodeRequest, SendPasswordResetCodeRequest, ResetPasswordRequest } from '@/interface/request/email';

export const useSendVerificationCode = () => {
  return useMutation({
    mutationFn: (data: SendVerificationCodeRequest) => sendVerificationCode(data),
  });
};

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: (data: VerifyCodeRequest) => verifyCode(data),
  });
};

export const useSendVerificationCodeToEmail = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => sendVerificationCodeToEmail(data),
  });
};

export const useVerifyCodeFromEmail = () => {
  return useMutation({
    mutationFn: (data: { email: string; code: string }) => verifyCodeFromEmail(data),
  });
};

export const useSendPasswordResetCode = () => {
  return useMutation({
    mutationFn: (data: SendPasswordResetCodeRequest) => sendPasswordResetCode(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
  });
};

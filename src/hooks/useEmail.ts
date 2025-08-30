import { useMutation } from '@tanstack/react-query';
import { sendVerificationCode, verifyCode } from '@/api/email';
import { SendVerificationCodeRequest, VerifyCodeRequest } from '@/interface/request/email';

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

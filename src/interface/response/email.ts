export interface SendVerificationCodeResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresAt: string;
  };
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  data?: {
    verificationToken: string;
    email: string;
  };
}

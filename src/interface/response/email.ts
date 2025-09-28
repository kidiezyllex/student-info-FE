export interface SendVerificationCodeResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresAt: string;
  };
}

export interface VerifyCodeResponse {
  status: boolean;
  message: string;
  data?: {
    email: string;
    verified: boolean;
  };
  errors: Record<string, any>;
  timestamp: string;
}

export interface SendPasswordResetCodeResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresAt: string;
  };
}
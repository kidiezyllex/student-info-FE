export interface SendVerificationCodeRequest {
  email: string;
  name: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface CompleteRegistrationRequest {
  email: string;
  name: string;
  password: string;
  verificationToken: string;
}

export interface SendPasswordResetCodeRequest {
  email: string;
}
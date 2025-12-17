export interface ILoginBody {
  email: string;
  password?: string;
}

export interface IRegisterBody {
  name: string;
  email: string;
  password?: string;
  role?: string;
}

export interface ICompleteRegistrationBody {
  name: string;
  email: string;
  password?: string;
  verificationToken: string;
  role?: string;
} 
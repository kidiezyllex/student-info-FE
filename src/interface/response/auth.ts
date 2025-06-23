export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

export interface ILoginResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    token: string;
  };
}

export interface IRegisterResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
}

export interface IProfileResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    role: string;
  };
} 
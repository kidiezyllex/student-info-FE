import { IStudentInfo, ICoordinatorInfo, IProfileSettings } from './user';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

export interface ILoginResponse {
  status: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isAdmin: boolean;
    token: string;
    department?: string;
  };
  errors: {};
  timestamp: string;
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

export interface IProfileData {
  _id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  active: boolean;
  savedNotifications: any[];
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  lastProfileUpdate: string;
  __v: number;
  studentInfo: IStudentInfo;
  coordinatorInfo: ICoordinatorInfo;
  profileSettings: IProfileSettings;
  department?: {
    _id: string;
    name: string;
    code: string;
    description?: string;
  };
}

export interface IProfileResponse {
  status: boolean;
  message: string;
  data: IProfileData;
  errors: {};
  timestamp: string;
} 
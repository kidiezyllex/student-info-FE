export interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  age: number;
}

export interface IUserProfileResponse {
  statusCode: number;
  message: string;
  data: {
    user: IUserProfile;
  };
}

export interface IUpdateUserProfileResponse {
  statusCode: number;
  message: string;
  data: {
    user: IUserProfile;
  };
}

export interface IDepartmentInfo {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

export interface IAddress {
  street: string;
  ward: string;
  district: string;
  city: string;
  zipCode: string;
}

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface IScholarship {
  name: string;
  amount: number;
  year: string;
  semester: string;
}

export interface IAchievement {
  title: string;
  description: string;
  date: string;
  category: string;
}

export interface IStudentInfo {
  achievements: any[];
  scholarships: any[];
  status: string;
}

export interface IQualification {
  degree: string;
  field: string;
  institution: string;
  year: number;
}

export interface IExperience {
  position: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IPublication {
  title: string;
  journal: string;
  year: number;
  authors: string[];
}

export interface ICoordinatorInfo {
  experience: any[];
  publications: any[];
  qualifications: any[];
  researchInterests: any[];
  specialization: any[];
}

export interface IProfileSettings {
  isPublic: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  emailNotifications: boolean;
}

export interface ISocialLinks {
  facebook: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface IUser {
  _id: string;
  name: string;
  fullName: string;
  email: string;
  studentId: string;
  role: string;
  gender: string;
  department: IDepartmentInfo;
  phoneNumber: string;
  avatar: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserDetailed {
  _id: string;
  name: string;
  fullName: string;
  email: string;
  studentId: string;
  role: string;
  department: IDepartmentInfo;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  address: IAddress;
  emergencyContact: IEmergencyContact;
  studentInfo: IStudentInfo;
  coordinatorInfo: ICoordinatorInfo;
  profileSettings: IProfileSettings;
  socialLinks: ISocialLinks;
  savedNotifications: any[];
  lastLogin: string;
  lastProfileUpdate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetAllUsersResponse {
  message: string;
  data: IUser[];
}

export interface IGetUserByIdResponse {
  message: string;
  data: IUserDetailed;
}

export interface IGetUsersByRoleResponse {
  message: string;
  count: number;
  data: IUser[];
}
export interface IGetUsersByDepartmentResponse {
  message: string;
  count: number;
  data: IUser[];
}

export interface IUpdateUserResponse {
  message: string;
  data: IUser;
}

export interface IUpdateUserProfileDetailedResponse {
  message: string;
  data: IUserDetailed;
}

export interface IDeleteUserResponse {
  message: string;
}

export interface ICreateUserResponse {
  message: string;
  data: IUser;
} 
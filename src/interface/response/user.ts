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

// Department interface for user responses
export interface IDepartmentInfo {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

// Address interface
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

// Student info interfaces
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
  class: string;
  course: string;
  academicYear: string;
  semester: string;
  gpa: number;
  credits: number;
  admissionDate: string;
  expectedGraduationDate: string;
  status: string;
  scholarships: IScholarship[];
  achievements: IAchievement[];
}

// Coordinator info interfaces
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
  position: string;
  officeLocation: string;
  officeHours: string;
  specialization: string[];
  qualifications: IQualification[];
  experience: IExperience[];
  researchInterests: string[];
  publications: IPublication[];
}

// Profile settings interface
export interface IProfileSettings {
  isPublic: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  emailNotifications: boolean;
}

// Social links interface
export interface ISocialLinks {
  facebook: string;
  linkedin: string;
  github: string;
  website: string;
}

// Basic user interface for lists
export interface IUser {
  _id: string;
  name: string;
  fullName: string;
  email: string;
  studentId: string;
  role: string;
  department: IDepartmentInfo;
  phoneNumber: string;
  avatar: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Detailed user interface for single user
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

// API Response interfaces
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
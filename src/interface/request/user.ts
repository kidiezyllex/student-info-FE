export interface IUpdateUserProfileBody {
  name?: string;
  age?: number;
}

export interface IUpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
  studentId?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
  department?: string;
  active?: boolean;
}

export interface ICreateUserBody {
  name: string;
  email: string;
  password: string;
  studentId?: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
  department?: string;
  active?: boolean;
}

export interface IUpdateUserProfileDetailedBody {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
  };
  studentInfo?: {
    class?: string;
    course?: string;
    academicYear?: string;
    semester?: string;
    gpa?: number;
    credits?: number;
    admissionDate?: string;
    expectedGraduationDate?: string;
    status?: string;
    scholarships?: Array<{
      name: string;
      amount: number;
      year: string;
      semester: string;
    }>;
    achievements?: Array<{
      title: string;
      description: string;
      date: string;
      category: string;
    }>;
  };
  coordinatorInfo?: {
    position?: string;
    officeLocation?: string;
    officeHours?: string;
    specialization?: string[];
    qualifications?: Array<{
      degree: string;
      field: string;
      institution: string;
      year: number;
    }>;
    experience?: Array<{
      position: string;
      organization: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    researchInterests?: string[];
    publications?: Array<{
      title: string;
      journal: string;
      year: number;
      authors: string[];
    }>;
  };
  profileSettings?: {
    isPublic?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    allowMessages?: boolean;
    emailNotifications?: boolean;
  };
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
} 
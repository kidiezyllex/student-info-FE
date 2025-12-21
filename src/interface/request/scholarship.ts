export interface ICreateScholarshipBody {
  title: string;
  description: string;
  requirements: string;
  value: string;
  applicationDeadline: string;
  provider: string;
  department: string;
  eligibility: string;
  applicationProcess: string;
}

export interface IUpdateScholarshipBody {
  title?: string;
  description?: string;
  requirements?: string;
  value?: string;
  applicationDeadline?: string;
  provider?: string;
  department?: string;
  eligibility?: string;
  applicationProcess?: string;
}

export interface IScholarshipQueryParams {
  department?: string;
  page?: number;
  limit?: number;
} 
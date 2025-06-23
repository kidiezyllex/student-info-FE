export interface IScholarshipDepartment {
  _id: string;
  name: string;
}

export interface IScholarship {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  value: string;
  applicationDeadline: string;
  provider: string;
  department: IScholarshipDepartment;
  eligibility: string;
  applicationProcess: string;
}

export interface IScholarshipCreate {
  _id: string;
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

export interface IGetActiveScholarshipsResponse {
  message: string;
  data: IScholarship[];
}

export interface IGetAllScholarshipsResponse {
  message: string;
  data: IScholarship[];
}

export interface IGetScholarshipByIdResponse {
  message: string;
  data: IScholarship;
}

export interface ICreateScholarshipResponse {
  message: string;
  data: IScholarshipCreate;
}

export interface IUpdateScholarshipResponse {
  message: string;
  data: IScholarshipCreate;
}

export interface IDeleteScholarshipResponse {
  message: string;
} 
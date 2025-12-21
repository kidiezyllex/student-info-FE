export interface ICoordinator {
  _id: string;
  name: string;
  email: string;
}

export interface IDepartment {
  _id: string;
  name: string;
  code: string;
  description: string;
  coordinator?: ICoordinator;
  coordinatorId?: string;
  createdAt?: string; 
  updatedAt?: string;
  __v?: number;
}

export interface IGetAllDepartmentsResponse {
  message: string;
  data: IDepartment[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface IGetDepartmentByIdResponse {
  message: string;
  data: IDepartment;
}

export interface ICreateDepartmentResponse {
  message: string;
  data: IDepartment;
}

export interface IUpdateDepartmentResponse {
  message: string;
  data: IDepartment;
}

export interface IDeleteDepartmentResponse {
  message: string;
} 
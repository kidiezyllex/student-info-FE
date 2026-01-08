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

export interface IDepartmentStats {
  department: {
    _id: string;
    name: string;
    code: string;
  };
  activeTopics: number;
  studentsCount: number;
  tickets: {
    total: number;
    pending: number;
    resolved: number;
    closed: number;
    byPriority: Array<{
      _id: string;
      count: number;
    }>;
    byCategory: Array<{
      _id: string;
      count: number;
    }>;
    recent: Array<{
      _id: string;
      subject: string;
      status: string;
      priority: string;
      category: string;
      createdAt: string;
      student: {
        _id: string;
        name: string;
        email: string;
        studentId: string;
      };
    }>;
  };
}

export interface IDepartmentStatsResponse {
  status: boolean;
  message: string;
  data: IDepartmentStats;
  timestamp: string;
}
 
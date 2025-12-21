export interface ICreateDepartmentBody {
  name: string;
  code: string;
  description: string;
  coordinatorId?: string;
}

export interface IUpdateDepartmentBody {
  name?: string;
  code?: string;
  description?: string;
  coordinatorId?: string;
} 
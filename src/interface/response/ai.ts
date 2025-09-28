export interface ITrainingHistoryUser {
  name: string;
  email: string;
}

export interface ITrainingHistoryDepartment {
  name: string;
  code: string;
}

export interface ITrainingHistoryItem {
  _id: string;
  status: string;
  datasetCount?: number;
  categories?: string[];
  startedAt: string;
  completedAt?: string;
  error?: string;
  createdBy: ITrainingHistoryUser;
  department?: ITrainingHistoryDepartment;
}

export interface ITrainAIResponse {
  message: string;
  data: {
    trainingId: string;
    status: string;
    startTime: string;
  };
}

export interface IGetTrainingHistoryResponse {
  success: boolean;
  count: number;
  data: ITrainingHistoryItem[];
} 
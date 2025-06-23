import { sendGet, sendPost } from "./axios";
import {
  ITrainAIResponse,
  IGetTrainingHistoryResponse
} from "@/interface/response/ai";
import { ITrainAIBody } from "@/interface/request/ai";

export const trainAI = async (body: ITrainAIBody): Promise<ITrainAIResponse> => {
  const res = await sendPost(`/ai/train`, body);
  return res;
};

export const getTrainingHistory = async (): Promise<IGetTrainingHistoryResponse> => {
  const res = await sendGet(`/ai/training-history`);
  return res;
}; 
import { sendGet } from "./axios";
import { IStatisticsResponse } from "@/interface/response/statistics";

export const getStatistics = async (): Promise<IStatisticsResponse> => {
  const res = await sendGet(`/statistics/summary`);
  return res as IStatisticsResponse;
};

import { sendGet } from "./axios";
import { IActivityLogResponse } from "@/interface/response/activity-log";
import { IActivityLogQueryParams } from "@/interface/request/activity-log";

export const getActivityLogs = async (params: IActivityLogQueryParams): Promise<IActivityLogResponse> => {
  const res = await sendGet("/activity-logs", params);
  return res as IActivityLogResponse;
};

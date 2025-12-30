import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "@/api/activity-log";
import { IActivityLogQueryParams } from "@/interface/request/activity-log";
import { IActivityLogResponse } from "@/interface/response/activity-log";

export const useGetActivityLogs = (params: IActivityLogQueryParams = {}) => {
  return useQuery<IActivityLogResponse, Error>({
    queryKey: ["activity-logs", params],
    queryFn: () => getActivityLogs(params),
    // Optional: Keep previous data while fetching new page for smoother transitions
    placeholderData: (previousData) => previousData,
  });
};

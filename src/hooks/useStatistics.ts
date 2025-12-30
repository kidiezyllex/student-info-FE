import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/api/statistics";
import { IStatisticsResponse } from "@/interface/response/statistics";

export const useGetStatistics = () => {
  return useQuery<IStatisticsResponse, Error>({
    queryKey: ["statistics", "summary"],
    queryFn: getStatistics,
  });
};

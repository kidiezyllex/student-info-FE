import { useQuery } from '@tanstack/react-query';
import {
  getGeneralStatistics,
  getRevenueStatistics,
  getHomeStatistics,
  getContractStatistics,
  getPaymentStatistics,
  getDuePaymentsStatistics,
  getRevenueMonthlyChart,
  getContractsComparisonChart,
  getPaymentStatusChart,
  getRevenueTrendChart,
  getHomesOccupancyChart,
  getContractsGrowthChart,
  getHomesStatusPieChart,
  getContractsDistributionPieChart,
  getPaymentMethodsPieChart,
  getRevenueSourcesPieChart,
  getDashboardOverview,
  getHomesRentalStatusPieChart,
  getPaymentsMonthlyChart
} from '@/api/statistics';
import {
  IGeneralStatisticsResponse,
  IRevenueStatisticsResponse,
  IHomeStatisticsResponse,
  IContractStatisticsResponse,
  IPaymentStatisticsResponse,
  IDuePaymentsStatisticsResponse,
  IBarChartResponse,
  ILineChartResponse,
  IPieChartResponse,
  IDashboardOverviewResponse,
  IHomesRentalStatusPieResponse,
  IPaymentsMonthlyResponse
} from '@/interface/response/statistics';
import { 
  IGetRevenueStatisticsParams, 
  IGetChartParams, 
  IGetDashboardOverviewParams 
} from '@/interface/request/statistics';

export const useGetGeneralStatistics = () => {
  return useQuery<IGeneralStatisticsResponse, Error>({
    queryKey: ['statistics', 'general'],
    queryFn: getGeneralStatistics,
  });
};

export const useGetRevenueStatistics = (params: IGetRevenueStatisticsParams) => {
  return useQuery<IRevenueStatisticsResponse, Error>({
    queryKey: ['statistics', 'revenue', params.year],
    queryFn: () => getRevenueStatistics(params),
    enabled: !!params.year,
  });
};

export const useGetHomeStatistics = () => {
  return useQuery<IHomeStatisticsResponse, Error>({
    queryKey: ['statistics', 'homes'],
    queryFn: getHomeStatistics,
  });
};

export const useGetContractStatistics = () => {
  return useQuery<IContractStatisticsResponse, Error>({
    queryKey: ['statistics', 'contracts'],
    queryFn: getContractStatistics,
  });
};

export const useGetPaymentStatistics = () => {
  return useQuery<IPaymentStatisticsResponse, Error>({
    queryKey: ['statistics', 'payments'],
    queryFn: getPaymentStatistics,
  });
};

export const useGetDuePaymentsStatistics = () => {
  return useQuery<IDuePaymentsStatisticsResponse, Error>({
    queryKey: ['statistics', 'due-payments'],
    queryFn: getDuePaymentsStatistics,
  });
};

// Bar Charts Hooks
export const useGetRevenueMonthlyChart = (params: IGetChartParams) => {
  return useQuery<IBarChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'bar', 'revenue-monthly', params.year],
    queryFn: () => getRevenueMonthlyChart(params),
    enabled: !!params.year,
  });
};

export const useGetContractsComparisonChart = (params: IGetChartParams) => {
  return useQuery<IBarChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'bar', 'contracts-comparison', params.year],
    queryFn: () => getContractsComparisonChart(params),
    enabled: !!params.year,
  });
};

export const useGetPaymentStatusChart = (params: IGetChartParams) => {
  return useQuery<IBarChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'bar', 'payment-status', params.year],
    queryFn: () => getPaymentStatusChart(params),
    enabled: !!params.year,
  });
};

// Line Charts Hooks
export const useGetRevenueTrendChart = (params: IGetChartParams) => {
  return useQuery<ILineChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'line', 'revenue-trend', params.year],
    queryFn: () => getRevenueTrendChart(params),
    enabled: !!params.year,
  });
};

export const useGetHomesOccupancyChart = (params: IGetChartParams) => {
  return useQuery<ILineChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'line', 'homes-occupancy', params.year],
    queryFn: () => getHomesOccupancyChart(params),
    enabled: !!params.year,
  });
};

export const useGetContractsGrowthChart = (params: IGetChartParams) => {
  return useQuery<ILineChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'line', 'contracts-growth', params.year],
    queryFn: () => getContractsGrowthChart(params),
    enabled: !!params.year,
  });
};

// Pie Charts Hooks
export const useGetHomesStatusPieChart = () => {
  return useQuery<IPieChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'pie', 'homes-status'],
    queryFn: getHomesStatusPieChart,
  });
};

export const useGetContractsDistributionPieChart = () => {
  return useQuery<IPieChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'pie', 'contracts-distribution'],
    queryFn: getContractsDistributionPieChart,
  });
};

export const useGetPaymentMethodsPieChart = () => {
  return useQuery<IPieChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'pie', 'payment-methods'],
    queryFn: getPaymentMethodsPieChart,
  });
};

export const useGetRevenueSourcesPieChart = (params: IGetChartParams) => {
  return useQuery<IPieChartResponse, Error>({
    queryKey: ['statistics', 'charts', 'pie', 'revenue-sources', params.year],
    queryFn: () => getRevenueSourcesPieChart(params),
    enabled: !!params.year,
  });
};

// Dashboard Overview Hook
export const useGetDashboardOverview = (params: IGetDashboardOverviewParams = {}) => {
  const year = params.year || new Date().getFullYear();
  return useQuery<IDashboardOverviewResponse, Error>({
    queryKey: ['statistics', 'dashboard', 'overview', year],
    queryFn: () => getDashboardOverview(params),
  });
};

// Homes Rental Status Pie Chart Hook
export const useGetHomesRentalStatusPieChart = () => {
  return useQuery<IHomesRentalStatusPieResponse, Error>({
    queryKey: ['statistics', 'charts', 'pie', 'homes-rental-status'],
    queryFn: getHomesRentalStatusPieChart,
  });
};

// Payments Monthly Line Chart Hook
export const useGetPaymentsMonthlyChart = (params: IGetChartParams) => {
  return useQuery<IPaymentsMonthlyResponse, Error>({
    queryKey: ['statistics', 'charts', 'line', 'payments-monthly', params.year],
    queryFn: () => getPaymentsMonthlyChart(params),
    enabled: !!params.year,
  });
}; 
import { sendGet } from "./axios";
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
} from "@/interface/response/statistics";
import { 
  IGetRevenueStatisticsParams, 
  IGetChartParams, 
  IGetDashboardOverviewParams 
} from "@/interface/request/statistics";

export const getGeneralStatistics = async (): Promise<IGeneralStatisticsResponse> => {
  const res = await sendGet(`/statistics/general`);
  return res;
};

export const getRevenueStatistics = async (params: IGetRevenueStatisticsParams): Promise<IRevenueStatisticsResponse> => {
  const res = await sendGet(`/statistics/revenue?year=${params.year}`);
  return res;
};

export const getHomeStatistics = async (): Promise<IHomeStatisticsResponse> => {
  const res = await sendGet(`/statistics/homes`);
  return res;
};

export const getContractStatistics = async (): Promise<IContractStatisticsResponse> => {
  const res = await sendGet(`/statistics/contracts`);
  return res;
};

export const getPaymentStatistics = async (): Promise<IPaymentStatisticsResponse> => {
  const res = await sendGet(`/statistics/payments`);
  return res;
};

export const getDuePaymentsStatistics = async (): Promise<IDuePaymentsStatisticsResponse> => {
  const res = await sendGet(`/statistics/due-payments`);
  return res;
};

// Bar Charts APIs
export const getRevenueMonthlyChart = async (params: IGetChartParams): Promise<IBarChartResponse> => {
  const res = await sendGet(`/statistics/charts/bar/revenue-monthly?year=${params.year}`);
  return res;
};

export const getContractsComparisonChart = async (params: IGetChartParams): Promise<IBarChartResponse> => {
  const res = await sendGet(`/statistics/charts/bar/contracts-comparison?year=${params.year}`);
  return res;
};

export const getPaymentStatusChart = async (params: IGetChartParams): Promise<IBarChartResponse> => {
  const res = await sendGet(`/statistics/charts/bar/payment-status?year=${params.year}`);
  return res;
};

// Line Charts APIs
export const getRevenueTrendChart = async (params: IGetChartParams): Promise<ILineChartResponse> => {
  const res = await sendGet(`/statistics/charts/line/revenue-trend?year=${params.year}`);
  return res;
};

export const getHomesOccupancyChart = async (params: IGetChartParams): Promise<ILineChartResponse> => {
  const res = await sendGet(`/statistics/charts/line/homes-occupancy?year=${params.year}`);
  return res;
};

export const getContractsGrowthChart = async (params: IGetChartParams): Promise<ILineChartResponse> => {
  const res = await sendGet(`/statistics/charts/line/contracts-growth?year=${params.year}`);
  return res;
};

// Pie Charts APIs
export const getHomesStatusPieChart = async (): Promise<IPieChartResponse> => {
  const res = await sendGet(`/statistics/charts/pie/homes-status`);
  return res;
};

export const getContractsDistributionPieChart = async (): Promise<IPieChartResponse> => {
  const res = await sendGet(`/statistics/charts/pie/contracts-distribution`);
  return res;
};

export const getPaymentMethodsPieChart = async (): Promise<IPieChartResponse> => {
  const res = await sendGet(`/statistics/charts/pie/payment-methods`);
  return res;
};

export const getRevenueSourcesPieChart = async (params: IGetChartParams): Promise<IPieChartResponse> => {
  const res = await sendGet(`/statistics/charts/pie/revenue-sources?year=${params.year}`);
  return res;
};

// Dashboard Overview API
export const getDashboardOverview = async (params: IGetDashboardOverviewParams): Promise<IDashboardOverviewResponse> => {
  const year = params.year || new Date().getFullYear();
  const res = await sendGet(`/statistics/dashboard/overview?year=${year}`);
  return res;
};

// Homes Rental Status Pie Chart API
export const getHomesRentalStatusPieChart = async (): Promise<IHomesRentalStatusPieResponse> => {
  const res = await sendGet(`/statistics/charts/pie/homes-rental-status`);
  return res;
};

// Payments Monthly Line Chart API
export const getPaymentsMonthlyChart = async (params: IGetChartParams): Promise<IPaymentsMonthlyResponse> => {
  const year = params.year || new Date().getFullYear();
  const res = await sendGet(`/statistics/charts/line/payments-monthly?year=${year}`);
  return res;
}; 